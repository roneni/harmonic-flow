"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/auth-provider";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile, loading, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-text-secondary/10 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-lg font-bold text-text-primary">
            Harmony<span className="text-primary">Set</span>
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
            href="/guides"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              pathname?.startsWith("/guides")
                ? "text-primary"
                : "text-text-secondary"
            }`}
          >
            Guides
          </Link>

          {user && (
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
          )}

          {loading ? (
            <div className="h-8 w-20 animate-pulse rounded-lg bg-surface" />
          ) : user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-text-secondary">
                {profile?.display_name || user.email?.split("@")[0]}
              </span>
              <button
                onClick={handleSignOut}
                className="rounded-lg border border-text-secondary/20 px-3 py-1.5 text-sm font-medium text-text-secondary transition-colors hover:border-clash/40 hover:text-clash"
              >
                Log Out
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="rounded-lg border border-text-secondary/20 px-4 py-1.5 text-sm font-medium text-text-secondary transition-colors hover:border-primary hover:text-primary"
            >
              Log In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
