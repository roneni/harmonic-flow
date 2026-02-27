import { HowItWorks } from "@/components/landing/how-it-works";
import { SocialProof } from "@/components/landing/social-proof";
import { CtaSection } from "@/components/landing/cta-section";

export const metadata = { title: "How It Works" };

export default function HowItWorksPage() {
    return (
        <>
            <HowItWorks />
            <SocialProof />
            <CtaSection />
        </>
    );
}
