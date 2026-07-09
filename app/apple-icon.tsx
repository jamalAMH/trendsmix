import { ImageResponse } from "next/og";
import { OgMark } from "@/components/brand/og-mark";

export const size = {
  width: 180,
  height: 180,
};

export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(<OgMark size={180} />, { ...size });
}
