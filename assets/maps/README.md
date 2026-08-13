# assets/maps/ — Tiled map conventions

Levels are Tiled JSON exports (`*.json`), loaded natively by Phaser.
`LevelScene` boots any map by key; maps are registered in
`src/scenes/BootScene.js` (ESM import → tilemap cache, so Vite bundles
them and hot-reloads on edit).

## Editing

**Tile layout: use Tiled** (`brew install --cask tiled`) — open the
`.json` directly. The embedded tileset points at `../tiles/coatroom.png`
so it resolves from this directory; the game ignores that path and
matches the tileset by NAME (`placeholder`), so it only matters to
Tiled.

**Object layers and properties** (spawn points, `collectibles`, map
properties) are small and named — comfortable to edit by hand here.

After generating or hand-editing a map, run:

```
node scripts/format-maps.mjs
```

It re-indents the structure and emits each tile layer's `data` as ONE
MAP ROW PER LINE, so the array has the same shape as the level and a
one-tile change is a one-line diff. Idempotent; safe to run after Tiled
saves too.

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
  - `return` — rack/return zones (Contact Card saves fly here).
  - `kill` — kill zones (none in Coatroom).
- **`collectibles`** (point objects, optional — BRIEF-04)
  - Each point's `type` names a registry key from
    `src/config/collectibles.js` (currently `nfcTag` — Contact
    Cards and Insights Reports are wave-spawned only, never
    Tiled-placed). Wave-file entry shape:
    `{ "time": s, "type": "collectible", "collectibleType":
    "contactCard" | "insightReport" | "nfcTag", "spawnPoint":
    "<item point name>" | "any" }`.

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
| `maxItemsOnField` | int | Per-level cap on taggable items on field (BRIEF-06: field count is the density/perf lever; default = tuning.maxItemsOnField) |
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

## Tile SKINS (2026-08-13; ratified project-wide, handoff 2026-08-12-a)

Map data always speaks the ROLE gids above. This is the convention for
EVERY level's sheet — the garage and museum sheets use it when they
land. A *skin* re-points those
roles at whatever indices a real art sheet uses, so new tile art never
requires rewriting a hand-owned map. Skins live in `TILE_SKINS` at the
top of `src/scenes/LevelScene.js`, keyed by `levelId`, and apply only
when their texture is present — delete the art file and the level
reverts to the original sheet with no code change.

Shipped skin — `coatroom` → `assets/tiles/coatroom2.png` (source
`art/aseprite/coatroom-tiles2.aseprite`, exported by
`scripts/export-sprites.sh`):

- **row 1** — four floor tiles that repeat in order (role `ground`),
  then platform left cap, two alternating middles, right cap (roles
  `leftCap` / `middle` / `rightCap`).
- **row 2** — four counter TOP tiles then four counter BOTTOM tiles
  (role `counter`). Counter tiles are BLOCK-RELATIVE: a skin function
  receives `{ dx, isTop }` — columns from its block's left edge, and
  whether it is the block's first row — so moving or resizing the
  counter in Tiled still skins correctly.
- The sheet draws no bg1/bg2 dressing, so the skin sets
  `hideDressing` (those tile layers render off; the parallax paintings
  carry that depth). Row 3 (gids 17-24) is still free.

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

## Blockout rule — edge-push pockets (auto-scroll levels)

No fully-enclosed pockets between STRUCTURE tiles reachable by the
trailing-edge push. Vehicles may form pockets — they yield to the
push (anti-crush guarantee, handoff 2026-08-09-g: Chexy slides
through a pinching vehicle at push speed); structure tiles never
yield, so tiles must not enclose a pocket the edge push can press
Chexy into.
