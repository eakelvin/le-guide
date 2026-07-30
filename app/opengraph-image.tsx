import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { siteConfig } from "@/lib/seo/site";

export const alt = "LeGuide — Student admin guide for France";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const logoBytes = await readFile(join(process.cwd(), "public/logo-mark.png"));
  const logoSrc = `data:image/png;base64,${logoBytes.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(145deg, #faf8f5 0%, #e8f0eb 55%, #d4e5db 100%)",
          padding: 72,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <img src={logoSrc} width={72} height={72} alt="" style={{ borderRadius: 16 }} />
          <div
            style={{
              display: "flex",
              fontSize: 42,
              fontWeight: 600,
              color: "#1a3d2e",
              letterSpacing: "-0.02em",
            }}
          >
            {siteConfig.name}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div
            style={{
              display: "flex",
              fontSize: 64,
              fontWeight: 500,
              color: "#2c241b",
              lineHeight: 1.15,
              letterSpacing: "-0.03em",
              maxWidth: 900,
            }}
          >
            Navigate France without the administrative struggles
          </div>
          <div style={{ display: "flex", fontSize: 28, color: "#6b5e52", maxWidth: 800 }}>
            Step-by-step guides for international students — visa, CAF, healthcare, and more.
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
