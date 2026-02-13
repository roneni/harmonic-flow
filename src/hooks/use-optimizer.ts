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

    // Run optimization in a microtask so the UI shows the loading state
    setTimeout(() => {
      try {
        const result = optimizePlaylist(state.tracks, state.energyMode);
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
