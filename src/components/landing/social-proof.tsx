"use client";

import { useInView } from "@/hooks/use-in-view";

export function SocialProof() {
  const { ref, inView } = useInView();

  return (
    <section className="px-4 py-20">
      <div
        ref={ref}
        className={`mx-auto max-w-3xl text-center transition-all duration-700 ${
          inView ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        }`}
      >
        <p className="text-sm font-medium uppercase tracking-wider text-accent">
          Built by DJs, for DJs
        </p>
        <p className="mx-auto mt-4 max-w-xl text-lg text-text-secondary leading-relaxed">
          Created by the team behind one of the largest Psytrance channels on
          YouTube. We built the tool we wished existed when planning our own
          sets.
        </p>

        {/* Stats */}
        <div className="mt-10 grid grid-cols-3 gap-6">
          <div>
            <p className="text-3xl font-bold text-text-primary">14</p>
            <p className="mt-1 text-sm text-text-secondary">
              Optimal distance on real playlists
            </p>
          </div>
          <div>
            <p className="text-3xl font-bold text-text-primary">0</p>
            <p className="mt-1 text-sm text-text-secondary">
              Files sent to any server
            </p>
          </div>
          <div>
            <p className="text-3xl font-bold text-text-primary">&lt;1s</p>
            <p className="mt-1 text-sm text-text-secondary">
              Optimization time for 50 tracks
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
