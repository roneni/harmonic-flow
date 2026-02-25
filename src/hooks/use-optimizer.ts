"use client";

import { useState, useCallback } from "react";
import type { Track, OptimizationResult, EnergyMode } from "@/lib/types";
import { parseFile } from "@/lib/parsers";
import { optimizePlaylist } from "@/lib/algorithm";

export type OptimizerStep =
  | "idle"
  | "file_selected"
  | "parsing"
  | "parsed"
  | "optimizing"
  | "results";

interface OptimizerState {
  step: OptimizerStep;
  file: File | null;
  tracks: Track[];
  energyMode: EnergyMode;
  result: OptimizationResult | null;
  error: string | null;
}

export function useOptimizer() {
  const [state, setState] = useState<OptimizerState>({
    step: "idle",
    file: null,
    tracks: [],
    energyMode: "ramp_up",
    result: null,
    error: null,
  });

  const selectFile = useCallback((file: File) => {
    setState((s) => ({
      ...s,
      step: "file_selected",
      file,
      tracks: [],
      result: null,
      error: null,
    }));
  }, []);

  const parseSelectedFile = useCallback(async () => {
    if (!state.file) return;

    setState((s) => ({ ...s, step: "parsing", error: null }));

    try {
      const tracks = await parseFile(state.file);

      if (tracks.length === 0) {
        setState((s) => ({
          ...s,
          step: "idle",
          error:
            "No tracks found. Please upload a Rekordbox XML, CSV, or TXT file with Title, Key, and BPM columns.",
        }));
        return;
      }

      setState((s) => ({ ...s, step: "parsed", tracks }));
    } catch {
      setState((s) => ({
        ...s,
        step: "idle",
        error: "Failed to parse file. Please check the format and try again.",
      }));
    }
  }, [state.file]);

  const setEnergyMode = useCallback((mode: EnergyMode) => {
    setState((s) => ({ ...s, energyMode: mode }));
  }, []);

  const optimize = useCallback(() => {
    if (state.tracks.length === 0) return;

    setState((s) => ({ ...s, step: "optimizing" }));

    // Run optimization with a minimum delay so the processing animation can play
    const MIN_ANIMATION_MS = 26000; // 16 phases × 1500ms + 1s completion pause + buffer
    const start = Date.now();

    setTimeout(async () => {
      try {
        const result = optimizePlaylist(state.tracks, state.energyMode);
        const elapsed = Date.now() - start;
        const remaining = Math.max(0, MIN_ANIMATION_MS - elapsed);
        await new Promise((r) => setTimeout(r, remaining));
        setState((s) => ({ ...s, step: "results", result }));
      } catch {
        setState((s) => ({
          ...s,
          step: "parsed",
          error: "Optimization failed. Please try again.",
        }));
      }
    }, 10);
  }, [state.tracks, state.energyMode]);

  const reset = useCallback(() => {
    setState({
      step: "idle",
      file: null,
      tracks: [],
      energyMode: "ramp_up",
      result: null,
      error: null,
    });
  }, []);

  return {
    ...state,
    selectFile,
    parseSelectedFile,
    setEnergyMode,
    optimize,
    reset,
  };
}
