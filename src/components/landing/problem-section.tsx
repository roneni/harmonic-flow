"use client";

import { useInView } from "@/hooks/use-in-view";

export function ProblemSection() {
  const { ref, inView } = useInView();

  return (
    <section className="px-4 py-20">
      <div
        ref={ref}
        className={`mx-auto max-w-3xl text-center transition-all duration-700 ${
          inView ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        }`}
      >
        <h2 className="text-3xl font-bold">
          Playlist Order{" "}
          <span className="text-clash">Matters</span>
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-text-secondary leading-relaxed">
          A great DJ set isn&apos;t just about picking great tracks - it&apos;s
          about the order. A bad key transition can break the energy on a
          dance floor. Manually sorting 20+ tracks by harmonic compatibility
          takes hours and still leaves gaps.
        </p>
        <div className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="rounded-xl border border-clash/20 bg-clash/5 p-5 text-left">
            <p className="text-sm font-semibold text-clash">Without optimization</p>
            <p className="mt-2 text-sm text-text-secondary">
              Random key jumps. Energy drops. Hours of manual trial-and-error.
              Harsh clashes that the audience feels but can&apos;t explain.
            </p>
          </div>
          <div className="rounded-xl border border-success/20 bg-success/5 p-5 text-left">
            <p className="text-sm font-semibold text-success">With HarmonySet</p>
            <p className="mt-2 text-sm text-text-secondary">
              Mathematically perfect transitions. Smooth energy flow. Done in
              seconds. Your audience stays locked in from start to finish.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
