import Image from "next/image";
import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-[var(--section-gap)] border-t border-ash">
      <div className="mx-auto max-w-[var(--page-max-width)] px-6 py-16 sm:px-10">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-md">
            <div className="flex items-center gap-4">
              <Image src="/calliope-logo.png" alt="" width={32} height={32} />
              <span className="font-untitled-serif text-subheading font-normal">Calliope</span>
            </div>
            <p className="mt-4 text-body text-graphite">
              Your agents are employees. Calliope is the company — the charter,
              standards, vendor history, and unfinished work live in memory, not
              in a session.
            </p>
          </div>

          <nav aria-label="Footer" className="flex flex-col gap-3">
            <Link href="/product" className="press text-body text-graphite hover:text-off-black">Product</Link>
            <Link href="/memory" className="press text-body text-graphite hover:text-off-black">Memory</Link>
            <Link href="/evidence" className="press text-body text-graphite hover:text-off-black">Evidence</Link>
            <Link href="/console" className="press text-body text-graphite hover:text-off-black">Console</Link>
            <Link href="/about" className="press text-body text-graphite hover:text-off-black">About</Link>
          </nav>

          <div className="flex flex-col gap-3">
            <a
              href="https://github.com/emmaGH1/calliope"
              target="_blank"
              rel="noreferrer"
              className="press text-body text-graphite hover:text-off-black"
            >
              github.com/emmaGH1/calliope
            </a>
            <p className="text-body text-graphite">MIT licensed</p>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-ash pt-6 text-body-sm text-graphite sm:flex-row sm:items-center sm:justify-between">
          <p>Built with Sibyl Memory.</p>
          <p>Built for the Sibyl Labs Hackathon.</p>
        </div>
      </div>
    </footer>
  );
}
