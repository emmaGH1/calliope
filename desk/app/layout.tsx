import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3737"),
  title: {
    default: "Calliope — the organization that survives its workers",
    template: "%s — Calliope",
  },
  description:
    "Calliope is a restart-safe organization of AI workers whose charter, standards, vendor history, and unfinished work live in Sibyl Memory.",
  icons: { icon: "/calliope-logo.png", apple: "/calliope-logo.png" },
  openGraph: {
    title: "Calliope — the organization that survives its workers",
    description:
      "The charter, standards, vendor history, and unfinished work live in Sibyl Memory. Kill the process; the org reassembles.",
    siteName: "Calliope",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Calliope — the organization that survives its workers",
    description: "AI workers you can kill. A company that survives them.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-abc-diatype-mono antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-off-black focus:px-6 focus:py-3 focus:text-body-sm focus:text-parchment"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
