import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Hero } from "@/features/landing/components/Hero";
import { RealtimeSection } from "@/features/landing/components/RealtimeSection";
import { CoreFeatures } from "@/features/landing/components/CoreFeatures";
import { HowItWorks } from "@/features/landing/components/HowItWorks";
import { CleanerExperience } from "@/features/landing/components/CleanerExperience";
import { GroupCollaboration } from "@/features/landing/components/GroupCollaboration";
import { EveryScreen } from "@/features/landing/components/EveryScreen";
import { SmartDetails } from "@/features/landing/components/SmartDetails";
import { FinalCta } from "@/features/landing/components/FinalCta";

export default function LandingPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <RealtimeSection />
        <CoreFeatures />
        <HowItWorks />
        <CleanerExperience />
        <GroupCollaboration />
        <EveryScreen />
        <SmartDetails />
        <FinalCta />
      </main>
      <SiteFooter />
    </>
  );
}
