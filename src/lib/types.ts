export interface Track {
  artist: string;
  title: string;
  bpm: number | null;
  key: string;
  camelotKey: string | null;
}

export interface Playlist {
  id?: string;
  name: string;
  tracks: Track[];
  tags: string[];
}

export interface OptimizationResult {
  originalTracks: Track[];
  optimizedTracks: Track[];
  invalidTracks: Track[];
  harmonicPath: string[];
  originalScore: QualityScore;
  optimizedScore: QualityScore;
  improvementPercentage: number;
  energyMode: EnergyMode;
}

export interface QualityScore {
  overall: number;
  harmonicScore: number;
  bpmFlowScore: number;
  perfectTransitions: number;
  totalTransitions: number;
  averageDistance: number;
  worstJump: number;
  transitions: TransitionQuality[];
}

export interface TransitionQuality {
  fromTrack: Track;
  toTrack: Track;
  harmonicDistance: number;
  bpmDelta: number;
  quality: "perfect" | "good" | "acceptable" | "clash";
}

export type EnergyMode = "ramp_up" | "ramp_down" | "wave";
export type UserTier = "anonymous" | "free" | "pro";
