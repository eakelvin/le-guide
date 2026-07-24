import Link from "next/link";
import { routing } from "@/i18n/routing";

export const metadata = {
  title: "Page not found | LeGuide",
  robots: { index: false, follow: true },
};

/** Root-level 404 (invalid locale or unmatched routes outside locale layout). */
export default function RootNotFound() {
  const home = `/${routing.defaultLocale}`;
  const guides = `/${routing.defaultLocale}/guides`;

  return (
    <html lang={routing.defaultLocale}>
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif", background: "#faf8f5", color: "#2c241b" }}>
        <main
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
            textAlign: "center",
            gap: 16,
          }}
        >
          <p style={{ fontSize: 14, letterSpacing: "0.12em", textTransform: "uppercase", color: "#6b5e52" }}>
            404
          </p>
          <h1 style={{ fontSize: 32, fontWeight: 500, margin: 0 }}>Page not found</h1>
          <p style={{ maxWidth: 420, color: "#6b5e52", lineHeight: 1.5, margin: 0 }}>
            This page does not exist or may have moved. Head back to LeGuide or browse our guides.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center", marginTop: 8 }}>
            <Link
              href={home}
              style={{
                background: "#1a3d2e",
                color: "#fff",
                padding: "10px 18px",
                borderRadius: 999,
                textDecoration: "none",
                fontSize: 14,
              }}
            >
              Home
            </Link>
            <Link
              href={guides}
              style={{
                border: "1px solid #d4cbc0",
                color: "#2c241b",
                padding: "10px 18px",
                borderRadius: 999,
                textDecoration: "none",
                fontSize: 14,
              }}
            >
              Guides
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}
