# HarmonySet

**Algorithmic DJ playlist optimization based on harmonic mixing and energy flow.**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tests](https://img.shields.io/badge/tests-85%20passing-brightgreen)](https://vitest.dev/)

[Live App](https://www.harmonyset.com) | [How It Works](#how-it-works) | [Getting Started](#getting-started) | [Contributing](#contributing)

---

## What is HarmonySet?

HarmonySet is a DJ playlist optimizer that reorders tracks for seamless harmonic transitions and controlled energy flow. Upload a playlist export from Rekordbox, Traktor, or Serato, and the algorithm returns an optimized track order with a quality score, transition analysis, and circle-of-fifths path visualization.

Unlike simple key-matching tools, HarmonySet uses the **Held-Karp dynamic programming algorithm** -- the same approach used to solve the Traveling Salesman Problem exactly -- to find the optimal harmonic path through your tracks. No other DJ tool takes this approach.

Built by DJs, for DJs -- from the team behind [Psychedelic Universe](https://www.youtube.com/@PsychedelicUniverse) (634K subscribers).

---

## Key Features

- **Held-Karp optimization** -- exact optimal solution for playlists up to 20 tracks; greedy + 2-opt heuristic for larger sets
- **Circle of fifths harmonic distance** -- real musical key analysis, not simplified notation
- **56+ key format normalization** -- handles every key notation style across DJ software
- **Energy flow modes** -- Ramp Up, Ramp Down, or Wave energy management based on BPM curves
- **Before/after comparison** -- see the quality improvement side by side
- **Transition quality visualization** -- per-transition scoring with harmonic compatibility indicators
- **Circle of fifths path visualization** -- see your set's harmonic journey mapped visually
- **Drag-and-drop upload** -- drop your playlist file and go
- **Quality score (0-100)** -- objective measurement of set cohesion
- **CSV download** -- export the optimized order
- **Saved playlists** -- Supabase-backed auth and playlist persistence
- **SEO reference guides** -- built-in guides for circle of fifths, harmonic mixing, energy flow, and Rekordbox optimization

---

## How It Works

### Algorithm Overview

HarmonySet models playlist optimization as a variant of the Traveling Salesman Problem (TSP), where each track is a node and the "distance" between nodes is a weighted combination of:

1. **Harmonic distance** -- measured as steps around the circle of fifths between track keys, with bonuses for relative major/minor relationships
2. **BPM delta** -- penalizes large tempo jumps between consecutive tracks
3. **Energy target** -- biases track placement to match the selected energy curve (ramp up, ramp down, or wave)

**For playlists of 20 tracks or fewer**, the algorithm uses Held-Karp dynamic programming to find the provably optimal ordering in O(n^2 * 2^n) time and space.

**For larger playlists**, a greedy nearest-neighbor heuristic builds an initial solution, then a 2-opt local search iteratively improves it by reversing subsegments until no further improvement is found.

### Input Processing

1. Parse the uploaded file (XML, CSV, or TXT)
2. Extract track metadata: title, artist, key, BPM
3. Normalize key notation from 56+ formats to a canonical internal representation
4. Build the pairwise distance matrix
5. Run the optimizer
6. Return the reordered playlist with per-transition quality scores

---

## Supported Formats

| Format | Source | Extension |
|--------|--------|-----------|
| XML | Rekordbox | `.xml` |
| CSV | Rekordbox, Serato, generic | `.csv` |
| TXT | Traktor, generic | `.txt` |

The parser auto-detects the format and maps columns to the required fields (track name, artist, key, BPM).

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router) |
| UI | React 19, Tailwind CSS, Framer Motion |
| Language | TypeScript |
| Auth & Database | Supabase |
| Testing | Vitest |
| Hosting | Vercel |

---

## Getting Started

### Prerequisites

- Node.js 20+
- npm, yarn, or pnpm
- A Supabase project (for auth and saved playlists)

### Installation

```bash
git clone https://github.com/roneni/harmonic-flow.git
cd harmonic-flow
npm install
```

### Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

---

## Tests

HarmonySet has 85 tests across 8 test files covering key normalization, harmonic distance calculation, optimizer correctness, file parsing, and energy mode logic.

```bash
npm run test
```

All tests use [Vitest](https://vitest.dev/).

---

## Project Structure

```
harmonic-flow/
  src/app/          # Next.js App Router pages and layouts
  src/components/   # React UI components
  src/lib/          # Core algorithm, parsers, key normalization
  __tests__/        # Vitest test suites
  public/           # Static assets
  supabase/         # Database migrations and types
```

---

## Pricing

| | Free | Pro (coming soon) |
|---|---|---|
| Tracks per playlist | 30 | Unlimited |
| Optimization algorithm | Full | Full |
| Energy modes | All | All |
| CSV export | Yes | Yes |
| Rekordbox XML re-export | -- | Yes |
| Saved playlists | 3 | Unlimited |

---

## Contributing

Contributions are welcome. To get started:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Write tests for new functionality
4. Ensure all tests pass (`npm run test`)
5. Submit a pull request

Please open an issue first for significant changes to discuss the approach.

---

**HarmonySet** -- [harmonyset.com](https://www.harmonyset.com)
