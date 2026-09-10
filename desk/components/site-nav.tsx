"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const LINKS = [
  { href: "/product", label: "Product" },
  { href: "/memory", label: "Memory" },
  { href: "/evidence", label: "Evidence" },
  { href: "/about", label: "About" },
];

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="border-b border-ash">
      <div className="mx-auto flex h-20 max-w-[var(--page-max-width)] items-center justify-between gap-6 px-6 sm:px-10">
        <Link href="/" className="flex items-center gap-4" aria-label="Calliope home">
          <Image src="/calliope-logo.png" alt="" width={38} height={38} priority />
          <span className="font-untitled-serif text-heading-sm font-normal">Calliope</span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-8 lg:flex">
          {LINKS.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={active ? "page" : undefined}
                className={`press text-label uppercase tracking-[0.06em] ${
                  active ? "font-medium text-off-black" : "text-graphite hover:text-off-black"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a
            href="https://github.com/emmaGH1/calliope"
            target="_blank"
            rel="noreferrer"
            className="press rounded-full border border-off-black px-6 py-3 text-body-sm uppercase tracking-[0.08em] hover:bg-off-black hover:text-parchment"
          >
            GitHub
          </a>
          <Link
            href="/console"
            className="press rounded-full bg-lake-blue px-6 py-3 text-body-sm uppercase tracking-[0.08em] text-parchment hover:bg-off-black"
          >
            Open console
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="site-menu"
          className="press rounded-full border border-off-black px-5 py-2 text-body-sm uppercase tracking-[0.08em] lg:hidden"
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      {open && (
        <nav
          id="site-menu"
          aria-label="Primary mobile"
          className="border-t border-ash px-6 py-6 lg:hidden"
        >
          <ul className="flex flex-col gap-4">
            {LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="text-label uppercase tracking-[0.06em] text-graphite"
                >
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/console" onClick={() => setOpen(false)} className="text-label uppercase tracking-[0.06em] text-lake-blue">
                Open console
              </Link>
            </li>
            <li>
              <a
                href="https://github.com/emmaGH1/calliope"
                target="_blank"
                rel="noreferrer"
                className="text-label uppercase tracking-[0.06em] text-graphite"
              >
                GitHub
              </a>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
