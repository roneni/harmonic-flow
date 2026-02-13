"use client";

import type { SavedPlaylist } from "@/lib/supabase/types";
import { PlaylistCard, downloadPlaylistCsv } from "./playlist-card";

interface PlaylistListProps {
  playlists: SavedPlaylist[];
  onDelete: (id: string) => Promise<boolean>;
}

export function PlaylistList({ playlists, onDelete }: PlaylistListProps) {
  if (playlists.length === 0) {
    return (
      <div className="rounded-xl border-2 border-dashed border-text-secondary/15 py-16 text-center">
        <p className="text-lg text-text-secondary">No playlists yet</p>
        <p className="mt-2 text-sm text-text-secondary/60">
          Optimize a playlist and save it to see it here.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {playlists.map((playlist) => (
        <PlaylistCard
          key={playlist.id}
          playlist={playlist}
          onDelete={onDelete}
          onDownload={downloadPlaylistCsv}
        />
      ))}
    </div>
  );
}
