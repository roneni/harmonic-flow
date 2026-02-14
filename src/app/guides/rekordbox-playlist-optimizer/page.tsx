import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How to Optimize Your Rekordbox Playlist Order (2026)",
  description:
    "Step-by-step guide to exporting your Rekordbox playlist and getting the mathematically optimal harmonic track order. Free online tool — no software to install.",
  alternates: { canonical: "/guides/rekordbox-playlist-optimizer" },
  openGraph: {
    title: "How to Optimize Your Rekordbox Playlist Order",
    description:
      "Export your Rekordbox playlist, upload it to HarmonySet, and get the optimal harmonic order in seconds. Free and private.",
  },
};

export default function RekordboxOptimizerGuidePage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-16">
      <header>
        <Link href="/guides" className="text-sm text-primary hover:underline">
          ← All Guides
        </Link>
        <h1 className="mt-4 text-4xl font-bold leading-tight">
          How to Optimize Your Rekordbox Playlist Order
        </h1>
        <p className="mt-4 text-lg text-text-secondary">
          Rekordbox can sort your playlist by key or BPM — but it can&apos;t
          optimize for both at once. Here&apos;s how to get a
          mathematically optimal track order in under 60 seconds.
        </p>
      </header>
      <div className="prose-custom mt-12 space-y-8 text-text-secondary leading-relaxed">
        <section>
          <h2 className="text-2xl font-bold text-text-primary">
            The Rekordbox Sorting Problem
          </h2>
          <p>
            Every DJ who uses Rekordbox has run into this: you can sort
            your playlist by key, or you can sort by BPM, but you can&apos;t
            do both. And even sorting by key only puts tracks in
            alphabetical key order (A, Ab, Am, B, Bb, Bm...) — which has
            nothing to do with harmonic compatibility. A minor and Ab
            major are alphabetically adjacent but harmonically distant.
          </p>
          <p className="mt-4">
            The standard workaround is the &quot;renumber track order&quot; trick:
            sort by one column, right-click the column header, and
            renumber. But this is a single-dimension sort. It can&apos;t
            simultaneously optimize for harmonic flow and energy
            progression.
          </p>
          <p className="mt-4">
            DJ.Studio offers a &quot;Harmonize&quot; feature, but it requires
            installing separate software and importing your library into
            their ecosystem. What if you just want to take a Rekordbox
            playlist, get an optimal order, and go?
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-bold text-text-primary">
            Step 1: Export Your Playlist from Rekordbox
          </h2>
          <p>
            There are two ways to export from Rekordbox that work with
            HarmonySet:
          </p>
          <div className="mt-4 space-y-4">
            <div className="rounded-lg border border-text-secondary/10 bg-surface p-4">
              <p className="font-semibold text-text-primary">
                Option A: XML Export (Recommended)
              </p>
              <p className="mt-2">
                Go to File → Export Collection in XML Format. This exports
                your entire library or selected playlists as a Rekordbox
                XML file. HarmonySet parses the XML directly, reading
                track names, artists, keys, and BPMs from the Rekordbox
                format.
              </p>
            </div>
            <div className="rounded-lg border border-text-secondary/10 bg-surface p-4">
              <p className="font-semibold text-text-primary">
                Option B: Text/CSV Export
              </p>
              <p className="mt-2">
                Select all tracks in a playlist, right-click, and choose
                a text or CSV export option. Make sure the export includes
                at minimum: track name, artist, key, and BPM columns.
                HarmonySet&apos;s parser auto-detects column order and
                handles various delimiter formats.
              </p>
            </div>
          </div>
        </section>
        <section>
          <h2 className="text-2xl font-bold text-text-primary">
            Step 2: Upload to HarmonySet
          </h2>
          <p>
            Go to the{" "}
            <Link href="/optimize" className="text-primary hover:underline">
              HarmonySet optimizer
            </Link>{" "}
            and drag your exported file onto the upload area (or click to
            browse). HarmonySet accepts .xml, .csv, and .txt files.
          </p>
          <p className="mt-4">
            The parser automatically detects the file format and extracts
            your track data. You&apos;ll see a table with all your tracks,
            their keys (converted to standard musical notation), and BPMs.
            Any tracks with unrecognized keys are highlighted so you can
            spot issues.
          </p>
          <p className="mt-4">
            Your file never leaves your browser. All parsing happens
            client-side in JavaScript — nothing is uploaded to any server.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-bold text-text-primary">
            Step 3: Choose Your Energy Mode and Optimize
          </h2>
          <p>
            Pick one of three energy modes based on your set context:
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-6">
            <li>
              <strong className="text-text-primary">Ramp Up</strong> — BPM
              increases through the set. Best for peak-time slots and
              opening-to-main transitions.
            </li>
            <li>
              <strong className="text-text-primary">Ramp Down</strong> — BPM
              decreases through the set. Best for closing sets and
              after-hours wind-downs.
            </li>
            <li>
              <strong className="text-text-primary">Wave</strong> — BPM
              alternates between peaks and valleys. Best for longer sets
              where you want dynamic energy shifts.
            </li>
          </ul>
          <p className="mt-4">
            Hit &quot;Optimize Playlist&quot; and the algorithm runs in under a
            second. You&apos;ll get the optimized track order, a before/after
            quality score comparison, a circle of fifths visualization of
            your harmonic path, and a per-transition breakdown showing
            which transitions are perfect (green), acceptable (yellow), or
            clashing (red).
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-bold text-text-primary">
            Step 4: Download and Use the Optimized Order
          </h2>
          <p>
            Download the optimized playlist as a CSV file. You can then
            use this order as a reference when reordering your playlist
            manually in Rekordbox, or import it into other tools.
          </p>
          <p className="mt-4">
            For the fastest workflow: open HarmonySet and Rekordbox
            side by side. Follow the optimized order in HarmonySet and
            drag tracks into the matching position in your Rekordbox
            playlist. Use the &quot;renumber track order&quot; function after
            reordering to lock in the sequence for export to USB.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-bold text-text-primary">
            Why This Beats Rekordbox&apos;s Built-in Sorting
          </h2>
          <p>
            Rekordbox sorts by a single column — key OR BPM, not both.
            And its key sort is alphabetical, not harmonic. HarmonySet
            uses the actual circle of fifths distances between keys,
            weighted by BPM-based energy flow, solved with a mathematical
            optimization algorithm that evaluates every possible ordering.
          </p>
          <p className="mt-4">
            The result is a playlist that flows harmonically AND
            energetically — something no column sort can achieve.
          </p>
        </section>
        <div className="mt-12 rounded-xl border border-primary/20 bg-primary/5 p-8 text-center">
          <h2 className="text-2xl font-bold text-text-primary">
            Optimize Your Rekordbox Playlist Now
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-text-secondary">
            Export your playlist from Rekordbox, upload it here, and get
            the optimal order in seconds. Free, private, no account
            needed.
          </p>
          <Link
            href="/optimize"
            className="mt-6 inline-block rounded-lg bg-primary px-8 py-3 text-lg font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary/80"
          >
            Upload Rekordbox Playlist
          </Link>
        </div>
      </div>
    </article>
  );
}
