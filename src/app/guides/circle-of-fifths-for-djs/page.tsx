import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Circle of Fifths for DJs — A Practical Guide (2026)",
  description:
    "Understand the circle of fifths and how it applies to DJ mixing. Learn key compatibility, harmonic transitions, and how to use it for set preparation. No music theory degree required.",
  alternates: { canonical: "/guides/circle-of-fifths-for-djs" },
  openGraph: {
    title: "Circle of Fifths for DJs — A Practical Guide",
    description:
      "The circle of fifths explained for DJs. Learn key compatibility and harmonic transitions without music theory jargon.",
  },
};

export default function CircleOfFifthsGuidePage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-16">
      <header>
        <Link href="/guides" className="text-sm text-primary hover:underline">
          ← All Guides
        </Link>
        <h1 className="mt-4 text-4xl font-bold leading-tight">
          Circle of Fifths for DJs — A Practical Guide
        </h1>
        <p className="mt-4 text-lg text-text-secondary">
          The circle of fifths is the most powerful concept in harmonic
          mixing — and you don&apos;t need a music theory degree to use it.
          Here&apos;s everything a DJ needs to know.
        </p>
      </header>
      <div className="prose-custom mt-12 space-y-8 text-text-secondary leading-relaxed">
        <section>
          <h2 className="text-2xl font-bold text-text-primary">
            What Is the Circle of Fifths?
          </h2>
          <p>
            The circle of fifths is a diagram that arranges all 12
            musical keys in a circle based on their harmonic relationships.
            Each key is a &quot;perfect fifth&quot; interval (7 semitones) away
            from its neighbor. Keys that sit next to each other on the
            circle share the most notes in common — which means they sound
            natural when played together.
          </p>
          <p className="mt-4">
            The outer ring shows the 12 major keys (C, G, D, A, E, B,
            F#/Gb, Db, Ab, Eb, Bb, F), and each major key has a
            corresponding relative minor on the inner ring that shares
            the exact same set of notes. For example, C major and A minor
            contain the same notes — they just emphasize different
            tonal centers.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-bold text-text-primary">
            Why DJs Should Care About This
          </h2>
          <p>
            When you&apos;re mixing two tracks and their keys are adjacent
            on the circle of fifths, the transition sounds smooth and
            natural — melodies complement each other, basslines don&apos;t
            clash, and the audience stays locked in. When keys are far
            apart on the circle, the mix sounds dissonant and jarring
            regardless of how perfectly the beats are matched.
          </p>
          <p className="mt-4">
            Think of it this way: beatmatching controls the rhythm of a
            transition, but key compatibility controls the melody. Both
            matter. A beatmatched mix with clashing keys sounds like two
            songs fighting each other.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-bold text-text-primary">
            The Compatible Transitions Rule
          </h2>
          <p>
            For any given track, you have several compatible options for
            the next track based on circle of fifths positions:
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-6">
            <li>
              <strong className="text-text-primary">Same key</strong> — The
              most seamless transition possible. No harmonic change at
              all.
            </li>
            <li>
              <strong className="text-text-primary">
                One position clockwise or counterclockwise
              </strong>{" "}
              — A perfect fifth up or down. Very smooth, subtle harmonic
              movement. This is the bread and butter of harmonic mixing.
            </li>
            <li>
              <strong className="text-text-primary">
                Relative major/minor
              </strong>{" "}
              — Switch between the major and minor key at the same position.
              Same notes, different mood. Great for emotional shifts.
            </li>
          </ul>
          <p className="mt-4">
            Beyond these safe moves, anything 2+ positions away on the
            circle starts introducing more tension. At 3+ positions, the
            audience will notice. At 6 positions (the opposite side of
            the circle), you get the maximum harmonic clash.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-bold text-text-primary">
            Circle of Fifths vs. Other Notation Systems
          </h2>
          <p>
            If you&apos;ve been DJing for a while, you may have encountered
            proprietary notation systems that simplify key matching by
            using numbers and letters instead of musical key names.
            These systems are based on the circle of fifths — they just
            relabel the keys to make adjacent positions easier to spot.
          </p>
          <p className="mt-4">
            HarmonySet works with all notation formats. Whether your DJ
            software displays keys as standard notation (Am, C, F#),
            alphanumeric codes (8A, 5B), or alternative formats (1d,
            6m), the parser recognizes and standardizes all of them. This
            means you don&apos;t need to convert anything before uploading
            your playlist.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-bold text-text-primary">
            From Theory to Practice — Automating Key Matching
          </h2>
          <p>
            Understanding the circle of fifths is valuable, but manually
            applying it to a 30-track playlist is tedious. You&apos;d need to
            check the harmonic distance between every pair of tracks and
            find the ordering that minimizes the total distance — a
            problem with billions of possible solutions.
          </p>
          <p className="mt-4">
            This is exactly the problem HarmonySet solves. The optimizer
            calculates circle of fifths distances between every track
            pair and uses the Held-Karp algorithm to find the true
            optimal path. Combined with BPM-based energy flow, you get a
            playlist that&apos;s both harmonically smooth and energetically
            coherent.
          </p>
          <p className="mt-4">
            After optimization, the circle of fifths visualization shows
            you the actual path your set takes through the 24 keys —
            so you can see and verify the harmonic logic of your optimized
            order.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-bold text-text-primary">
            Key Takeaways
          </h2>
          <ul className="mt-4 list-disc space-y-2 pl-6">
            <li>
              Adjacent keys on the circle of fifths share the most notes
              and produce the smoothest transitions.
            </li>
            <li>
              Every major key has a relative minor that uses the exact same
              notes — free mood shifts with zero harmonic risk.
            </li>
            <li>
              Key compatibility is just as important as beatmatching for
              professional-sounding mixes.
            </li>
            <li>
              You don&apos;t need to memorize the circle — let a tool
              handle the math while you focus on track selection and
              reading the crowd.
            </li>
          </ul>
        </section>
        <div className="mt-12 rounded-xl border border-primary/20 bg-primary/5 p-8 text-center">
          <h2 className="text-2xl font-bold text-text-primary">
            Let the Circle of Fifths Work for You
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-text-secondary">
            Upload your playlist and see the optimal harmonic path
            visualized on an interactive circle of fifths.
          </p>
          <Link
            href="/optimize"
            className="mt-6 inline-block rounded-lg bg-primary px-8 py-3 text-lg font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary/80"
          >
            Optimize Your Playlist
          </Link>
        </div>
      </div>
    </article>
  );
}
