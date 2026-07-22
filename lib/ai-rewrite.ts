import { stripHtml } from "@/lib/content-cleanup";

const REWRITE_MODEL = "gpt-4o";

export function isAiRewriteConfigured(): boolean {
  return !!process.env.OPENAI_API_KEY?.trim();
}

export async function rewritePostWithAi(
  title: string,
  content: string,
): Promise<{ title: string; content: string; excerpt: string } | null> {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) return null;

  const plain = stripHtml(content).slice(0, 12000);
  if (!plain) return null;

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: REWRITE_MODEL,
      temperature: 0.7,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You rewrite articles for TrendsMix, an English-language story and ideas site. " +
            "Rewrite completely in your own words — do not copy phrasing. Keep facts and story arc. " +
            "Use clear HTML: <p> paragraphs and <h2> section headings where helpful. " +
            "Minimum 500 words when source allows. No social CTAs, no 'continued on next page', no Facebook references. " +
            'Return JSON: {"title":"...","excerpt":"...","content":"..."} where excerpt is 140-160 chars.',
        },
        {
          role: "user",
          content: `Title: ${title}\n\nArticle:\n${plain}`,
        },
      ],
    }),
    signal: AbortSignal.timeout(90_000),
  });

  if (!res.ok) return null;

  const data = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };

  const raw = data.choices?.[0]?.message?.content;
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as {
      title?: string;
      excerpt?: string;
      content?: string;
    };
    if (!parsed.content?.trim()) return null;

    return {
      title: parsed.title?.trim() || title,
      content: parsed.content.trim(),
      excerpt: parsed.excerpt?.trim() || "",
    };
  } catch {
    return null;
  }
}
