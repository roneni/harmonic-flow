"use client";

import Link from "next/link";
import { useInView } from "@/hooks/use-in-view";

export function CtaSection() {
  const { ref, inView } = useInView();

  return (
    <section className="px-4 py-24">
      <div
        ref={ref}
        className={`mx-auto max-w-2xl text-center transition-all duration-700 ${
          inView ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        }`}
      >
        <h2 className="text-3xl font-bold sm:text-4xl">
          Ready to Perfect Your Sets?
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-lg text-text-secondary">
          Upload your first playlist and hear the difference. No account
          required, no data collected, no catch.
        </p>
        <Link
          href="/optimize"
          className="mt-8 inline-block rounded-lg bg-primary px-10 py-4 text-lg font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary/80 hover:shadow-primary/40"
        >
          Optimize Your Playlist
        </Link>
      </div>
    </section>
  );
}
