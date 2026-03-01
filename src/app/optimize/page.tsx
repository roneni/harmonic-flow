"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/auth-provider";
import { useOptimizer } from "@/hooks/use-optimizer";
import { FileUpload } from "@/components/optimizer/file-upload";
import { TrackTable } from "@/components/optimizer/track-table";
import { EnergyModeSelector } from "@/components/optimizer/energy-mode-selector";
import { OptimizationResults } from "@/components/optimizer/optimization-results";
import { ProcessingOverlay } from "@/components/optimizer/processing-overlay";

export default function OptimizePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login?redirect=/optimize");
    }
  }, [loading, user, router]);

  const {
    step,
    file,
    tracks,
    energyMode,
    result,
    error,
    selectFile,
    parseSelectedFile,
    setEnergyMode,
    optimize,
    reset,
  } = useOptimizer();

  // Auto-parse when file is selected
  useEffect(() => {
    if (step === "file_selected") {
      parseSelectedFile();
    }
  }, [step, parseSelectedFile]);

  // Show nothing while checking auth or redirecting
  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="mb-2 text-center text-3xl font-bold">
        Playlist <span className="text-primary">Optimizer</span>
      </h1>
      <p className="mb-8 text-center text-text-secondary">
        Upload your playlist and get the mathematically optimal harmonic order.
      </p>

      {/* Error display */}
      {error && (
        <div className="mb-6 rounded-lg border border-clash/20 bg-clash/5 px-4 py-3 text-sm text-clash">
          {error}
        </div>
      )}

      {/* Step: Upload */}
      {(step === "idle" || step === "file_selected" || step === "parsing") && (
        <FileUpload
          onFileSelect={selectFile}
          disabled={step === "parsing"}
        />
      )}

      {/* Loading indicator while parsing */}
      {step === "parsing" && (
        <div className="mt-6 text-center text-text-secondary">
          <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="mt-2">Parsing {file?.name}...</p>
        </div>
      )}

      {/* Step: Optimizing — show processing animation */}
      {step === "optimizing" && <ProcessingOverlay />}

      {/* Step: Parsed — show tracks + energy mode + optimize button */}
      {step === "parsed" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-text-primary">
                {file?.name}
              </h2>
              <p className="text-sm text-text-secondary">
                {tracks.length} tracks loaded
              </p>
            </div>
            <button
              onClick={reset}
              className="text-sm text-text-secondary transition-colors hover:text-text-primary"
            >
              Upload different file
            </button>
          </div>

          <TrackTable
            tracks={tracks}
            highlightInvalidKeys
          />

          <div>
            <h3 className="mb-3 text-sm font-medium uppercase tracking-wider text-text-secondary">
              Energy Mode
            </h3>
            <EnergyModeSelector value={energyMode} onChange={setEnergyMode} />
          </div>

          <div className="flex justify-center">
            <button
              onClick={optimize}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-3 text-lg font-semibold text-white transition-colors hover:bg-primary/80"
            >
              Optimize Playlist
            </button>
          </div>
        </div>
      )}

      {/* Step: Results */}
      {step === "results" && result && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-text-primary">
                {file?.name}
              </h2>
              <p className="text-sm text-text-secondary">
                {result.optimizedTracks.length} tracks optimized
              </p>
            </div>
            <button
              onClick={reset}
              className="text-sm text-text-secondary transition-colors hover:text-text-primary"
            >
              Start over
            </button>
          </div>

          <OptimizationResults result={result} fileName={file?.name} />
        </div>
      )}
    </div>
  );
}
