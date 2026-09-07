import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";

export default function LandingPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1 px-6 py-16 text-ink-muted">LandingPage</main>
      <SiteFooter />
    </>
  );
}
