import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Optimize Your DJ Playlist — Free Harmonic Mixing Tool",
  description:
    "Upload your Rekordbox XML, Traktor CSV, or Serato playlist export and get the mathematically optimal harmonic track order in seconds. Uses circle of fifths optimization with the Held-Karp algorithm. Free, 100% private — your files never leave your browser.",
  alternates: {
    canonical: "/optimize",
  },
  openGraph: {
    title: "Optimize Your DJ Playlist — Free Harmonic Mixing Tool",
    description:
      "Upload your DJ playlist export and get the mathematically optimal harmonic order. Powered by circle of fifths optimization.",
    url: "https://www.harmonyset.com/optimize",
  },
};

export default function OptimizeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
