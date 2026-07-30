# assets/maps/ — Tiled map conventions

Levels are Tiled JSON exports (`*.json`), loaded natively by Phaser.
`LevelScene` boots any map by key; maps are registered in
`src/scenes/BootScene.js` (ESM import → tilemap cache, so Vite bundles
them and hot-reloads on edit).

## Tile layers (in draw order, back to front)

| Layer | Purpose |
|-------|---------|
| `bg2` | Far background dressing (no collision) |
| `bg1` | Near background dressing (no collision) |
| `main` | THE collision layer — every non-empty tile is solid |
| `fg` | Foreground overlay, drawn over sprites (no collision) |

## Object layers

- **`spawns`** (point objects)
  - `player` — the player start position (exactly one).
  - `item-*` — item spawn points. Each carries a string property
    `category` (e.g. `coat`); wave files reference these by name or
    use `"any"` for a random point.
- **`zones`** (rectangle objects)
  - `return` — rack/return zones (reserved for later chunks).
  - `kill` — kill zones (none in Coatroom).

## Map properties (required)

| Property | Type | Meaning |
|----------|------|---------|
| `levelId` | string | Level identifier (`coatroom`) |
| `rushSeconds` | int | Rush timer length for this level |
| `waveFile` | string | Wave schedule in `assets/waves/` |

## Tileset

Maps use the embedded tileset named `placeholder` (16×16, 8 tiles,
one row). The matching texture is generated at runtime in Boot —
there is no PNG on disk yet; final tile art will replace it under
the same name and layout.

## Spawn fairness (DESIGN.md §2.4)

Items only spawn where the player can plausibly contest them: at
spawn time the game compares straight-line travel-time estimates
(player vs. nearest enemy + `spawnFairnessGraceMs`). A wave entry
may list an optional `fallbackSpawnPoints` array (spawn-point names
from this map's `spawns` layer) — if the primary point fails the
check, fallbacks are tried in order; if nothing passes, the
least-unfair point is used rather than dropping the spawn. Place
enough spawn points per area that fallbacks exist. Enemies also
ignore items younger than `freshItemGraceMs`. The tuning panel's
"Fairness overlay" flag draws the live check (green/red rings per
point) while the panel is open.

## Layout rule (grey-box tuning)

Max jump height with default tuning is ~61px. Keep platform hops at
**≤48px** (3 tile rows) so everything stays reachable — see the row
comments in the coatroom generator history / DECISIONS.md.
