import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteNav />
      <main className="mx-auto max-w-[var(--page-max-width)] px-6 sm:px-10">{children}</main>
      <SiteFooter />
    </>
  );
}
