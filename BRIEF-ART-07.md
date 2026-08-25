# BRIEF-ART-07 — The Bell Desk Environment

**For:** Art track. (Numbering note: ART-05 was reserved for
the Museum and landed 2026-08-17 — the debt is paid.)
**Read first:** BRIEF-ART-02 §0 (readability law — applies
verbatim), the skin convention (-12-a: maps speak role gids,
skins translate; this sheet ships as a skin like the garage's).
**Mood (BRIEF-03, amended by handoff 2026-08-14-a — the
FAENA DIRECTION):** grand hotel lobby, evening check-in
surge. Deep crimson lacquered walls in a brass seam grid;
a gold-leaf stepped COVE CROWN as the ceiling identity
(skylight vocabulary is demoted to chandelier backdrop
only); leopard carpet field — a quiet two-value mottle with
rosettes — bordered in wood; a marble-topped
circle-pattern hero desk with a service bell and malachite
lamps; brass luggage carts; palms. Anchor: Lacquer Face
#732032 with Gold Leaf Bright #C89A32. The Coatroom was
velvet-dark, the garage hard-lit gray; the Bell Desk is
CRIMSON AND GOLD.

## Palette (v2 — Faena direction)

Ships as `art/palettes/belldesk-env.gpl`. Hexes below are
that file, verbatim.

| Family | Swatches |
|---|---|
| Lacquer (walls) | Void `#2A0A12`, Deep `#40101C`, Dark `#581826`, Face `#732032`, Sheen `#8E2A3C` (sparse — panel highlights) |
| Brass (seam grid, fittings) | Shadow `#4A3010`, Mid `#7A5518`, Bright `#B08428`, Glint `#E0B858` (sparse) |
| Gold leaf (cove crown) | Shadow `#6E4A14`, Mid `#9C6E1E`, Bright `#C89A32`, Mottle Light `#EFC963` |
| Cove glow | Strip `#FFE9A8`, Core `#FFF7DC` (sparse px) |
| Carpet (leopard) | Base Dark `#6E4A26`, Base Tan `#8E6432`, Mottle Light `#A87E44`, Rosette Dark `#38200F`, Border Red `#7A1622` (deep, non-semantic) |
| Wood (border, panelling) | Dark `#2E1A10`, Mid `#4A2E1A`, Light `#6B4426` |
| Marble (desk top / standable) | Light `#D8D2C6`, Shade `#A89E8E` |
| Accents | Malachite Green `#1E4038` (lamp bases, desk top accent), Palm Silhouette `#1C2418`, Outline Cool `#101828` |

## 0. Step zero, as ever

Request the Bell Desk tile-role inventory from Claude Code
(roles, gids, placements, double-faced mezzanine strips,
unused slots) — the map is 4 screens with desk run, cart
platforms, two mezzanine tiers, and the bell-cart return
zone. Draw to the inventory, not the memory.

## 1. Tileset (belldesk skin)

- **Lobby floor:** LEOPARD carpet, 4–6 tile sequence period
  (the SotN lesson) — a quiet two-value mottle (Carpet Base
  Dark/Tan with Mottle Light) carrying rosettes in Rosette
  Dark, bordered in wood where the field ends. The border's
  red is Carpet Border Red #7A1622, deep and NON-SEMANTIC;
  alert-red #EA5151 stays semantic and appears nowhere in
  the environment. Two breakers: a brass floor medallion, a
  worn patch. The carpet runs UNBROKEN under the hero desk —
  the marble-border role was retired by handoff 2026-08-14-c
  (an orphaned apron spec; the references seat the desk
  directly on the leopard).
- **Mezzanine strips (ruled, handoff 2026-08-14-b):** reskin
  to Faena formal, NOT carpet. Double-faced: walk top in
  MARBLE LIGHT carrying the standable edge — the same marble
  as the desk top, because "bright marble = stand here" is
  this level's promise — then a lacquer face band, and a
  brass drip line on the coffered soffit underside. Leopard
  stays FLOOR-ONLY.
- **The front desk hero block** (counter precedent): 2-high
  and **9 wide, drawn BESPOKE** — the map's counter block is
  9×2 and the human ruled 2026-08-14 that it gets one
  unbroken 144×32 picture rather than a repeating period
  (art/belldesk-inventory.md §(a), sheet indices 28–36 top
  and 37–45 face). A circle-pattern face in wood and brass,
  marble top with the standable edge, a service bell glint
  (2px gold), malachite lamps, room-key cubbies suggested.
  The Coatroom counter was the set piece; this desk outranks
  it — it is the level's name.
- **Cart platforms:** brass luggage-cart tiles (frame + red
  velvet deck) where the blockout uses them as surfaces.
- **Dressing:** COLUMNS CUT (2026-08-17). A single 16×32
  potted palm (Palm Silhouette — the sheet's only other green
  is the desk's malachite), placed as a matched pair flanking
  the hero desk. SCONCES ARE NOT TILES (2026-08-25) — see §2.
  The elevator door is likewise parallax art, not a tile.

## 2. Parallax (four layers, Coatroom depth grammar)

| Layer | Content | Size | Palette center |
|---|---|---|---|
| P4 | upper crimson wall + the gold-leaf stepped COVE CROWN running its full length — the ceiling identity, unbroken (dusk windows DELETED) | 480×270 static | lacquer darks + gold leaf, cove glow (sparse) |
| P3 | the chandelier tier — one grand chandelier (crystals as a separate `glow.png` overlay for the pulse — see the note below) against the brass wall-grid mid-band | 960×270 | lacquer deeps, brass seams, brass glints |
| P2 | mezzanine rail + the curved-stair hero passage + the revolving-door glow (appears once per ~1.5 screens) | 1280×270 | lacquer mids, brass rail, one warm door-glow |
| P1 | near dressing: luggage cart silhouettes, brass stanchion line, palm silhouettes | 1600×270 | fullest range, ceilinged below play-plane brightness |

Seam and value rules per ART-02 §2 verbatim. The cove glow
in P4 is the one hot passage allowed in the far field — it
reads as gilding catching light, not as competition.

**The chandelier pulse overlay** (`glow.png`, wired 2026-08-24).
Draw it at **960×270 — the same canvas as P3** — and it
becomes a P3-ALIGNED overlay: it scrolls at P3's factor
(0.2, including the ±1px sway) and draws IN FRONT of P3, so
the bloom travels with the fixture it belongs to. A 480×270
glow instead keeps the old Coatroom behaviour: a
screen-fixed wash behind P3, for light with no source in
frame. The canvas size is the only switch — there is no flag.

It composites ADDITIVELY, so draw only the light: hot
crystal points and a soft halo, everything else black or
transparent (both vanish). Its alpha breathes between
`glowMin` and `glowMax` every `glowPeriodMs` — all three on
the `` ` `` panel, currently 0.30–0.48 at 2200ms, with the
Coatroom PINNED to its own original values.

The WHOLE image shares that one rhythm, which is why the
sconces ride it too (below): one dimmer for the room. Note
the `fg` tile layer has an independent pulse, but it is a
TILE layer — usable for light on play-plane geometry (the
garage's sodium pools sit on its floor), never for anything
that must hang on a parallax wall.

Alignment is a draw-time matter: the overlay has no anchor
to the chandelier, it lines up because it was drawn at the
same coordinates on the same-size canvas. Practical
workflow: copy belldesk-p3.aseprite, delete everything
except the light, export as glow.png.

**WALL FIXTURES BELONG IN THE PARALLAX** (ruling 2026-08-25).
The tile layers (bg1/bg2/main/fg) are the PLAY PLANE and
scroll 1:1 with the camera; the wall is parallax at
0.2–0.45. A sconce tiled on bg1 therefore slides 264px off
the P2 wall — 384px off the P3 wall — within ONE SCREEN of
walking, and 1152px across the level. No drawing fixes that:
the fixture and its wall are on different planes. The twelve
bg1 sconce placements are removed and sheet cell 24 is free.

So the SCONCES ARE DRAWN INTO P3, where the brass wall-grid
mid-band already lives, and their light goes into
`glow.png`. That buys three things for nothing: they scroll
with the wall exactly (same layer), their bloom is already
p3-aligned and additive, and they inherit the pulse. The one
cost is that they share the chandelier's rhythm — one dimmer
for the room, which a lobby can carry. A separate rhythm
would need a second overlay layer.

If a LIGHT FIXTURE on the play plane is ever wanted, the fix
is to re-anchor rather than redraw: pendants hung from the
mezzanine undersides, or lamps on the desk. Those work as
tiles because the mezzanine and desk are play-plane geometry
— nothing drifts, because everything moves together.

**The gold-leaf stepped COVE CROWN** — P4's ceiling
identity, speced 2026-08-24. A cornice where the ceiling
steps up and back in tiers with the light source hidden in
the recess: no fixture is ever visible, only graded bands of
gilding getting hotter toward the concealed strip. That is
what makes it an identity rather than a lamp — a line of
light the length of the room — and why the skylight was
demoted. Side-on, it reduces to horizontal rows: brightest
at the top where the strip sits, darkening downward as each
tier falls further from the source.

VERTICAL BUDGET (measured, not guessed). The HUD owns
y0–y30: hangers y5, timer and score y6, multiplier y19, tag
counter centred y24. The first mezzanine is at y96, where
marble takes over. So the crown gets **y31–y50**, and
anything bright above y30 fights the score text.

RAMP, top-down: Gold Leaf Shadow top lip (the crown's own
shadow sells the overhang) → Cove Glow Strip with ONE row of
Core as the concealed source → Mottle Light on the hot inner
face → three tiers, each a Bright lit edge over a Mid face
over a self-shadowed underside, dimming with distance from
the source → a Shadow-to-Lacquer row where the crown dies
into the wall.

SEAM: every parallax layer is a tileSprite, so a 480-wide P4
still WRAPS — at factor 0.05 its offset runs 0→72px across
the level. Keep the tiers perfectly horizontal and constant
and this costs nothing; a real cove is constant anyway. Any
repeating motif wants a period that divides 480 (24px works:
20 repeats). NOTE: P4 currently fails this in nine rows
(232–240, lower-wall detail), which is a separate fix.

BREAKING THE RUN. Horizontal rows alone read as a striped
RIBBON, not a stepped cove — proven by mock, not argued.
Two devices, both drawn and shot in-engine:

- A RETURN is where the cornice turns a corner and comes
  back toward the wall: each tier runs DOWN a ~5px-wide
  vertical, showing its profile end, so the band breaks into
  bays. Architecturally the honest device.
- A BRACKET (corbel) is a small tapered console hanging
  BELOW the band every so often, reading as if it holds the
  cornice up. ~5px wide, ~7px tall, tapering downward,
  Bright lit edge / Mid body / Shadow underside.

RULING FROM THE COMPARISON: brackets do more work at this
size. A return needs depth to read as a turn and 2D side-on
gives none, so it lands as a vertical post; a bracket breaks
the band's SILHOUETTE, and a silhouette break survives the
squint that an interior line does not. Suggested start:
brackets every 48px, plus sparse returns every 96–128px to
mark bays. Both periods divide 480, so the wrap stays
honest.

All four treatments compared side by side, with the
row-by-row values and the constraints:
https://claude.ai/code/artifact/98021083-7b63-4992-a11b-9db16ad8ea36

## 3. Order & effort

1. Inventory + palette (free — belldesk-env.gpl ships with
   this brief).
2. Floor sequence + mezzanine strips + desk hero block
   (1–1.5 sessions) → skin drop transforms the level.
3. P4 + P3 (1 session — cove crown, wall grid, chandelier).
4. P2 + P1 (1 session).
5. Sconce flicker pair + chandelier pulse overlay
   (half session, deferrable).
Total ~3.5–4 sessions. After step 2 the Bell Desk stops
wearing the Coatroom's placeholder bones.

## Appendix — concept prompts (fresh generations, wide/
panoramic, no people, no readable text)

P4: "The upper wall of a grand crimson hotel lobby — deep
lacquered red panels divided by thin brass seams, crowned
by a stepped gold-leaf cove molding running the full width
and glowing softly from within, no windows, opulent and
still, flat stylized color planes, wide panoramic
composition"

P3: "The upper reaches of a grand crimson hotel lobby — one
ornate chandelier glowing warmly against a wall of deep red
lacquer in a brass grid, small warm gold lights, rich reds
and antique brass, flat stylized shapes, wide panoramic
composition"

P2: "Grand crimson hotel lobby architecture — a mezzanine
rail in brass, a sweeping curved staircase as the hero
passage, a warm glowing revolving door entrance at one
side, deep lacquered red with one warm glow, flat stylized
color planes, wide panoramic composition"

P1: "Close dressing of a grand hotel bell desk area — brass
luggage carts in silhouette, a line of brass stanchions
with velvet rope, tall potted palms in shadow, deep crimson
and antique brass, flat stylized color planes, wide
panoramic composition"
