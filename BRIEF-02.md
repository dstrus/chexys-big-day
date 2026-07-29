# BRIEF-02 — Level pipeline + The Coatroom (Phase 2, code track)

**For:** Claude Code sessions (split into the numbered chunks below;
one chunk per session is the intended pace)
**Prerequisite: Gate 1 PASSED.** Do not start this brief until the
human has confirmed in DECISIONS.md that the grey-box core loop is
fun and final tuning values are committed. If there is no Gate 1
entry in DECISIONS.md, STOP and ask.
**Read first:** CLAUDE.md, DESIGN.md (§2 all, §3.1, §5, §7),
DECISIONS.md (for Gate 1 tuning outcomes and the dash decision).

**Goal:** Turn the grey-box into a real, data-driven game with one
fully implemented level (The Coatroom), ready to receive final art
and audio. Placeholder art remains acceptable throughout — never
block on the art track.

## Inputs this brief consumes (from Gate 1)

- Final tuning values committed to `src/config/tuning.js`.
- The dash decision (keep for Level 2 / cut to v2) — logged in
  DECISIONS.md. If kept, dash stays disabled until Level 2; if
  cut, remove the stub and its tuning entries.

## Chunk 1 — Tiled level pipeline

- Install Tiled-compatible loading: levels live in
  `assets/maps/*.json` (Tiled JSON export), loaded natively by
  Phaser.
- Define the map conventions (document in `assets/maps/README.md`):
  - Tile layers: `bg2`, `bg1`, `main` (collision), `fg`.
  - Object layers: `spawns` (player start, item spawn points with
    `category` property), `zones` (rack/return zones, kill zones).
  - Map properties: `levelId`, `rushSeconds`, `waveFile`.
- Build `coatroom.json`: a real Coatroom layout (~3–4 screens
  wide) replacing the hardcoded grey-box level. Blocky placeholder
  tiles are fine; layout quality matters, tile art does not.
- Acceptance: Playground scene is deleted; a generic `LevelScene`
  boots any map by key; `npm run dev` boots into coatroom.

## Chunk 2 — Data-driven wave/spawn system

- Wave schedules move out of code into `assets/waves/*.json`.
  Schema (document with an example file):
  `{ time, spawnPoint, itemCategory, weightTier, count, interval }`
  plus enemy spawn entries.
- Item categories carry a color property — use the ChexApp tag
  colors from art/palette-brand.md (coats=orange #FE701E for
  Coatroom; the full category mapping lives in the palette file).
- The adaptive-intensity system (DESIGN.md §2.5) modulates the
  wave schedule (spawn interval scaling, enemy count) within the
  clamped band; multiplier logic unchanged from grey-box.
- Acceptance: `coatroom-waves.json` drives the whole 2:30 rush;
  editing the JSON changes the level with no code changes.

## Chunk 3 — Guest text-bubble UI

- Guests exist as lightweight data (no sprites yet): each checked
  item belongs to a guest; returns and losses trigger text
  bubbles.
- Bubble component: brand-styled per art/palette-brand.md —
  Background Tan panel, Gray-700 text, Success Green accent for
  happy ("Got my coat, thanks! 🎉"-style), Alert Red accent for
  lost-item bubbles. Translucent per DESIGN.md §5.
- Bubbles queue bottom-right, max 3 visible, auto-dismiss ~2.5s,
  never obscure the HUD or play area center.
- Copy: 8–10 happy variants, 4–5 unhappy variants in
  `src/config/guestLines.js`. Keep the tone silly-affectionate
  per DESIGN.md §1. The human will punch up the copy later —
  write placeholders freely.
- Acceptance: bubbles fire on return/loss with correct styling.

## Chunk 4 — Sprite/atlas integration hooks (art track handshake)

- Implement atlas loading for the player: if
  `assets/sprites/chexy.png` + `chexy.json` (Aseprite CLI export
  format) exist, load and use them; otherwise fall back to the
  placeholder rect. Frame-tag conventions: `idle`, `run`, `jump`,
  `fall`, `land`, `tag`, `hold`, `hit`, `win`, `lose`.
- Anchor per DESIGN.md §5: 48×48 sprite bottom-center aligned to
  the 32×32 physics body bottom-center. Physics untouched.
- Write `scripts/export-sprites.sh`: wraps the Aseprite CLI
  (`aseprite -b art/aseprite/chexy.ase --sheet ... --data ...`)
  so the art-to-game path is one command. Degrade gracefully if
  Aseprite isn't installed (print instructions, don't fail the
  build).
- Also build the flipbook previewer from BRIEF-ART-01 §6: a tiny
  standalone HTML page (`tools/flipbook.html`) that hot-reloads a
  PNG strip + JSON atlas and plays tagged animations at chosen
  fps. No build step; opens from file://.
- Acceptance: dropping a real export in `assets/sprites/`
  replaces the rect with zero code changes; deleting it restores
  the rect.

## Chunk 5 — Audio hooks + placeholder SFX

- Central `AudioBus`: named events (`tag`, `holdStart`,
  `holdComplete`, `holdInterrupt`, `itemLost`, `multiplierUp`,
  `multiplierDown`, `rushStart`, `rushEnd`, `uiSelect`) mapped to
  sound files in `assets/audio/`; missing files are silently
  skipped.
- Generate placeholder jsfxr-style SFX for each event (chunky
  tap per DESIGN.md §2.3 juice requirements).
- Music: looping track hook per level (`assets/audio/music/`),
  volume ducking on results screen. Placeholder loop acceptable
  (even a generated 4-bar chiptune stub).
- Volume settings (master/sfx/music) in tuning.js + debug panel.
- Acceptance: full rush plays with sound; pulling any audio file
  never crashes.

## Chunk 6 — Results screen + level flow

- Proper results screen per DESIGN.md §2: items returned, guests
  served, tags collected, score, best multiplier held, and the
  running "item return rate" percentage (the 99% joke pays off
  at the finale). Retry and continue options.
- Level-select flow (Title → level list → level → results →
  next). Only Coatroom unlocked; slots shown for 2–5 as "?".
- Local storage: best scores per level (localStorage is fine —
  this is a browser game outside Claude.ai artifacts; note it in
  code comments as the one storage dependency).
- Acceptance: full loop Title → Coatroom → Results → Title with
  persisted best score.

## Standing rules for every chunk

- Small commits per acceptance criterion; log completion of each
  chunk in DECISIONS.md.
- 60fps at ×2 scale remains an acceptance criterion (DESIGN.md
  §7) — re-verify at the end of every chunk.
- Anything not listed here (new mechanics, extra levels, gamepad,
  etc.) is out of scope per CLAUDE.md guardrails.
- If a chunk's spec conflicts with Gate 1 tuning outcomes or any
  doc, STOP and ask.

## Exit condition

BRIEF-02 is complete when the Coatroom is fully playable end to
end, driven by data files, with sound hooks live, sprite hooks
ready for the art track's exports, and results/flow in place.
This is the code-track half of Gate 2; the gate itself passes
only when the style-proof (BRIEF-ART-01) also lands and the
human signs off in DECISIONS.md.
