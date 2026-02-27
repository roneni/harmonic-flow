"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/auth-provider";

export function Navbar() {
  const router = useRouter();
  const { user, profile, loading, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <nav
      style={{ background: "#0a0a0a", borderBottom: "1px solid #1f1f1f" }}
      className="fixed top-0 left-0 right-0 z-50 h-16"
    >
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="text-base font-bold tracking-tight text-white">
            Harmony<span style={{ color: "#84cc16" }}>Set</span>
          </span>
        </Link>

        {/* Center nav links */}
        <div className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
          <Link
            href="/"
            className="nav-link text-sm font-medium transition-all hover:text-white"
            style={{ color: "#888888" }}
          >
            Home
          </Link>
          <Link
            href="/how-it-works"
            className="nav-link text-sm font-medium transition-all hover:text-white"
            style={{ color: "#888888" }}
          >
            How It Works
          </Link>
          <Link
            href="/#support"
            className="nav-link text-sm font-medium transition-all hover:text-white"
            style={{ color: "#888888" }}
          >
            Support
          </Link>
        </div>

        {/* Right side auth */}
        <div className="flex items-center gap-3 shrink-0">
          {loading ? (
            <div
              className="h-8 w-20 animate-pulse rounded"
              style={{ background: "#1a1a1a" }}
            />
          ) : user ? (
            <>
              <span className="hidden sm:block text-sm" style={{ color: "#888888" }}>
                {profile?.display_name || user.email?.split("@")[0]}
              </span>
              <button
                onClick={handleSignOut}
                className="text-sm font-medium transition-colors hover:text-white"
                style={{ color: "#888888" }}
              >
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium transition-colors hover:text-white"
                style={{ color: "#888888" }}
              >
                Log In
              </Link>
              <Link
                href="/signup"
                className="text-sm font-medium px-4 py-1.5 rounded transition-all hover:bg-primary/10"
                style={{
                  color: "#84cc16",
                  border: "1px solid #84cc16",
                }}
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
