"use client";

import Link from "next/link";
import { useInView } from "@/hooks/use-in-view";
import { useAuth } from "@/components/auth/auth-provider";

export function CtaSection() {
  const { ref, inView } = useInView();
  const { user } = useAuth();

  return (
    <section className="px-4 py-24">
      <div
        ref={ref}
        className={`mx-auto max-w-2xl text-center transition-all duration-700 ${inView ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
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
          href={user ? "/optimize" : "/signup"}
          className="mx-auto mt-8 flex items-center justify-center w-[240px] h-[46px] rounded border-2 border-[#84cc16] bg-transparent text-white text-[13px] font-bold tracking-[2px] hover:bg-[#84cc16] hover:text-black transition-colors"
        >
          Optimize Your Playlist
        </Link>
      </div>
    </section>
  );
}
