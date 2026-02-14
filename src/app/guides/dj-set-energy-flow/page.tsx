import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "DJ Set Energy Flow — Control Your Dance Floor with BPM (2026)",
  description:
    "Master energy management in your DJ sets using BPM flow techniques. Learn the three energy modes — Ramp Up, Ramp Down, and Wave — that shape a great DJ set.",
  alternates: { canonical: "/guides/dj-set-energy-flow" },
  openGraph: {
    title: "DJ Set Energy Flow — Control Your Dance Floor with BPM",
    description:
      "Learn to manage energy in your DJ sets with BPM flow techniques. Three energy modes for every type of set.",
  },
};

export default function EnergyFlowGuidePage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-16">
      <header>
        <Link href="/guides" className="text-sm text-primary hover:underline">
          ← All Guides
        </Link>
        <h1 className="mt-4 text-4xl font-bold leading-tight">
          DJ Set Energy Flow — Control Your Dance Floor with BPM
        </h1>
        <p className="mt-4 text-lg text-text-secondary">
          A great DJ set isn&apos;t just about picking the right tracks or
          mixing in key — it&apos;s about managing energy. BPM flow is the
          tool that separates a playlist from a performance.
        </p>
      </header>
      <div className="prose-custom mt-12 space-y-8 text-text-secondary leading-relaxed">
        <section>
          <h2 className="text-2xl font-bold text-text-primary">
            What Is Energy Flow?
          </h2>
          <p>
            Energy flow is the intentional progression of intensity
            throughout a DJ set. It&apos;s the arc that takes a dance floor
            from the first arrivals to the peak moment and back down. BPM
            (beats per minute) is the most measurable dimension of energy
            — a track at 138 BPM feels more intense than one at 122 BPM,
            all else being equal.
          </p>
          <p className="mt-4">
            Most DJs instinctively manage energy by &quot;reading the room.&quot;
            But when you&apos;re preparing a set in advance — especially for a
            specific time slot — having a deliberate energy structure
            makes the difference between a set that wanders and one that
            builds.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-bold text-text-primary">
            The Three Energy Modes
          </h2>
          <p>
            HarmonySet offers three energy modes that each create a
            different BPM curve through your set. Understanding when to
            use each one is key to matching your set to the context.
          </p>
          <div className="mt-6 space-y-6">
            <div className="rounded-lg border border-text-secondary/10 bg-surface p-5">
              <h3 className="text-lg font-semibold text-text-primary">
                Ramp Up ↗
              </h3>
              <p className="mt-2">
                BPM increases steadily from first track to last. This is
                the most common pattern for peak-time sets, warm-up to
                main room transitions, and any set where you&apos;re building
                toward a climax. Start low, end high, let the energy
                carry the crowd upward.
              </p>
              <p className="mt-2 text-sm text-text-secondary/70">
                Best for: Opening sets, warm-up slots, peak-time builds,
                festival mainstage
              </p>
            </div>
            <div className="rounded-lg border border-text-secondary/10 bg-surface p-5">
              <h3 className="text-lg font-semibold text-text-primary">
                Ramp Down ↘
              </h3>
              <p className="mt-2">
                BPM decreases through the set. Less common but essential
                for closing sets, after-hours slots, and sunrise
                sessions where the goal is to bring the energy down
                gradually without killing the vibe. The art is in making
                the descent feel intentional, not like you&apos;re running
                out of steam.
              </p>
              <p className="mt-2 text-sm text-text-secondary/70">
                Best for: Closing sets, after-hours, chill-out rooms,
                sunrise sessions
              </p>
            </div>
            <div className="rounded-lg border border-text-secondary/10 bg-surface p-5">
              <h3 className="text-lg font-semibold text-text-primary">
                Wave ～
              </h3>
              <p className="mt-2">
                BPM alternates between peaks and valleys, creating a
                dynamic ride. This is the most sophisticated energy
                pattern and the best choice for longer sets (2+ hours)
                where sustained high energy would exhaust the dance
                floor. The peaks deliver euphoria; the valleys let people
                breathe and anticipate the next build.
              </p>
              <p className="mt-2 text-sm text-text-secondary/70">
                Best for: Extended sets, club residencies, multi-hour
                events, journey-style sets
              </p>
            </div>
          </div>
        </section>
        <section>
          <h2 className="text-2xl font-bold text-text-primary">
            Energy + Harmony = The Complete Picture
          </h2>
          <p>
            Energy flow and{" "}
            <Link
              href="/guides/harmonic-mixing-guide"
              className="text-primary hover:underline"
            >
              harmonic mixing
            </Link>{" "}
            are two dimensions of the same problem: track ordering. A set
            that&apos;s harmonically perfect but energetically flat will bore
            the crowd. A set with great energy flow but key clashes will
            sound messy. The magic happens when both are optimized
            together.
          </p>
          <p className="mt-4">
            This is why HarmonySet doesn&apos;t just sort by key or sort by
            BPM — it optimizes for both simultaneously. The quality score
            weights harmonic distance at 70% and BPM flow at 30%,
            ensuring you get smooth key transitions without sacrificing
            energy coherence.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-bold text-text-primary">
            Practical Tips for Energy Management
          </h2>
          <ul className="mt-4 list-disc space-y-3 pl-6">
            <li>
              <strong className="text-text-primary">
                Know your time slot.
              </strong>{" "}
              A warm-up DJ playing at peak-time energy is the fastest way
              to get blacklisted. Match your energy mode to your slot.
            </li>
            <li>
              <strong className="text-text-primary">
                BPM isn&apos;t everything.
              </strong>{" "}
              A stripped-back track at 140 BPM can feel lower energy than
              a driving bassline at 128. BPM sets the tempo, but
              arrangement and production set the intensity.
            </li>
            <li>
              <strong className="text-text-primary">
                Use Wave mode for long sets.
              </strong>{" "}
              Nobody can dance at peak intensity for 4 hours. Give the
              crowd valleys to catch their breath and the peaks will hit
              harder.
            </li>
            <li>
              <strong className="text-text-primary">
                The last 3 tracks matter most.
              </strong>{" "}
              However you manage energy through the set, your ending
              should feel intentional. Ramp Up should crescendo. Ramp
              Down should land softly. Wave should end on a peak.
            </li>
          </ul>
        </section>
        <div className="mt-12 rounded-xl border border-primary/20 bg-primary/5 p-8 text-center">
          <h2 className="text-2xl font-bold text-text-primary">
            Shape Your Set&apos;s Energy
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-text-secondary">
            Upload your playlist, choose an energy mode, and let the
            algorithm build the optimal flow — harmonically and
            energetically.
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
