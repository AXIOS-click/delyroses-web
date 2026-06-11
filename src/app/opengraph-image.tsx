import { ImageResponse } from "next/og";

import { siteConfig } from "@/lib/site";

export const alt = "Dely Roses - rosas y arreglos florales";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "linear-gradient(135deg, #FFF9F7 0%, #FCE5EC 48%, #FFF4EA 100%)",
          color: "#3B252B",
          padding: "72px",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: 6, textTransform: "uppercase", color: "#B86B84" }}>
          {siteConfig.name}
        </div>
        <div style={{ maxWidth: 860, marginTop: 28, fontSize: 84, fontWeight: 700, lineHeight: 0.95, letterSpacing: -5 }}>
          Rosas y arreglos florales para regalar
        </div>
      </div>
    ),
    size,
  );
}
