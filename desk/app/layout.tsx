import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Charter — the org that lives in memory",
  description:
    "Your agents are employees. Charter is the company. Kill every process; the org reassembles from Sibyl Memory.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-mono-ui antialiased">{children}</body>
    </html>
  );
}
