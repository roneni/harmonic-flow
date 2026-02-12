import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4">
      <h1 className="mb-4 text-center text-5xl font-bold tracking-tight">
        Perfect Harmonic
        <br />
        <span className="text-primary">Mixing</span>, Mathematically
      </h1>
      <p className="mb-8 max-w-lg text-center text-lg text-text-secondary">
        Upload your DJ playlist and get the optimal track order for seamless
        harmonic transitions. Powered by the circle of fifths.
      </p>
      <div className="flex gap-4">
        <Link
          href="/optimize"
          className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-primary-hover hover:shadow-[0_0_20px_var(--color-primary-glow)]"
        >
          Try It Free
        </Link>
        <a
          href="#how-it-works"
          className="rounded-lg border border-border px-6 py-3 text-sm font-semibold text-text-secondary transition-colors hover:border-primary hover:text-primary"
        >
          See How It Works
        </a>
      </div>
    </div>
  );
}
