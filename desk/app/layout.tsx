import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Calliope — the organization that survives its workers",
    template: "%s — Calliope",
  },
  description:
    "Calliope is a restart-safe organization of AI workers whose charter, standards, vendor history, and unfinished work live in Sibyl Memory.",
  icons: { icon: "/calliope-logo.png", apple: "/calliope-logo.png" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-abc-diatype-mono antialiased">{children}</body>
    </html>
  );
}
