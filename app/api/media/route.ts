import { NextResponse } from "next/server";
import { verifyApiKey } from "@/lib/api-auth";
import { fetchImageUrlFromPage } from "@/lib/extract-page-image";
import { mirrorImageToStorage } from "@/lib/mirror-image";
import { isBrokenExternalImage } from "@/lib/placeholder-image";
import { isN8nEnabled } from "@/lib/settings";
import { createServiceClient } from "@/lib/supabase/service";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/avif",
]);

interface MediaJsonBody {
  url?: string;
  post_image?: string;
  image?: string;
  page_url?: string;
  comment_links?: string;
}

function extensionForType(contentType: string): string {
  switch (contentType) {
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/gif":
      return "gif";
    case "image/webp":
      return "webp";
    case "image/avif":
      return "avif";
    default:
      return "jpg";
  }
}

function sniffImageType(buffer: Buffer): string | null {
  if (
    buffer.length >= 3 &&
    buffer[0] === 0xff &&
    buffer[1] === 0xd8 &&
    buffer[2] === 0xff
  ) {
    return "image/jpeg";
  }
  if (
    buffer.length >= 8 &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47
  ) {
    return "image/png";
  }
  if (
    buffer.length >= 6 &&
    buffer[0] === 0x47 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46
  ) {
    return "image/gif";
  }
  if (
    buffer.length >= 12 &&
    buffer.toString("ascii", 0, 4) === "RIFF" &&
    buffer.toString("ascii", 8, 12) === "WEBP"
  ) {
    return "image/webp";
  }
  return null;
}

function mediaResponse(publicUrl: string) {
  return NextResponse.json(
    { ok: true, url: publicUrl, post_image: publicUrl },
    { status: 201 },
  );
}

async function mirrorFromRemoteUrl(
  storage: NonNullable<ReturnType<typeof createServiceClient>>,
  sourceUrl: string,
) {
  if (isBrokenExternalImage(sourceUrl)) {
    return NextResponse.json(
      {
        error:
          "Facebook image URLs expire and cannot be mirrored. Use page_url or an article image URL.",
      },
      { status: 400 },
    );
  }

  const mirrored = await mirrorImageToStorage(storage, sourceUrl);
  if (!mirrored) {
    return NextResponse.json(
      { error: `Could not download image: ${sourceUrl.slice(0, 120)}` },
      { status: 502 },
    );
  }

  return mediaResponse(mirrored);
}

async function handleJsonBody(
  storage: NonNullable<ReturnType<typeof createServiceClient>>,
  request: Request,
) {
  let body: MediaJsonBody;
  try {
    body = (await request.json()) as MediaJsonBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const directUrl =
    body.url?.trim() || body.post_image?.trim() || body.image?.trim() || null;
  const pageUrl = body.page_url?.trim() || body.comment_links?.trim() || null;

  if (directUrl && !isBrokenExternalImage(directUrl)) {
    return mirrorFromRemoteUrl(storage, directUrl);
  }

  if (pageUrl) {
    const discovered = await fetchImageUrlFromPage(pageUrl);
    if (!discovered) {
      return NextResponse.json(
        { error: "No image found on the article page." },
        { status: 404 },
      );
    }
    if (isBrokenExternalImage(discovered)) {
      return NextResponse.json(
        {
          error:
            "Article page only exposes a Facebook image, which cannot be mirrored.",
        },
        { status: 400 },
      );
    }
    return mirrorFromRemoteUrl(storage, discovered);
  }

  if (directUrl && isBrokenExternalImage(directUrl)) {
    return NextResponse.json(
      {
        error:
          "Facebook image URL detected. Send page_url or comment_links instead.",
      },
      { status: 400 },
    );
  }

  return NextResponse.json(
    { error: "Provide url/post_image or page_url/comment_links." },
    { status: 400 },
  );
}

export async function POST(request: Request) {
  const authError = verifyApiKey(request);
  if (authError) return authError;

  if (!(await isN8nEnabled())) {
    return NextResponse.json(
      { error: "n8n auto-publish is disabled in Control Center." },
      { status: 503 },
    );
  }

  const storage = createServiceClient();
  if (!storage) {
    return NextResponse.json(
      {
        error:
          "Image storage is not configured. Add SUPABASE_SERVICE_ROLE_KEY.",
      },
      { status: 503 },
    );
  }

  const contentTypeHeader = request.headers.get("content-type") ?? "";

  if (contentTypeHeader.includes("application/json")) {
    return handleJsonBody(storage, request);
  }

  let buffer: Buffer;
  let contentType: string;
  let filename: string;

  if (contentTypeHeader.includes("multipart/form-data")) {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file provided." }, { status: 400 });
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: "File type not allowed. Use JPEG, PNG, GIF, WebP, or AVIF." },
        { status: 400 },
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 10 MB." },
        { status: 400 },
      );
    }

    buffer = Buffer.from(await file.arrayBuffer());
    contentType = file.type;
    filename = file.name;
  } else {
    const arrayBuffer = await request.arrayBuffer();
    buffer = Buffer.from(arrayBuffer);

    if (buffer.length === 0) {
      return NextResponse.json({ error: "Empty file body." }, { status: 400 });
    }

    if (buffer.length > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 10 MB." },
        { status: 400 },
      );
    }

    contentType = contentTypeHeader.split(";")[0].trim().toLowerCase();
    if (!ALLOWED_TYPES.has(contentType)) {
      const sniffed = sniffImageType(buffer);
      if (sniffed) {
        contentType = sniffed;
      } else if (contentType === "application/octet-stream") {
        contentType = "image/jpeg";
      } else {
        return NextResponse.json(
          { error: "Unsupported content-type. Send an image binary body." },
          { status: 400 },
        );
      }
    }

    const disposition = request.headers.get("content-disposition") ?? "";
    const match = disposition.match(/filename="?([^";]+)"?/i);
    filename = match?.[1] ?? `upload.${extensionForType(contentType)}`;
  }

  const ext =
    filename.split(".").pop()?.toLowerCase() ?? extensionForType(contentType);
  const safeName = `imports/n8n-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const { data, error } = await storage.storage
    .from("media")
    .upload(safeName, buffer, { contentType, upsert: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const {
    data: { publicUrl },
  } = storage.storage.from("media").getPublicUrl(data.path);

  return mediaResponse(publicUrl);
}
