"use client";

import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden px-4 py-24 sm:py-32">
      {/* Background glow effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-primary/10 blur-[128px]" />
        <div className="absolute right-1/4 bottom-1/4 h-96 w-96 rounded-full bg-accent/10 blur-[128px]" />
      </div>

      <div className="relative mx-auto max-w-4xl text-center">
        <div className="mb-6 inline-block rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
          Mathematically Optimal Harmonic Mixing
        </div>

        <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl">
          Perfect Your DJ Sets with{" "}
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Science
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-text-secondary sm:text-xl">
          Upload your playlist, and our algorithm finds the mathematically
          optimal harmonic order. Every transition flows. Every key change is
          intentional.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/optimize"
            className="rounded-lg bg-primary px-8 py-3.5 text-lg font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary/80 hover:shadow-primary/40"
          >
            Try It Free
          </Link>
          <a
            href="#how-it-works"
            className="rounded-lg border border-text-secondary/20 px-8 py-3.5 text-lg font-medium text-text-secondary transition-colors hover:border-primary/40 hover:text-primary"
          >
            See How It Works
          </a>
        </div>

        <p className="mt-6 text-sm text-text-secondary/60">
          No account required. Works with Rekordbox, Traktor, and Serato
          exports.
        </p>
      </div>
    </section>
  );
}
