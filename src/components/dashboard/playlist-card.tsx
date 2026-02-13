"use client";

import { useState } from "react";
import type { SavedPlaylist } from "@/lib/supabase/types";
import type { Track, QualityScore } from "@/lib/types";

interface PlaylistCardProps {
  playlist: SavedPlaylist;
  onDelete: (id: string) => Promise<boolean>;
  onDownload: (playlist: SavedPlaylist) => void;
}

export function PlaylistCard({
  playlist,
  onDelete,
  onDownload,
}: PlaylistCardProps) {
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const score = playlist.optimized_score as QualityScore | null;
  const createdDate = new Date(playlist.created_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const handleDelete = async () => {
    setDeleting(true);
    await onDelete(playlist.id);
    setDeleting(false);
    setConfirmDelete(false);
  };

  return (
    <div className="rounded-xl border border-text-secondary/10 bg-surface p-5 transition-colors hover:border-text-secondary/20">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="truncate text-base font-semibold text-text-primary">
            {playlist.name}
          </h3>
          <p className="mt-0.5 text-xs text-text-secondary">{createdDate}</p>
        </div>
        {score && (
          <span
            className={`ml-3 flex-shrink-0 rounded-full px-2.5 py-0.5 text-sm font-bold ${
              score.overall >= 80
                ? "bg-success/10 text-success"
                : score.overall >= 50
                  ? "bg-accent/10 text-accent"
                  : "bg-clash/10 text-clash"
            }`}
          >
            {score.overall}
          </span>
        )}
      </div>

      {/* Tags */}
      {playlist.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {playlist.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Stats row */}
      <div className="mt-4 flex items-center gap-4 text-xs text-text-secondary">
        <span>{playlist.track_count} tracks</span>
        <span className="capitalize">
          {playlist.energy_mode.replace("_", " ")}
        </span>
        {playlist.improvement_percentage > 0 && (
          <span className="text-success">
            +{playlist.improvement_percentage}% improved
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="mt-4 flex items-center gap-2 border-t border-text-secondary/10 pt-3">
        <button
          onClick={() => onDownload(playlist)}
          className="rounded-lg px-3 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:bg-primary/10 hover:text-primary"
        >
          Download CSV
        </button>

        {confirmDelete ? (
          <div className="ml-auto flex items-center gap-2">
            <span className="text-xs text-clash">Delete?</span>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="rounded-lg px-3 py-1.5 text-xs font-medium text-clash transition-colors hover:bg-clash/10 disabled:opacity-50"
            >
              {deleting ? "..." : "Yes"}
            </button>
            <button
              onClick={() => setConfirmDelete(false)}
              className="rounded-lg px-3 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:text-text-primary"
            >
              No
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirmDelete(true)}
            className="ml-auto rounded-lg px-3 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:bg-clash/10 hover:text-clash"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}

/** Utility to download a saved playlist as CSV */
export function downloadPlaylistCsv(playlist: SavedPlaylist) {
  const tracks = playlist.optimized_data as Track[];
  if (!tracks || !Array.isArray(tracks)) return;

  const header = "Track Title,Artist,BPM,Key\n";
  const rows = tracks
    .map((t) => {
      const title = t.title.includes(",") ? `"${t.title}"` : t.title;
      const artist = t.artist.includes(",") ? `"${t.artist}"` : t.artist;
      return `${title},${artist},${t.bpm ?? ""},${t.key}`;
    })
    .join("\n");

  const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `harmonyset-${playlist.name.toLowerCase().replace(/\s+/g, "-")}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
