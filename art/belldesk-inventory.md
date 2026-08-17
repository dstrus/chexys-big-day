# Bell Desk tile-role inventory (BRIEF-ART-07 step zero)

Measured off `assets/maps/belldesk.json` at HEAD, not remembered.
Palette: `art/palettes/belldesk-env.gpl` (ships with the brief).

**Map:** 120×17 tiles = 1920×272px = **4 screens** at 480×270.
Player-driven camera (not an auto-scroller), `levelId: belldesk`.

## (a) The sheet, and where it goes

Draw **`art/aseprite/belldesk-tile.aseprite`**, export to
`assets/tiles/belldesk.png`. The export pass is already wired
(`scripts/export-sprites.sh` → `belldesk-tile:belldesk`), so
`./scripts/export-sprites.sh` picks it up the moment the source
exists, and the loader keys it `tiles-belldesk` automatically.

**Sheet size: 144×96 — 9 columns × 6 rows, 54 tiles.** Nine columns
because the desk is drawn bespoke (decision below): a 9-wide sheet
lets each desk row be one unbroken run you draw straight across,
rather than a 9-tile block wrapping awkwardly across an 8-wide sheet.
Indices run left-to-right, top-to-bottom, 1-based (index 1 =
top-left). Undrawn indices are fine to leave transparent; the level
keeps its placeholder look until each role is filled.

| Row | Sheet index | What |
|---|---|---|
| 0 | 1,2,3,4 | **carpet floor sequence** — 4-tile period, leopard field (two-value mottle + rosettes) per the Faena direction |
| | 5 | brass floor medallion (breaker) |
| | 6 | worn patch (breaker) |
| | 7 | **marble border** — carpet meets the desk run |
| | 8 | sub-floor fill (below the walked row; never seen edge-on) |
| | 9 | *free* |
| 1 | 10,11,12,13 | **mezzanine strip**: left cap, middle A, middle B, right cap |
| | 14 | mezzanine middle breaker — brass drip line accent |
| | 15–18 | *free* |
| 2 | 19,20,21 | **cart platform**: left cap, middle, right cap (brass frame + red velvet deck) |
| | 22,23 | **column segment pair** — 22 fades in at its top, 23 out at its bottom (garage pillar grammar: they alternate down an 11-tall run) |
| | 24 | wall sconce (warm) |
| | 25,26 | potted palm pair |
| | 27 | **column plinth** — the segment that meets the carpet (see below) |
| 3 | **28–36** | **desk hero block, TOP row** — nine bespoke tiles, marble top with the standable light edge, drawn left-to-right as one 144px run |
| 4 | **37–45** | **desk hero block, FACE row** — nine bespoke tiles, wood panelling / key cubbies / bell glint, same run |
| 5 | 46–54 | *free* — spare row |

**Why the column needs three tiles, not two.** The bg2 runs are **11
tall** (rows 4–14) and the fade-in/fade-out pair tiles at 32px, so a
plain alternation would end the column on its fade-IN tile exactly
where it meets the floor. Row 14 takes a dedicated **plinth** (index
27) instead, which leaves rows 4–13 as five clean pairs ending on the
fade-out. Draw 22 as "column continues above", 23 as "column continues
below", 27 as "column lands on the carpet".

## (b) Roles, gids, and exact placements

Maps speak **role gids**; the skin table translates them per sheet
(convention -12-a). The role vocabulary is fixed — these seven gids
are all the map uses, and all it can use without a code change:

| Map gid | Role | Where it is in THIS map |
|---|---|---|
| 1 | `ground` | rows **15 and 16**, full width (x 0–119). Row 15 is walked, row 16 is fill beneath it — the skin branches on `y`, exactly like the garage's asphalt. |
| 6 / 2 / 7 | `leftCap` / `middle` / `rightCap` | ten platforms in **three tiers** — see below |
| 3 | `counter` | **x 55–63, rows 13–14** — 9 wide × 2 high, sitting on the floor |
| 4 | `dressing` (bg1) | twelve **1×1** tiles at **row 3**, every 10 columns from x 5 — ceiling height, the sconce line |
| 5 | `dressing` (bg2) | six **1-wide × 11-tall** runs at **x 10, 30, 50, 70, 90, 110**, rows 4–14 — the column rank |

### The three platform tiers

| Tier | Row | Count | Width | x positions |
|---|---|---|---|---|
| Upper mezzanine | 6 | 2 | 7 | 16–22, 74–80 |
| Lower mezzanine | 9 | 4 | 9 | 12–20, 44–52, 70–78, 100–108 |
| Cart platforms | 12 | 4 | 6 | 8–13, 40–45, 74–79, 106–111 |

This is the brief's "cart platforms + two mezzanine tiers", and the
row numbers are how the skin tells them apart: all three tiers speak
the SAME role gids, so the skin function branches on `y` (`y === 12`
→ cart platform art, rows 6 and 9 → mezzanine strip). That is why the
sheet needs both strip sets.

**All three tiers are double-faced** — the player walks the top and
sees the underside from below (rows 6 and 9 hang over open lobby;
row 12 hangs over the floor). Same grammar as the garage decks: one
16px tile carries a walked top edge and a readable soffit bottom.

**Every tier holds item spawns** (T1–T2 on row 6, Z1–Z4 on row 9,
M1–M4 on row 12, plus seven on the floor), so no tier is decoration —
each one's standable edge has to read at a glance while running.

## (c) Two things the brief and the map disagree on

1. **The desk is 9 wide, not "4–6" — SETTLED 2026-08-14: bespoke.**
   §1 specifies the hero block as "2-high, 4–6 wide"; the map's
   counter block is **9 × 2** at x 55–63, and the human chose to draw
   it bespoke rather than as a repeating period. So the `counter` role
   now has a nine-slot vocabulary: `dx` (columns from the run's left
   edge) maps 0→8 straight onto sheet indices 28–36 on top and 37–45
   on the face. Draw the desk as **one 144×32 picture** — cubbies,
   bell, panel joints wherever they want to be, no tiling constraint
   inside the run. It is cut into 16px columns only because the engine
   stores it as tiles.
   Two consequences worth knowing: the desk art is now specific to a
   9-wide counter (a future map placing a wider one repeats index 36 /
   45 to the right rather than breaking), and this is why the sheet is
   9 columns instead of 8.
2. **The return zone is not a tile.** The bell-cart return zone is an
   object rect (x 1040–1136, rows 11–14), immediately RIGHT of the
   desk at the level's centre. It has no tiles of its own and needs
   none — but if you want it marked in the floor (a brass threshold, a
   velvet-rope footprint), that is a floor breaker keyed to those
   columns and I will place it. Currently the only thing telling the
   player where to hand items back is the HUD arrow.

## (d) Free and available

- **Sheet indices 9, 15–18, 46–54** — spare, plus anything you don't
  use above. The spare row 5 exists precisely so a role can grow
  without re-cutting the sheet.
- **The `fg` layer exists and is EMPTY.** The garage's lighting
  machinery is generic and already built: an additive fg tile layer
  over a MULTIPLY ambient scrim, with a flicker on the layer's alpha
  (`TUNING.fgAmbient` / `fgFlicker*`, all on the `` ` `` panel). If you
  want warm lamp pools on the lobby carpet — or the chandelier
  throwing light on the floor beneath it — that is a skin flag plus
  tile placement, no new code. Draw the light on black or on
  transparent; both vanish under additive. The garage's lesson, at
  cost: additive light needs a DIMMED room to read, so pools and
  ambient are one decision, not two.
- **Parallax drops in unannounced**: `assets/parallax/belldesk/p1.png`
  … `p4.png` at the sizes in §2, plus `glow.png` for the chandelier
  pulse (screen-fixed, additive, alpha-pulsed — the same overlay the
  Coatroom uses). Any subset works; a lone P4 is fine.

## (e) Order, restated against the map

1. Floor sequence (4 + 2 breakers + marble border + fill) — 8 tiles
   covering **rows 15/16 across all 120 columns**, the surface the
   player spends most of the level on.
2. Mezzanine strip (4 + breaker) — 10 platforms, all three tiers get
   *something* immediately since cart platforms can borrow the strip
   until row 2 of the sheet is drawn.
3. Desk hero block (18 tiles — the bespoke 144×32 run) — after this
   the level stops wearing the Coatroom's bones, which is §3's own
   milestone.
4. Cart platform strip (3), column pair + plinth (3), sconce (1),
   palms (2).
5. Parallax P4 → P3 → P2 → P1, then the glow overlay.
