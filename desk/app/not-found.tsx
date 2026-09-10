import Link from "next/link";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { Kicker, PillLink } from "@/components/ui";

export default function NotFound() {
  return (
    <>
      <SiteNav />
      <main id="main" className="mx-auto max-w-[var(--page-max-width)] px-6 sm:px-10">
        <section className="py-32 text-center">
          <Kicker>404</Kicker>
          <h1 className="mt-6 font-untitled-serif text-heading font-normal sm:text-heading-lg">
            This page was never written to memory.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-body-lg text-graphite">
            A fresh process would have no idea you were here. Fortunately,
            you&apos;re still running in this one.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <PillLink href="/" tone="blue">
              Back to the landing page
            </PillLink>
            <Link
              href="/console"
              className="text-body-sm uppercase tracking-[0.08em] text-graphite underline-offset-4 hover:text-off-black hover:underline"
            >
              Open the console →
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
