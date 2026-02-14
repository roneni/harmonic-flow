import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "The Complete Harmonic Mixing Guide for DJs (2026)",
  description:
    "Learn how harmonic mixing works, why key compatibility matters for DJ sets, and how to automatically optimize your playlist order using the circle of fifths. Free tool included.",
  alternates: { canonical: "/guides/harmonic-mixing-guide" },
  openGraph: {
    title: "The Complete Harmonic Mixing Guide for DJs",
    description:
      "Everything you need to know about harmonic mixing — from music theory basics to automated playlist optimization.",
  },
};

export default function HarmonicMixingGuidePage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-16">
      <header>
        <Link
          href="/guides"
          className="text-sm text-primary hover:underline"
        >
          ← All Guides
        </Link>
        <h1 className="mt-4 text-4xl font-bold leading-tight">
          The Complete Harmonic Mixing Guide for DJs
        </h1>
        <p className="mt-4 text-lg text-text-secondary">
          Harmonic mixing is the technique that separates sets that
          sound &quot;fine&quot; from sets that feel effortless. This guide
          covers everything you need to know — from the basics of musical
          keys to automating the entire process.
        </p>
      </header>
      <div className="prose-custom mt-12 space-y-8 text-text-secondary leading-relaxed">
        <section>
          <h2 className="text-2xl font-bold text-text-primary">
            What Is Harmonic Mixing?
          </h2>
          <p>
            Harmonic mixing means selecting and ordering tracks so that
            adjacent songs are in compatible musical keys. When two tracks
            share compatible keys, their melodies, basslines, and chord
            progressions blend naturally during transitions. When they
            clash, even a perfectly beatmatched mix sounds off — the
            audience feels the dissonance even if they can&apos;t name it.
          </p>
          <p className="mt-4">
            The concept is simple: every song is in a musical key (like A
            minor or F major), and some keys sound good together while
            others don&apos;t. Harmonic mixing is about stacking the deck in
            your favor so every transition has the best possible chance of
            sounding smooth.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-bold text-text-primary">
            Why Key Compatibility Matters
          </h2>
          <p>
            Musical keys determine which notes &quot;belong&quot; in a song. When
            you mix two tracks in the key of A minor, they share the same
            set of seven notes — so melodies and harmonics from both tracks
            weave together naturally. Mix A minor into F# major, and those
            notes collide. The result is a jarring, dissonant transition
            that kills the energy on a dance floor.
          </p>
          <p className="mt-4">
            Professional DJs have known this for decades. The challenge has
            always been practical: with 24 possible keys and a playlist of
            20-50 tracks, finding the optimal order by hand is a
            combinatorial problem. That&apos;s where tools come in.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-bold text-text-primary">
            The Circle of Fifths — Your Harmonic Roadmap
          </h2>
          <p>
            The circle of fifths is a diagram from music theory that maps
            all 12 major and 12 minor keys in a circle. Adjacent keys on
            the circle share the most notes in common, which means they
            sound the most compatible when mixed. The further apart two
            keys are on the circle, the more dissonant a transition between
            them will sound.
          </p>
          <p className="mt-4">
            For DJs, the rule of thumb is: you can safely move to an
            adjacent position on the circle (one step clockwise or
            counterclockwise), stay on the same position, or switch between
            the major and minor key at the same position. These are called
            &quot;compatible&quot; transitions, and they cover about 4-5 possible
            next keys for any given track.
          </p>
          <p className="mt-4">
            Want to go deeper on this topic?{" "}
            <Link
              href="/guides/circle-of-fifths-for-djs"
              className="text-primary hover:underline"
            >
              Read our Circle of Fifths for DJs guide
            </Link>
            .
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-bold text-text-primary">
            The Problem with Manual Harmonic Mixing
          </h2>
          <p>
            Most DJs approach harmonic mixing by sorting their library by
            key and manually dragging tracks into a sequence that avoids
            big key jumps. This works for 8-10 tracks, but it breaks down
            quickly:
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-6">
            <li>
              With 20 tracks, there are over 2.4 quintillion possible
              orderings. You can&apos;t try them all by hand.
            </li>
            <li>
              Sorting by key alone ignores BPM and energy flow — a
              harmonically smooth set can still feel wrong if the tempo
              jumps erratically.
            </li>
            <li>
              The &quot;renumber track order&quot; workaround in Rekordbox only
              sorts by a single column. It can&apos;t optimize for key AND
              energy simultaneously.
            </li>
            <li>
              Once you reorder manually, one added or removed track can
              invalidate the entire sequence.
            </li>
          </ul>
        </section>
        <section>
          <h2 className="text-2xl font-bold text-text-primary">
            How HarmonySet Solves This Automatically
          </h2>
          <p>
            HarmonySet uses a mathematical optimization algorithm called
            Held-Karp to find the actual optimal track order — not an
            approximation, not a heuristic, but the mathematically best
            sequence for harmonic compatibility combined with BPM-based
            energy flow.
          </p>
          <p className="mt-4">
            Here&apos;s how it works: you upload your playlist export from
            Rekordbox (XML), Traktor (CSV), or Serato, and the algorithm
            calculates the harmonic distance between every pair of tracks
            using circle of fifths positions. It then finds the path
            through all your tracks that minimizes the total harmonic
            distance — meaning every transition is as smooth as possible.
          </p>
          <p className="mt-4">
            On top of harmonic optimization, you choose an energy mode:
            Ramp Up (build intensity through the set), Ramp Down (cool
            off for a closing set), or Wave (alternate between peaks and
            valleys). The algorithm factors BPM into the ordering so your
            set flows energetically as well as harmonically.
          </p>
          <p className="mt-4">
            The entire process takes less than a second, runs in your
            browser (your files never leave your computer), and the
            result is a downloadable CSV with the optimized track order.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-bold text-text-primary">
            Quality Scoring — Before vs. After
          </h2>
          <p>
            After optimization, HarmonySet shows you a quality score from
            0 to 100 for both your original order and the optimized order.
            The score is based on three factors: average harmonic distance
            between adjacent tracks (lower is better), percentage of
            &quot;perfect&quot; transitions (distance of 1 or less on the circle of
            fifths), and the largest single key jump in the sequence
            (penalizes outlier clashes).
          </p>
          <p className="mt-4">
            You also get a visual before/after comparison with color-coded
            transition indicators — green for perfect, yellow for
            acceptable, red for clash — so you can see exactly where the
            improvements are.
          </p>
        </section>
        <div className="mt-12 rounded-xl border border-primary/20 bg-primary/5 p-8 text-center">
          <h2 className="text-2xl font-bold text-text-primary">
            Try It Now — Free, No Account Required
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-text-secondary">
            Upload your Rekordbox, Traktor, or Serato playlist export and
            see the difference harmonic optimization makes.
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
