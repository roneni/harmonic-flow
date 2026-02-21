import { YouTubeStrip } from "@/components/landing/youtube-strip";
import { HeroSection } from "@/components/landing/hero-section";
import { IntegrationBar } from "@/components/landing/integration-bar";
import { StudioInputUpload } from "@/components/landing/studio-input-upload";
import { ProblemSection } from "@/components/landing/problem-section";
import { HowItWorks } from "@/components/landing/how-it-works";
import { FeaturesGrid } from "@/components/landing/features-grid";
import { SocialProof } from "@/components/landing/social-proof";
import { CtaSection } from "@/components/landing/cta-section";

export default function HomePage() {
  return (
    <>
      <YouTubeStrip />
      <HeroSection />
      <IntegrationBar />
      <StudioInputUpload />
      <ProblemSection />
      <HowItWorks />
      <FeaturesGrid />
      <SocialProof />
      <CtaSection />
    </>
  );
}
