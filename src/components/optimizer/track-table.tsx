"use client";

import type { Track } from "@/lib/types";
import { standardizeKey } from "@/lib/algorithm";

interface TrackTableProps {
  tracks: Track[];
  showIndex?: boolean;
  highlightInvalidKeys?: boolean;
}

export function TrackTable({
  tracks,
  showIndex = true,
  highlightInvalidKeys = false,
}: TrackTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-text-secondary/10">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-text-secondary/10 text-left text-xs uppercase tracking-wider text-text-secondary">
            {showIndex && <th className="px-4 py-3 w-12">#</th>}
            <th className="px-4 py-3">Title</th>
            <th className="px-4 py-3">Artist</th>
            <th className="px-4 py-3 w-20 text-right font-mono">BPM</th>
            <th className="px-4 py-3 w-20 text-center font-mono">Key</th>
          </tr>
        </thead>
        <tbody>
          {tracks.map((track, i) => {
            const isInvalid =
              highlightInvalidKeys && standardizeKey(track.key) === null;

            return (
              <tr
                key={i}
                className="border-b border-text-secondary/5 transition-colors hover:bg-surface/50"
              >
                {showIndex && (
                  <td className="px-4 py-2.5 font-mono text-text-secondary">
                    {i + 1}
                  </td>
                )}
                <td className="px-4 py-2.5 text-text-primary">
                  {track.title}
                </td>
                <td className="px-4 py-2.5 text-text-secondary">
                  {track.artist}
                </td>
                <td className="px-4 py-2.5 text-right font-mono text-text-primary">
                  {track.bpm ?? "-"}
                </td>
                <td
                  className={`px-4 py-2.5 text-center font-mono ${
                    isInvalid ? "text-clash font-bold" : "text-text-primary"
                  }`}
                >
                  {track.key || "-"}
                  {isInvalid && (
                    <span className="ml-1 text-xs" title="Unrecognized key">
                      !
                    </span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
