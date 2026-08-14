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

**Sheet size: 128×64 — 8 columns × 4 rows, 32 tiles.** Indices run
left-to-right, top-to-bottom, 1-based (index 1 = top-left). Undrawn
indices are fine to leave transparent; the level keeps its
placeholder look until each role is filled.

| # | Sheet index | What |
|---|---|---|
| Row 0 | 1,2,3,4 | **carpet floor sequence** — 4-tile period, burgundy field + quiet figure |
| | 5 | brass floor medallion (breaker) |
| | 6 | worn patch (breaker) |
| | 7 | **marble border** — carpet meets the desk run |
| | 8 | sub-floor fill (below the walked row; never seen edge-on) |
| Row 1 | 9,10,11,12 | **mezzanine strip**: left cap, middle A, middle B, right cap |
| | 13 | mezzanine middle breaker — brass drip line accent |
| | 14,15,16 | *free* |
| Row 2 | 17,18,19 | **cart platform**: left cap, middle, right cap (brass frame + red velvet deck) |
| | 20,21 | **column segment pair** — 20 fades in at its top, 21 out at its bottom (garage pillar grammar: they alternate down an 11-tall run) |
| | 22 | wall sconce (warm) |
| | 23,24 | *free* — potted palm pair, if you want it here |
| Row 3 | 25,26,27,28 | **desk hero block, TOP row** — marble top with the standable light edge, 4-tile period |
| | 29,30,31,32 | **desk hero block, FACE row** — wood panelling, cubbies, bell glint, 4-tile period |

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

1. **The desk is 9 wide, not "4–6".** §1 specifies the hero block as
   "2-high, 4–6 wide"; the map's counter block is **9 × 2** at
   x 55–63. The block-relative skin gives you `dx` (columns from the
   run's left edge), so the practical answer is a **4-tile period that
   repeats across the 9** — 4 top tiles and 4 face tiles, as in the
   table above, which lands as `A B C D A B C D A`. If you would
   rather draw a bespoke 9-wide desk with no repeat, say so and the
   role gets a 9-slot vocabulary instead; it is a table change, not a
   redraw. **Nothing about the desk should be drawn as a one-off until
   you pick.** The Coatroom counter is 4-wide and repeats, for
   reference — this desk outranks it, so a bespoke run is defensible.
2. **The return zone is not a tile.** The bell-cart return zone is an
   object rect (x 1040–1136, rows 11–14), immediately RIGHT of the
   desk at the level's centre. It has no tiles of its own and needs
   none — but if you want it marked in the floor (a brass threshold, a
   velvet-rope footprint), that is a floor breaker keyed to those
   columns and I will place it. Currently the only thing telling the
   player where to hand items back is the HUD arrow.

## (d) Free and available

- **Sheet indices 14, 15, 16, 23, 24** — spare, plus anything you
  don't use above.
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
3. Desk hero block (8 tiles) — after this the level stops wearing the
   Coatroom's bones, which is §3's own milestone.
4. Cart platform strip (3), column pair (2), sconce (1).
5. Parallax P4 → P3 → P2 → P1, then the glow overlay.
