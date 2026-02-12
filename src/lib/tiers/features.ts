import type { UserTier } from "@/lib/types";

export const FEATURE_GATES = {
  energy_mode_ramp_down: "free",
  energy_mode_wave: "free",
  save_playlist: "free",
  max_tracks_100: "free",
  unlimited_tracks: "pro",
  unlimited_saves: "pro",
  custom_start_track: "pro",
  per_transition_detail: "pro",
  no_watermark: "pro",
} as const;

export type FeatureName = keyof typeof FEATURE_GATES;

const TIER_RANK: Record<UserTier, number> = {
  anonymous: 0,
  free: 1,
  pro: 2,
};

export function canAccessFeature(
  userTier: UserTier,
  feature: FeatureName
): boolean {
  const required = FEATURE_GATES[feature] as UserTier;
  return TIER_RANK[userTier] >= TIER_RANK[required];
}
