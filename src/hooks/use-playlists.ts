"use client";

import { useState, useCallback, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/auth/auth-provider";
import type { SavedPlaylist } from "@/lib/supabase/types";
import type { OptimizationResult } from "@/lib/types";

export function usePlaylists() {
  const [playlists, setPlaylists] = useState<SavedPlaylist[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const supabase = createClient();

  const fetchPlaylists = useCallback(async () => {
    if (!user) {
      setPlaylists([]);
      return;
    }

    setLoading(true);
    setError(null);

    const { data, error: fetchError } = await supabase
      .from("playlists")
      .select("*")
      .order("created_at", { ascending: false });

    if (fetchError) {
      setError(fetchError.message);
    } else {
      setPlaylists((data as SavedPlaylist[]) || []);
    }

    setLoading(false);
  }, [user, supabase]);

  useEffect(() => {
    fetchPlaylists();
  }, [fetchPlaylists]);

  const savePlaylist = useCallback(
    async (name: string, tags: string[], result: OptimizationResult) => {
      if (!user) return null;

      setError(null);

      const { data, error: insertError } = await supabase
        .from("playlists")
        .insert({
          user_id: user.id,
          name,
          tags,
          original_data: result.originalTracks,
          optimized_data: result.optimizedTracks,
          energy_mode: result.energyMode,
          original_score: result.originalScore,
          optimized_score: result.optimizedScore,
          improvement_percentage: result.improvementPercentage,
          track_count: result.optimizedTracks.length,
        })
        .select()
        .single();

      if (insertError) {
        setError(insertError.message);
        return null;
      }

      // Increment the user's playlist count
      await supabase.rpc("increment_playlist_count", {
        profile_id: user.id,
      }).then(() => {
        // Silently ignore if RPC doesn't exist yet
      });

      await fetchPlaylists();
      return data as SavedPlaylist;
    },
    [user, supabase, fetchPlaylists]
  );

  const deletePlaylist = useCallback(
    async (id: string) => {
      if (!user) return false;

      setError(null);

      const { error: deleteError } = await supabase
        .from("playlists")
        .delete()
        .eq("id", id);

      if (deleteError) {
        setError(deleteError.message);
        return false;
      }

      await fetchPlaylists();
      return true;
    },
    [user, supabase, fetchPlaylists]
  );

  return {
    playlists,
    loading,
    error,
    savePlaylist,
    deletePlaylist,
    refreshPlaylists: fetchPlaylists,
  };
}
