import { ImageResponse } from "next/og";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/constants";
import { OgMark } from "@/components/brand/og-mark";

export const alt = `${SITE_NAME} — original fiction across every genre`;
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function TwitterImage() {
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
            justifyContent: "center",
            alignItems: "center",
            padding: "72px 80px",
            height: "100%",
            position: "relative",
            gap: 36,
          }}
        >
          <OgMark size={80} />

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 16,
            }}
          >
            <span
              style={{
                fontSize: 56,
                fontWeight: 700,
                color: "#fafafa",
                letterSpacing: "-0.025em",
              }}
            >
              {SITE_NAME}
            </span>
            <span
              style={{
                fontSize: 22,
                color: "#f97316",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.15em",
              }}
            >
              Original Fiction Magazine
            </span>
          </div>

          <p
            style={{
              fontSize: 24,
              lineHeight: 1.5,
              color: "#a1a1aa",
              maxWidth: 700,
              margin: 0,
              textAlign: "center",
            }}
          >
            {SITE_DESCRIPTION}
          </p>
        </div>
      </div>
    ),
    { ...size },
  );
}
