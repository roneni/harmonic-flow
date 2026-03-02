# HarmonySet — Project Context

## What Is This Product

HarmonySet is a web application that helps DJs mathematically sequence their playlists for perfect harmonic mixing and energy control. The user uploads a playlist export (from Rekordbox, Traktor, or Serato), and a Held-Karp optimization algorithm reorders tracks based on musical key compatibility (circle of fifths) and BPM-based energy management.

The product started as "Harmonic Flow" — a Python algorithm deployed on Streamlit. It was then fully rewritten in TypeScript and built into a standalone Next.js web app with a landing page, user accounts, and a freemium SaaS architecture.

**Live site:** https://www.harmonyset.com
**Optimizer page:** https://www.harmonyset.com/optimize
**GitHub repo:** The codebase is hosted on GitHub under Ronen's account (roneni), deployed via Vercel auto-deploy from the main branch.

## Tech Stack

- **Framework:** Next.js 14+ (App Router), TypeScript
- **Styling:** Tailwind CSS (dark theme, atmospheric DJ studio aesthetic)
- **Database:** Supabase (auth, user profiles, saved playlists)
- **Hosting:** Vercel (free tier, connected to GitHub, auto-deploys)
- **Algorithm:** Runs client-side for free-tier users (no server cost), server-side for authenticated users

## Core Algorithm

The algorithm is the key differentiator — no competitor uses Held-Karp optimization for harmonic mixing.

### What It Does
1. Accepts playlist files in XML (Rekordbox), CSV, or TXT formats
2. Normalizes all key formats (standard notation, Camelot 8A/5B, Open Key 1d/6m) into standard musical notation (Am, C, F#)
3. Calculates harmonic distance using the circle of fifths (12 positions, major/minor modes)
4. Optimizes track order using Held-Karp dynamic programming (exact for ≤20 tracks, greedy + 2-opt refinement for larger playlists)
5. Sorts by energy (BPM) within harmonic groups: Ramp Up, Ramp Down, or Wave mode
6. Outputs a downloadable optimized playlist

### Key Differentiator
Unlike competitors that force DJs into proprietary notation systems (Camelot or Open Key), HarmonySet works with real musical key notation — the universal language musicians already know. It accepts all formats as input but displays in standard notation.

### Algorithm Files (TypeScript)
- `key-mapping.ts` — 56+ key mappings (standard, enharmonic, long-form, Open Key)
- `standardize-key.ts` — 4-step key normalization
- `harmonic-distance.ts` — circular distance on the 1-12 wheel with A/B rings
- `held-karp.ts` — exact Held-Karp DP with typed arrays + greedy+2-opt fallback
- `optimizer.ts` — full pipeline: standardize, group, path, sort by energy mode
- `scoring.ts` — quality score 0-100 (harmonic 70% + BPM flow 30%)

### File Parsers
- `column-matcher.ts` — flexible header matching
- `parse-csv.ts` — auto-detect delimiter (comma/semicolon/tab), quoted fields
- `parse-txt.ts` — UTF-16LE BOM detection (Rekordbox exports)
- `parse-xml.ts` — Rekordbox XML `COLLECTION > TRACK` parsing
- `index.ts` — unified `parseFile()` dispatcher

### Quality Scoring System
- Average harmonic distance (lower is better) — 50% weight
- Percentage of perfect transitions (distance ≤ 1) — 30% weight
- Largest single key jump (penalty for outliers) — 20% weight
- BPM Flow Score based on selected energy mode — 30% of overall
- Overall Score = (Harmonic Score × 0.7) + (BPM Flow Score × 0.3)
- Per-transition indicators: green (perfect), yellow (acceptable), red (clash)

### Test Coverage
85 tests passing across 8 test files. Build clean.

## Features Built

### Optimizer Page (10 components + hook)
- `use-optimizer.ts` — state machine: idle → parsed → optimizing → results
- `file-upload.tsx` — drag-and-drop + file picker
- `track-table.tsx` — parsed tracks with invalid key highlighting
- `energy-mode-selector.tsx` — Ramp Up / Ramp Down / Wave
- `quality-score-card.tsx` — circular progress ring with stats
- `harmonic-path-viz.tsx` — custom SVG circle of fifths with animated path
- `before-after-comparison.tsx` — side-by-side with color-coded transition dots
- `transition-list.tsx` — per-transition quality breakdown
- `download-button.tsx` — CSV export (harmonyset-optimized-*.csv)
- `optimization-results.tsx` — container combining all result components

### Landing Page
- Three-step "How It Works" section
- Before/after framing
- "Built by DJs" social proof with Psychedelic Universe channel reference
- Stats bar (optimal distance of 14, 0 files sent to server, <1s optimization)
- Dual CTAs
- Dark, atmospheric, professional design — "DJ preparing a set in a high-end studio at 2 AM"

### Authentication & Database (Supabase)
- Sign up / Log in (email + password, Google OAuth optional)
- Save optimized playlists to account
- View playlist history
- Name and tag saved playlists

### Database Schema

**User Profiles Table:**
- id (uuid, references auth.users.id)
- display_name (text, optional)
- tier (text, default 'free' — values: 'free', 'pro')
- stripe_customer_id (text, nullable — for future Stripe)
- subscription_status (text, nullable — 'active', 'canceled', 'past_due')
- playlists_optimized_count (integer, default 0)
- total_improvement_score (float, default 0)

**Playlists Table:**
- Saved playlists with original and optimized track orders
- Quality scores, energy mode used, track count
- Row Level Security enabled (users can only see their own data)

## SaaS / Freemium Architecture (Built In, Pro Not Yet Active)

The tier system is architecturally built in with a `canAccessFeature(userTier, featureName)` helper. Pro features are built but gated behind lock icons and "Coming Soon" badges.

### Free Tier (No Account)
- Optimize playlists up to 30 tracks
- Single energy mode (Ramp Up only)
- View before/after comparison and quality score
- Download optimized CSV
- No save — results lost when leaving

### Free Tier (With Account)
- Everything above, plus:
- Save up to 3 playlists
- All 3 energy modes
- Up to 50 tracks per playlist
- Basic playlist history

### Pro Tier ($7-10/month — Future)
- Unlimited playlists, saves, and tracks
- Custom starting track selection
- Advanced energy profiles (custom BPM curves)
- Per-track transition quality breakdown
- Direct Rekordbox/Traktor XML re-import (not just CSV) — this is the killer Pro feature
- No branding on downloads
- Stripe Checkout integration planned

## Planned Future Features (Not Yet Built)

- **Rekordbox/Traktor XML export** — re-import optimized playlists directly into DJ software (highest-value Pro feature)
- Serato crate export (proprietary binary format, harder)
- Spotify/Beatport API integration for auto-fetching track data
- Set builder that suggests tracks to fill harmonic gaps
- Multi-DJ collaboration (festival b2b sets)
- Analytics dashboard ("your average harmonic distance improved over time")
- Set Timer — calculate average track duration for a time slot
- Interactive Key Finder — paste track name, get key and BPM
- PWA support
- Integration with psychedelic-universe.com (shared branding, linked auth)

## Growth Strategy

**Phase 1 (Months 1-3):** SEO & organic discovery — DJs searching "harmonic mixing tool", "playlist optimizer", "circle of fifths DJ"
**Phase 2 (Months 2-4):** Community seeding — r/Beatmatch, r/DJs, r/psytrance, DJ TechTools forums
**Phase 3 (Month 3+):** Psychedelic Universe connection — "DJ Tools" section on psychedelic-universe.com, cross-promotion to 100K+ YouTube subscribers
**Phase 4 (Months 4-6):** Activate Pro tier with Stripe, introductory pricing for early adopters

## Brand Guidelines

- **Voice:** Professional, approachable, technically credible without jargon. "We built this because we needed it" energy.
- **Visual:** Dark, atmospheric, premium. No flashy marketing.
- **Legal:** Do NOT use "Camelot" as a product feature name. Do NOT reproduce the Camelot Wheel image. Refer to concepts as "harmonic mixing" or "circle of fifths." Pioneer DJ, Rekordbox, Traktor, Serato mentioned only as compatibility references.
- **Connection:** "Built by the team behind Psychedelic Universe" — subtle reference. The tool is genre-agnostic but comes from the Psytrance world.

## Key Infrastructure Details

- **Supabase project name:** HarmonySet
- **Vercel project:** Connected to GitHub, auto-deploys from main branch
- **Domain:** harmonyset.com (purchased and connected to Vercel)
- **Environment variables in Vercel:** SUPABASE_URL, SUPABASE_ANON_KEY
- **Monthly cost:** ~$0 (Vercel free tier + Supabase free tier + ~$10/year domain)

## Where We Left Off

The site is fully live at harmonyset.com with all MVP features operational — optimizer, landing page, auth, database, and visual before/after comparison. The branding was updated from "Harmonic Flow" to "HarmonySet" across the entire codebase. The next priorities discussed were:

1. **Rekordbox XML export** — the highest-value feature for Pro tier (reverse the parser to write optimized XML that Rekordbox imports directly)
2. **Activating the Pro tier** with Stripe integration
3. **SEO content** — blog posts / guide pages on harmonic mixing concepts to drive organic traffic
4. **Cross-promotion** with the Psychedelic Universe channel and website
