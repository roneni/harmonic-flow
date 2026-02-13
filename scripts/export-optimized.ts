import { readFileSync, writeFileSync } from 'fs';
import { optimizePlaylist } from '../src/lib/algorithm/optimizer';
import { standardizeKey } from '../src/lib/algorithm/standardize-key';
import type { Track, EnergyMode } from '../src/lib/types';

function readUtf16(path: string): string {
  const buf = readFileSync(path);
  const start = (buf[0] === 0xFF && buf[1] === 0xFE) ? 2 : 0;
  return buf.slice(start).toString('utf16le');
}

function parseTxt(content: string): Track[] {
  const lines = content.split('\r\n').filter(l => l.trim());
  const headers = lines[0].split('\t');

  const titleIdx = headers.findIndex(h => /title/i.test(h));
  const bpmIdx = headers.findIndex(h => /bpm/i.test(h));
  const keyIdx = headers.findIndex(h => /key/i.test(h));

  return lines.slice(1).map((line, i) => {
    const cols = line.split('\t');
    const rawKey = cols[keyIdx]?.trim() || '';
    return {
      title: cols[titleIdx]?.trim() || 'Unknown',
      artist: '',
      bpm: parseFloat(cols[bpmIdx] || '0') || null,
      key: rawKey,
      camelotKey: standardizeKey(rawKey),
    };
  });
}

function exportCsv(tracks: Track[]): string {
  const lines = ['#,Title,Key,Camelot Key,BPM'];
  tracks.forEach((t, i) => {
    const title = t.title.includes(',') ? '"' + t.title.replace(/"/g, '""') + '"' : t.title;
    lines.push((i + 1) + ',' + title + ',' + t.key + ',' + t.camelotKey + ',' + (t.bpm || ''));
  });
  return lines.join('\n');
}

const files = [
  { name: 'waveform', path: '/Users/ronen/Desktop/waveform.txt' },
  { name: 'faders', path: '/Users/ronen/Desktop/faders.txt' },
  { name: 'SL', path: '/Users/ronen/Desktop/SL.txt' },
];

const mode: EnergyMode = 'ramp_up';

for (const file of files) {
  const content = readUtf16(file.path);
  const tracks = parseTxt(content);
  const validTracks = tracks.filter(t => t.camelotKey != null && t.camelotKey !== '');

  const result = optimizePlaylist(validTracks, mode);
  const csv = exportCsv(result.optimizedTracks);

  const outPath = '/Users/ronen/Desktop/harmonyset-' + file.name + '-optimized.csv';
  writeFileSync(outPath, csv, 'utf-8');
  console.log(
    '✅ ' + outPath +
    ' (' + result.optimizedTracks.length + ' tracks, score ' +
    result.originalScore.overall.toFixed(0) + ' → ' +
    result.optimizedScore.overall.toFixed(0) + ')'
  );
}
