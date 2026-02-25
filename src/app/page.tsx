import { HeroSectionPencilTest } from "@/components/landing/hero-section-pencil-test";
import { IntegrationBar } from "@/components/landing/integration-bar";
import { ProblemSection } from "@/components/landing/problem-section";
import { HowItWorks } from "@/components/landing/how-it-works";
import { FeaturesGrid } from "@/components/landing/features-grid";
import { SocialProof } from "@/components/landing/social-proof";
import { CtaSection } from "@/components/landing/cta-section";

export default function HomePage() {
  return (
    <>
      <HeroSectionPencilTest />
      <IntegrationBar />
      <ProblemSection />
      <HowItWorks />
      <FeaturesGrid />
      <SocialProof />
      <CtaSection />
    </>
  );
}
