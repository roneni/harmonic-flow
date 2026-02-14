import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s | HarmonySet Guides",
    default: "DJ Guides — Harmonic Mixing, Playlist Optimization & More",
  },
  description:
    "Free guides on harmonic mixing, the circle of fifths for DJs, playlist optimization for Rekordbox and Traktor, and energy flow techniques.",
};

export default function GuidesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
