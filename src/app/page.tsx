import { HeroSectionPencilTest } from "@/components/landing/hero-section-pencil-test";
import UniversalIntegration from "@/components/landing/universal-integration";

import { UploadPanel } from "@/components/landing/upload-panel";
import { TracklistComparison } from "@/components/landing/tracklist-comparison";
import FeatureCards from "@/components/landing/feature-cards";
import FounderStory from "@/components/landing/founder-story";

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
      <UniversalIntegration />
      <FounderStory />
    </>
  );
}
