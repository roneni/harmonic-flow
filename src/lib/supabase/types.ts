import type { UserTier } from "@/lib/types";

export interface UserProfile {
  id: string;
  display_name: string | null;
  user_tier: UserTier;
  stripe_customer_id: string | null;
  playlists_optimized_count: number;
  created_at: string;
  updated_at: string;
}

export interface SavedPlaylist {
  id: string;
  user_id: string;
  name: string;
  tags: string[];
  original_data: unknown;
  optimized_data: unknown;
  energy_mode: string;
  original_score: unknown;
  optimized_score: unknown;
  improvement_percentage: number;
  track_count: number;
  created_at: string;
  updated_at: string;
}
