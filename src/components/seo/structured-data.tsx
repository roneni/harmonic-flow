export function StructuredData() {
  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "HarmonySet",
    url: "https://www.harmonyset.com",
    description:
      "Free DJ playlist optimizer that reorders tracks for harmonic mixing using the Circle of Fifths. Upload your Rekordbox export and get the mathematically optimal track order in seconds.",
    applicationCategory: "MusicApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "Harmonic playlist optimization using Circle of Fifths",
      "Held-Karp algorithm for mathematically optimal track ordering",
      "Rekordbox TXT and XML import",
      "Three energy modes: Ramp Up, Ramp Down, Wave",
      "Before/after quality score comparison",
      "Circle of Fifths harmonic path visualization",
      "Per-transition color-coded quality indicators",
      "Client-side processing — files never leave your browser",
      "CSV export of optimized playlist",
    ],
  };
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "HarmonySet",
    url: "https://www.harmonyset.com",
    description:
      "DJ tools built by the team behind Psychedelic Universe",
  };
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
    </>
  );
}
