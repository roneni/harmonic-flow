import Link from "next/link";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-text-secondary/10 px-4 py-12">
      <div className="mx-auto max-w-5xl">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-4">
          {/* Brand */}
          <div className="sm:col-span-1">
            <span className="text-lg font-bold text-text-primary">
              Harmony<span className="text-primary">Set</span>
            </span>
            <p className="mt-2 text-sm text-text-secondary leading-relaxed">
              Mathematically perfect DJ sets. Built by the team behind Psychedelic Universe.
            </p>
          </div>
          {/* Tool */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-text-secondary">
              Tool
            </p>
            <ul className="mt-3 space-y-2">
              <li>
                <Link href="/optimize" className="text-sm text-text-secondary transition-colors hover:text-primary">
                  Optimize Your Playlist
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-sm text-text-secondary transition-colors hover:text-primary">
                  How It Works
                </Link>
              </li>
            </ul>
          </div>
          {/* Guides */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-text-secondary">
              Guides
            </p>
            <ul className="mt-3 space-y-2">
              <li>
                <Link href="/guides/harmonic-mixing-guide" className="text-sm text-text-secondary transition-colors hover:text-primary">
                  Harmonic Mixing Guide
                </Link>
              </li>
              <li>
                <Link href="/guides/rekordbox-playlist-optimizer" className="text-sm text-text-secondary transition-colors hover:text-primary">
                  Rekordbox Playlist Optimizer
                </Link>
              </li>
              <li>
                <Link href="/guides/circle-of-fifths-for-djs" className="text-sm text-text-secondary transition-colors hover:text-primary">
                  Circle of Fifths for DJs
                </Link>
              </li>
              <li>
                <Link href="/guides/dj-set-energy-flow" className="text-sm text-text-secondary transition-colors hover:text-primary">
                  DJ Set Energy Flow
                </Link>
              </li>
            </ul>
          </div>
          {/* Account */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-text-secondary">
              Account
            </p>
            <ul className="mt-3 space-y-2">
              <li>
                <Link href="/login" className="text-sm text-text-secondary transition-colors hover:text-primary">
                  Log In
                </Link>
              </li>
              <li>
                <Link href="/signup" className="text-sm text-text-secondary transition-colors hover:text-primary">
                  Sign Up
                </Link>
              </li>
            </ul>
          </div>
        </div>
        {/* Bottom bar */}
        <div className="mt-10 border-t border-text-secondary/10 pt-6 flex items-center justify-center gap-4 text-sm text-text-secondary">
          <span>&copy; {year} HarmonySet. Built with care for the DJ community.</span>
          <span className="text-text-secondary/30">|</span>
          <Link href="/privacy" className="transition-colors hover:text-primary">
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
}
