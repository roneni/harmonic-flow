import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "DJ Guides — Harmonic Mixing, Playlist Optimization & More",
  description:
    "Free guides on harmonic mixing, the circle of fifths for DJs, playlist optimization for Rekordbox and Traktor, and energy flow techniques.",
  alternates: { canonical: "/guides" },
};

const GUIDES = [
  {
    title: "The Complete Harmonic Mixing Guide for DJs",
    description:
      "Learn how harmonic mixing works, why key compatibility matters, and how to automate the entire process for your DJ sets.",
    href: "/guides/harmonic-mixing-guide",
    tag: "Fundamentals",
  },
  {
    title: "How to Optimize Your Rekordbox Playlist Order",
    description:
      "Step-by-step guide to exporting your Rekordbox playlist and getting the mathematically optimal harmonic track order.",
    href: "/guides/rekordbox-playlist-optimizer",
    tag: "Rekordbox",
  },
  {
    title: "Circle of Fifths for DJs — A Practical Guide",
    description:
      "Understand the circle of fifths and how it applies to DJ mixing. No music theory degree required.",
    href: "/guides/circle-of-fifths-for-djs",
    tag: "Music Theory",
  },
  {
    title: "DJ Set Energy Flow — Control Your Dance Floor with BPM",
    description:
      "Master energy management in your DJ sets using BPM flow techniques. Learn the three energy modes that shape a great set.",
    href: "/guides/dj-set-energy-flow",
    tag: "Technique",
  },
];

export default function GuidesPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="text-4xl font-bold">
        DJ <span className="text-primary">Guides</span>
      </h1>
      <p className="mt-4 text-lg text-text-secondary">
        Everything you need to know about harmonic mixing, playlist
        optimization, and building DJ sets that flow.
      </p>
      <div className="mt-12 grid gap-6">
        {GUIDES.map((guide) => (
          <Link
            key={guide.href}
            href={guide.href}
            className="group rounded-xl border border-text-secondary/10 bg-surface p-6 transition-all hover:border-primary/30 hover:bg-surface/80"
          >
            <span className="inline-block rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
              {guide.tag}
            </span>
            <h2 className="mt-3 text-xl font-semibold text-text-primary group-hover:text-primary transition-colors">
              {guide.title}
            </h2>
            <p className="mt-2 text-text-secondary">{guide.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
