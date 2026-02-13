"use client";

import { useState } from "react";
import { useAuth } from "@/components/auth/auth-provider";
import { usePlaylists } from "@/hooks/use-playlists";
import type { OptimizationResult } from "@/lib/types";
import Link from "next/link";

interface SavePlaylistButtonProps {
  result: OptimizationResult;
  defaultName?: string;
}

export function SavePlaylistButton({
  result,
  defaultName = "Untitled Playlist",
}: SavePlaylistButtonProps) {
  const { user } = useAuth();
  const { savePlaylist } = usePlaylists();
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState(defaultName.replace(/\.[^.]+$/, ""));
  const [tags, setTags] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  if (!user) {
    return (
      <div className="text-center text-sm text-text-secondary">
        <Link
          href="/signup"
          className="font-medium text-primary hover:text-primary/80"
        >
          Create a free account
        </Link>{" "}
        to save your optimized playlists.
      </div>
    );
  }

  if (saved) {
    return (
      <div className="inline-flex items-center gap-2 rounded-lg border border-success/20 bg-success/5 px-6 py-3 text-sm font-medium text-success">
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.5 12.75l6 6 9-13.5"
          />
        </svg>
        Saved to Dashboard
      </div>
    );
  }

  const handleSave = async () => {
    setSaving(true);
    const tagArray = tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    const playlist = await savePlaylist(name, tagArray, result);
    setSaving(false);
    if (playlist) {
      setSaved(true);
      setShowModal(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="inline-flex items-center gap-2 rounded-lg border border-primary bg-transparent px-6 py-3 font-medium text-primary transition-colors hover:bg-primary/10"
      >
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
          />
        </svg>
        Save to Dashboard
      </button>

      {/* Save modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-md rounded-xl border border-text-secondary/10 bg-surface p-6">
            <h3 className="text-lg font-semibold text-text-primary">
              Save Playlist
            </h3>

            <div className="mt-4 space-y-3">
              <div>
                <label className="mb-1 block text-sm text-text-secondary">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-text-secondary/20 bg-background px-3 py-2 text-text-primary focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm text-text-secondary">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="psytrance, progressive, peak hour"
                  className="w-full rounded-lg border border-text-secondary/20 bg-background px-3 py-2 text-text-primary placeholder:text-text-secondary/40 focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg px-4 py-2 text-sm text-text-secondary transition-colors hover:text-text-primary"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !name.trim()}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/80 disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
