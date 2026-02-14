export function StructuredData() {
  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "HarmonySet",
    url: "https://www.harmonyset.com",
    description:
      "Mathematically optimize your DJ playlist for perfect harmonic mixing using the circle of fifths and Held-Karp algorithm. Works with Rekordbox, Traktor, and Serato exports.",
    applicationCategory: "MusicApplication",
    operatingSystem: "Web Browser",
    browserRequirements: "Requires JavaScript",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "Harmonic mixing optimization using circle of fifths",
      "Held-Karp dynamic programming algorithm",
      "Rekordbox XML import",
      "Traktor and Serato CSV import",
      "BPM-based energy flow control with 3 modes",
      "Before/after quality scoring 0-100",
      "100% client-side processing — files never leave your browser",
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
