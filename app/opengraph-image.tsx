import { ImageResponse } from "next/og";
import { SITE_DESCRIPTION, SITE_DOMAIN, SITE_NAME } from "@/lib/constants";
import { OgMark } from "@/components/brand/og-mark";

export const alt = `${SITE_NAME} — original fiction across every genre`;
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
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
            top: -120,
            right: -80,
            width: 500,
            height: 500,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(249,115,22,0.12) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -100,
            left: -60,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)",
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
            padding: "72px 80px",
            height: "100%",
            position: "relative",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <OgMark size={64} />
            <span
              style={{
                fontSize: 44,
                fontWeight: 700,
                color: "#fafafa",
                letterSpacing: "-0.02em",
              }}
            >
              {SITE_NAME}
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <p
              style={{
                fontSize: 60,
                fontWeight: 700,
                lineHeight: 1.1,
                color: "#fafafa",
                maxWidth: 900,
                margin: 0,
                letterSpacing: "-0.025em",
              }}
            >
              Stories worth losing
              <br />
              sleep over.
            </p>
            <p
              style={{
                fontSize: 26,
                lineHeight: 1.5,
                color: "#a1a1aa",
                maxWidth: 780,
                margin: 0,
              }}
            >
              {SITE_DESCRIPTION}
            </p>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", gap: 32 }}>
              {["Horror", "Mystery", "Romance", "Fantasy", "Sci-Fi", "Drama"].map(
                (genre) => (
                  <span
                    key={genre}
                    style={{
                      fontSize: 18,
                      color: "#71717a",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      fontWeight: 500,
                    }}
                  >
                    {genre}
                  </span>
                ),
              )}
            </div>
            <span
              style={{
                fontSize: 20,
                color: "#f97316",
                fontWeight: 600,
                letterSpacing: "0.05em",
              }}
            >
              {SITE_DOMAIN}
            </span>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
