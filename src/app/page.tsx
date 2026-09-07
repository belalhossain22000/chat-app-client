import type { Metadata } from "next";
import { SmoothScroll } from "@/features/landing/SmoothScroll";
import { Reveal } from "@/features/landing/Reveal";
import { BackToTop } from "@/features/landing/BackToTop";
import { AssistantWidget } from "@/features/landing/AssistantWidget";
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

export const metadata: Metadata = {
  title: "ChatFlow — Real-time chat for teams and friends",
  description:
    "ChatFlow is a beautifully simple real-time chat app. One-to-one and group conversations with instant delivery, live updates, and a message experience built for focus.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "ChatFlow — Real-time chat for teams and friends",
    description:
      "One-to-one and group conversations with instant delivery and live updates.",
    url: "/",
    type: "website",
  },
};

const sections = [
  RealtimeSection,
  CoreFeatures,
  HowItWorks,
  CleanerExperience,
  GroupCollaboration,
  EveryScreen,
  SmartDetails,
  FinalCta,
];

export default function LandingPage() {
  return (
    <SmoothScroll>
      <SiteHeader />
      <main className="flex-1">
        <Reveal>
          <Hero />
        </Reveal>
        {sections.map((Section, i) => (
          <Reveal key={i}>
            <Section />
          </Reveal>
        ))}
      </main>
      <SiteFooter />
      <BackToTop />
      <AssistantWidget />
    </SmoothScroll>
  );
}
