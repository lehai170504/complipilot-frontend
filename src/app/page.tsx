import { LandingHeader } from "@/components/landing/landing-header";
import { LandingHero } from "@/components/landing/landing-hero";
import { LandingMockup } from "@/components/landing/landing-mockup";
import { LandingFeatures } from "@/components/landing/landing-features";
import { LandingHighlights } from "@/components/landing/landing-highlights";
import { LandingFooter } from "@/components/landing/landing-footer";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary/30 selection:text-primary-foreground">
      <section className="relative overflow-hidden flex flex-col">
        {/* Ambient Glows */}
        <div className="pointer-events-none absolute left-1/2 top-0 size-[520px] -translate-x-1/2 rounded-full bg-primary/20 blur-[120px]" />
        <div className="pointer-events-none absolute -right-32 top-40 size-80 rounded-full bg-accent/20 blur-[100px]" />

        <LandingHeader />

        <LandingHero />

        <LandingMockup />

        <LandingFeatures />

        <LandingHighlights />

      </section>
      <LandingFooter />
    </main>
  );
}
