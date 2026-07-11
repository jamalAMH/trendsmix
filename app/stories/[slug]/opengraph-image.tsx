import { ImageResponse } from "next/og";
import { notFound } from "next/navigation";
import { SITE_NAME } from "@/lib/constants";
import { getStoryBySlug } from "@/lib/stories";
import { formatCategory } from "@/lib/utils";
import { OgMark } from "@/components/brand/og-mark";

export const alt = "TrendsMix story";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

interface StoryOpenGraphImageProps {
  params: Promise<{ slug: string }>;
}

export default async function StoryOpenGraphImage({
  params,
}: StoryOpenGraphImageProps) {
  const { slug } = await params;
  const story = await getStoryBySlug(slug);

  if (!story) {
    notFound();
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#09090b",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -100,
            left: -80,
            width: 450,
            height: 450,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(249,115,22,0.1) 0%, transparent 70%)",
          }}
        />

        <div
          style={{
            position: "absolute",
            top: 0,
            left: 80,
            right: 80,
            height: 4,
            background:
              "linear-gradient(90deg, transparent 0%, #f97316 30%, #f59e0b 70%, transparent 100%)",
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "64px 80px",
            height: "100%",
            position: "relative",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div
                style={{
                  padding: "8px 20px",
                  borderRadius: 999,
                  background: "rgba(249, 115, 22, 0.12)",
                  color: "#fb923c",
                  fontSize: 22,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                }}
              >
                {formatCategory(story.category)}
              </div>
              <span style={{ fontSize: 22, color: "#71717a" }}>
                {story.readTime} min read
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <OgMark size={40} />
              <span
                style={{
                  fontSize: 26,
                  fontWeight: 700,
                  color: "#fafafa",
                }}
              >
                {SITE_NAME}
              </span>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <p
              style={{
                fontSize: 62,
                fontWeight: 700,
                lineHeight: 1.08,
                color: "#fafafa",
                maxWidth: 920,
                margin: 0,
                letterSpacing: "-0.025em",
              }}
            >
              {story.title}
            </p>
            <p
              style={{
                fontSize: 28,
                lineHeight: 1.45,
                color: "#d4d4d8",
                maxWidth: 880,
                margin: 0,
              }}
            >
              {story.excerpt}
            </p>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span style={{ fontSize: 24, color: "#a1a1aa" }}>
              By {story.author.name}
            </span>
            <span
              style={{
                fontSize: 20,
                color: "#f97316",
                fontWeight: 600,
                letterSpacing: "0.05em",
              }}
            >
              trendsmix.com
            </span>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
