"use client";

import Link from "next/link";
import { useAuth } from "@/components/auth/auth-provider";
import { usePlaylists } from "@/hooks/use-playlists";
import { StatsOverview } from "@/components/dashboard/stats-overview";
import { PlaylistList } from "@/components/dashboard/playlist-list";

export default function DashboardPage() {
  const { user, profile, loading: authLoading } = useAuth();
  const { playlists, loading: playlistsLoading, deletePlaylist } = usePlaylists();

  const loading = authLoading || playlistsLoading;

  // Not logged in — middleware should redirect, but just in case
  if (!authLoading && !user) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-text-primary">
          Sign in to view your dashboard
        </h1>
        <p className="mt-3 text-text-secondary">
          <Link href="/login" className="text-primary hover:text-primary/80">
            Log in
          </Link>{" "}
          or{" "}
          <Link href="/signup" className="text-primary hover:text-primary/80">
            create an account
          </Link>{" "}
          to save and manage your playlists.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">
            {profile?.display_name
              ? `${profile.display_name}'s Dashboard`
              : "Dashboard"}
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            Manage your saved playlists
          </p>
        </div>
        <Link
          href="/optimize"
          className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary/80"
        >
          New Optimization
        </Link>
      </div>

      {loading ? (
        <div className="space-y-4">
          {/* Skeleton stats */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-20 animate-pulse rounded-xl bg-surface"
              />
            ))}
          </div>
          {/* Skeleton cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-48 animate-pulse rounded-xl bg-surface"
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          <StatsOverview playlists={playlists} />
          <PlaylistList playlists={playlists} onDelete={deletePlaylist} />
        </div>
      )}
    </div>
  );
}
