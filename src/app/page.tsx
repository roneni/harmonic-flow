import { HeroSectionPencilTest } from "@/components/landing/hero-section-pencil-test";
import { IntegrationBar } from "@/components/landing/integration-bar";
import { ProblemSection } from "@/components/landing/problem-section";
import { HowItWorks } from "@/components/landing/how-it-works";
import { FeaturesGrid } from "@/components/landing/features-grid";
import { SocialProof } from "@/components/landing/social-proof";
import { CtaSection } from "@/components/landing/cta-section";
import { UploadPanel } from "@/components/landing/upload-panel";
import { TracklistComparison } from "@/components/landing/tracklist-comparison";
import FeatureCards from "@/components/landing/feature-cards";

export default function HomePage() {
  return (
    <>
      <HeroSectionPencilTest />
      <UploadPanel />
      <TracklistComparison />
      <section className="relative bg-[#0A0A0A] px-6 pt-16 pb-10">
        <div className="text-center mb-10">
          <span className="text-[10px] font-mono font-semibold tracking-[3px] text-[#84CC16] mb-2 block">
            HARMONIC ANALYSIS
          </span>
        </div>
        <FeatureCards />
      </section>
      <IntegrationBar />
      <ProblemSection />
      <HowItWorks />
      <FeaturesGrid />
      <SocialProof />
      <CtaSection />
    </>
  );
}
