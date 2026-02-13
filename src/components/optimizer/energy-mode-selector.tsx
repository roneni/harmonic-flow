"use client";

import type { EnergyMode } from "@/lib/types";

interface EnergyModeSelectorProps {
  value: EnergyMode;
  onChange: (mode: EnergyMode) => void;
}

const MODES: { id: EnergyMode; label: string; description: string }[] = [
  {
    id: "ramp_up",
    label: "Ramp Up",
    description: "Build energy gradually - ascending BPM",
  },
  {
    id: "ramp_down",
    label: "Ramp Down",
    description: "Wind down smoothly - descending BPM",
  },
  {
    id: "wave",
    label: "Wave",
    description: "Peaks and valleys - alternating energy",
  },
];

export function EnergyModeSelector({
  value,
  onChange,
}: EnergyModeSelectorProps) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {MODES.map((mode) => (
        <button
          key={mode.id}
          onClick={() => onChange(mode.id)}
          className={`
            rounded-lg border-2 px-4 py-3 text-left transition-all duration-200
            ${
              value === mode.id
                ? "border-primary bg-primary/10 text-text-primary"
                : "border-text-secondary/20 text-text-secondary hover:border-primary/40"
            }
          `}
        >
          <div className="font-medium">{mode.label}</div>
          <div className="mt-1 text-xs opacity-70">{mode.description}</div>
        </button>
      ))}
    </div>
  );
}
