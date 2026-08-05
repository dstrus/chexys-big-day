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

Optional properties:

| Property | Type | Meaning |
|----------|------|---------|
| `stealCooldownMs` | int | Per-level steal-initiation cooldown override |
| `dashUnlockBeat` | bool | Run the 10s dash-unlock beat at level start (Bell Desk only) |
| `dashAllowed` | bool | Dash usable in this level once unlocked — set on Bell Desk and every level after it; omit on the Coatroom (DESIGN.md §3.2: the unlock persists for SUBSEQUENT levels) |

## Tileset

Maps use the embedded tileset named `placeholder` (16×16, 8 columns
× 3 rows = 24 slots). Real art lives at `assets/tiles/coatroom.png`
(drop-in: delete it and Boot regenerates a flat placeholder strip).
Source: `art/aseprite/coatroom-tiles.aseprite`. Row 1 carries the
structural roles below; rows 2–3 (gids 9–24) are reserved for
dressing/expansion tiles:

| gid | Role |
|-----|------|
| 1 | Ground (surface + fill; bottom face never visible) |
| 2 | Rack platform — MIDDLE (1-tile-thick: top and underside both exposed) |
| 3 | Counter block (top row = standing surface, bottom row = fill) |
| 4 | bg1 dressing (near, non-colliding) |
| 5 | bg2 dressing (far, non-colliding) |
| 6 | Rack platform — LEFT CAP |
| 7 | Rack platform — RIGHT CAP |
| 8 | spare |

Platform strips are laid as `6 [2 ...] 7` (caps on both ends,
middles between). Runs shorter than 2 tiles stay all-middle —
avoid them in layouts.

## Placement-validity gate (handoff 2026-08-04-d)

Any system that places or displaces an item — spawns,
drops, scatters (Ticket Tornado), boss effects, bounce
physics — must route through the shared place-item path,
which resolves tile overlap (walk-up de-embed) before the
item goes live. Two members of this bug family have
shipped (spawn-height 2026-08-03, drop-embed 2026-08-04);
no third. (Code: `LevelScene.placeItemClear` — spawns and
stun-drops already route through it.)

## Item spawn heights

Item spawn points must clear the LARGEST item silhouette (the tier-3
trunk, 26×30): place points at least 20px above the floor surface
(e.g. ground top y=240 → spawn y ≤ 220). A spawn that embeds the
item's body in a solid tile defeats arcade separation and the item
falls through the floor. (Found executing BRIEF-03 — the Coatroom
never noticed because it only spawns tier-1 items.)

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
