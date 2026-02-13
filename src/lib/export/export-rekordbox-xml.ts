import type { Track } from "@/lib/types";

/**
 * Generates a valid Rekordbox-compatible XML string from an array of tracks.
 *
 * The output follows the DJ_PLAYLISTS format that Rekordbox uses for
 * importing/exporting libraries:
 *
 *   <DJ_PLAYLISTS>
 *     <PRODUCT />
 *     <COLLECTION>
 *       <TRACK TrackID="..." Name="..." Artist="..." AverageBpm="..." Tonality="..." />
 *     </COLLECTION>
 *     <PLAYLISTS>
 *       <NODE Type="0" Name="ROOT">
 *         <NODE Name="..." Type="1" KeyType="0" Entries="N">
 *           <TRACK Key="1" />
 *         </NODE>
 *       </NODE>
 *     </PLAYLISTS>
 *   </DJ_PLAYLISTS>
 */
export function exportRekordboxXml(
  tracks: Track[],
  playlistName = "HarmonySet Export"
): string {
  const lines: string[] = [];

  lines.push('<?xml version="1.0" encoding="UTF-8"?>');
  lines.push('<DJ_PLAYLISTS Version="1.0.0">');
  lines.push(
    '  <PRODUCT Name="HarmonySet" Version="1.0" Company="HarmonySet"/>'
  );
  lines.push(`  <COLLECTION Entries="${tracks.length}">`);

  for (let i = 0; i < tracks.length; i++) {
    const t = tracks[i];
    const id = i + 1;
    const bpm = t.bpm != null ? t.bpm.toFixed(2) : "0.00";

    lines.push(
      `    <TRACK TrackID="${id}"` +
        ` Name="${escapeXml(t.title)}"` +
        ` Artist="${escapeXml(t.artist)}"` +
        ` AverageBpm="${bpm}"` +
        ` Tonality="${escapeXml(t.key)}"` +
        `/>`
    );
  }

  lines.push("  </COLLECTION>");
  lines.push("  <PLAYLISTS>");
  lines.push('    <NODE Type="0" Name="ROOT" Count="1">');
  lines.push(
    `      <NODE Name="${escapeXml(playlistName)}" Type="1" KeyType="0" Entries="${tracks.length}">`
  );

  for (let i = 0; i < tracks.length; i++) {
    lines.push(`        <TRACK Key="${i + 1}"/>`);
  }

  lines.push("      </NODE>");
  lines.push("    </NODE>");
  lines.push("  </PLAYLISTS>");
  lines.push("</DJ_PLAYLISTS>");

  return lines.join("\n");
}

/** Escapes XML special characters: & < > " ' */
function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
