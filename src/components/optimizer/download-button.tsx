"use client";

import type { Track } from "@/lib/types";
import { exportRekordboxXml } from "@/lib/export/export-rekordbox-xml";

interface DownloadButtonProps {
  tracks: Track[];
  originalFileName?: string;
}

export function DownloadButton({
  tracks,
  originalFileName,
}: DownloadButtonProps) {
  const baseName = originalFileName
    ? originalFileName.replace(/\.[^.]+$/, "")
    : "playlist";

  const handleDownloadCsv = () => {
    const header = "Track Title,Artist,BPM,Key\n";
    const rows = tracks
      .map((t) => {
        const title = escapeCsvField(t.title);
        const artist = escapeCsvField(t.artist);
        const bpm = t.bpm?.toString() ?? "";
        const key = t.key;
        return `${title},${artist},${bpm},${key}`;
      })
      .join("\n");

    const csv = header + rows;
    triggerDownload(csv, "text/csv;charset=utf-8;", `harmonyset-optimized-${baseName}.csv`);
  };

  const handleDownloadXml = () => {
    const xml = exportRekordboxXml(tracks, `HarmonySet - ${baseName}`);
    triggerDownload(xml, "application/xml;charset=utf-8;", `harmonyset-optimized-${baseName}.xml`);
  };

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={handleDownloadCsv}
        className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 font-medium text-white transition-colors hover:bg-primary/80"
      >
        <DownloadIcon />
        Download CSV
      </button>
      <button
        onClick={handleDownloadXml}
        className="inline-flex items-center gap-2 rounded-lg border border-primary/40 px-5 py-3 font-medium text-primary transition-colors hover:bg-primary/10"
      >
        <DownloadIcon />
        Rekordbox XML
      </button>
    </div>
  );
}

function DownloadIcon() {
  return (
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
        d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
      />
    </svg>
  );
}

function triggerDownload(content: string, mimeType: string, fileName: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
}

function escapeCsvField(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}
