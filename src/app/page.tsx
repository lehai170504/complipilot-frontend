import { LandingHeader } from "@/components/landing/landing-header";
import { LandingHero } from "@/components/landing/landing-hero";
import { LandingMockup } from "@/components/landing/landing-mockup";
import { LandingFeatures } from "@/components/landing/landing-features";
import { LandingHighlights } from "@/components/landing/landing-highlights";
import { LandingFooter } from "@/components/landing/landing-footer";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary/30 selection:text-primary-foreground">
      <section className="relative flex flex-col overflow-hidden">

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
