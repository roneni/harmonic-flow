"use client";

import type { SavedPlaylist } from "@/lib/supabase/types";

interface StatsOverviewProps {
  playlists: SavedPlaylist[];
}

export function StatsOverview({ playlists }: StatsOverviewProps) {
  const totalPlaylists = playlists.length;
  const totalTracks = playlists.reduce((sum, p) => sum + p.track_count, 0);
  const avgImprovement =
    totalPlaylists > 0
      ? Math.round(
          playlists.reduce((sum, p) => sum + p.improvement_percentage, 0) /
            totalPlaylists
        )
      : 0;

  const stats = [
    { label: "Saved Playlists", value: totalPlaylists },
    { label: "Total Tracks", value: totalTracks },
    { label: "Avg Improvement", value: `${avgImprovement}%` },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-xl border border-text-secondary/10 bg-surface px-6 py-5"
        >
          <p className="text-sm text-text-secondary">{stat.label}</p>
          <p className="mt-1 text-2xl font-bold text-text-primary">
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  );
}
