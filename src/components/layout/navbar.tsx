"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-lg font-bold text-text-primary">
            Harmonic<span className="text-primary">Flow</span>
          </span>
        </Link>

        <div className="flex items-center gap-6">
          <Link
            href="/optimize"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              pathname === "/optimize"
                ? "text-primary"
                : "text-text-secondary"
            }`}
          >
            Optimize
          </Link>
          <Link
            href="/dashboard"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              pathname === "/dashboard"
                ? "text-primary"
                : "text-text-secondary"
            }`}
          >
            Dashboard
          </Link>
          <Link
            href="/login"
            className="rounded-lg border border-border px-4 py-1.5 text-sm font-medium text-text-secondary transition-colors hover:border-primary hover:text-primary"
          >
            Log In
          </Link>
        </div>
      </div>
    </nav>
  );
}
