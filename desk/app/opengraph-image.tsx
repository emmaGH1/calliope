import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f6f3f1",
          color: "#242424",
          padding: "72px 80px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 18,
              height: 18,
              borderRadius: 9999,
              background: "#242424",
              display: "flex",
            }}
          />
          <div style={{ fontSize: 26, letterSpacing: 2 }}>CALLIOPE</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 64, lineHeight: 1.15, maxWidth: 900 }}>
            Your agents are employees. Calliope is the company.
          </div>
          <div style={{ fontSize: 30, color: "#4e4d4d", maxWidth: 860 }}>
            The charter, standards, vendor history, and unfinished work live in
            Sibyl Memory. Kill the process; the org reassembles.
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 24, color: "#797776" }}>
          <div>24/24 deletion checks · MCP · local first</div>
          <div>github.com/emmaGH1/calliope</div>
        </div>
      </div>
    ),
    size
  );
}
