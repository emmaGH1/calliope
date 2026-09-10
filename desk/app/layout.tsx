import type { Metadata } from "next";
import { Instrument_Serif, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

/**
 * DESIGN.md calls for Untitled Serif + ABC Diatype Mono.
 * Closest high-quality public faces: Instrument Serif (editorial display)
 * and IBM Plex Mono (technical manual UI). Loaded via next/font so they
 * ship with the site instead of falling back to Georgia/system mono.
 */
const serif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-serif-face",
  display: "swap",
});

const mono = IBM_Plex_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-mono-face",
  display: "swap",
});

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
    <html lang="en" className={`${serif.variable} ${mono.variable}`}>
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
