# BRIEF-ART-05 — THE MUSEUM: Items & Environment

**For:** Art track. (First draft 2026-08-13 — the number was
reserved when ART-04/06/07 jumped the queue; this retires the
debt.)
**Read first:** BRIEF-06 (as closed — rolling items, brake-on-
tag, hand-owned map), BRIEF-ART-03 §0 (item rules), the skin
convention, BRIEF-ART-02 §0 — WITH THE INVERSION BELOW.
**Mood:** museum lobby, family day, DAYLIGHT. Anchor: Accent
Teal Green #386E6F, marble values, skylight sun. The game's
one bright level.

## 0. The readability inversion (this brief's law)

Every prior level is dark-world/bright-actors. The Museum
flips the value field, not the principle: backgrounds sit
LIGHTER and lower-contrast than gameplay; actors read as
SATURATED-AND-DARKER shapes on pale marble. The squint test
is unchanged — Chexy first, items second, world receding —
only the polarity flips. Concretely: environment lives in
the palette's pale top half; items/enemies keep their
existing saturated colors (they already pop on light — the
paper thieves' manila will need their outline weight doing
more work; check the composite early). Dithering allowed on
the skylight gradient only.

## 1. Item sprites (the moving-target set — currently rects)

- **Strollers (24×20, the movers):** 2–3 garment-hue frame
  bodies (actors.gpl), dark wheels. One drawn state + a
  2-frame wheel-roll loop played WHILE ROLLING (motion
  legibility for the game's only mover — the wheels are the
  tell) — brake state is the existing chip + a code tilt-
  settle, no extra drawing. Canopy silhouette variance per
  hue variant.
- **Kid backpacks (16×16):** 2 silhouettes (round, square-
  flap), garment hues, one state; the bounce is physics.
- Coats already shipped (BRIEF-06); chip anchors for the
  two new classes documented on export, per convention.

## 2. Tileset (museum skin)

Inventory request first, as ever. Expected roles:
- **Gallery floor:** pale marble sequence, 4–6 period —
  large quiet slabs, thin dark joint lines, one inlay
  breaker (teal geometric medallion) + one worn breaker.
- **Mezzanine strips:** double-faced — marble walk top with
  the standable light edge (here the edge reads as a JOINT
  SHADOW under a bright lip — the light-edge grammar
  inverted to survive a pale field), coffered pale soffit.
- **Exhibit pedestals** (the platform vocabulary): stone
  blocks with teal placard pixels; whatever sits ON them is
  abstract suggestion only — geometric sculpture shapes, no
  reproductions of real artworks.
- **Dressing:** benches (dark wood — welcome contrast),
  stanchion pair (the museum's velvet rope is TEAL),
  drinking fountain, banner tiles (teal field, abstract
  glyph, no text).

## 3. Parallax (three layers — interior-shallow like the
garage)

| Layer | Content | Size |
|---|---|---|
| P3 | far gallery wall: large pale wall field, big abstract
framed shapes (color-block "paintings" in muted garment
hues), skylight glow wash from above | 480×270 static |
| P2 | arch rank + column line in pale stone, banner drops | 1280×270 |
| P1 | near dressing: pedestal silhouettes, teal rope line,
a potted fig, "GALLERY →" glyph smear | 1600×270 |

Skylight is the mood engine: a soft top-down daylight
gradient on P3 (the one dithering license), warm-white core
cooling toward the walls. No glow-pulse overlay — daylight
is steady; the museum's autonomous motion is a code-side
dust-mote drift if we want one (log as optional polish).

## 4. Order & effort

1. Inventory + palette (museum-env.gpl ships with this
   brief) (free).
2. Strollers + backpacks + wheel loop (1 session) — the
   moving-target readability is the headline; the level is
   CLOSED and certified on rects, so this is pure upgrade.
3. Floor + mezzanine + pedestals skin (1 session).
4. P3 → P1 (1–1.5 sessions).
Total ~3–3.5 sessions. The inversion (§0) is the only new
craft problem; everything else is technique you've shipped
twice.

## Appendix — concept prompts (wide, no people, no text)

P3: "The far wall of a bright modern museum gallery lobby —
pale marble wall with large abstract color-block paintings
in muted tones, soft daylight washing down from a skylight
above, serene and airy, flat stylized color planes, wide
panoramic composition"

P2: "A rank of pale stone arches and columns in a bright
museum interior, tall teal banners hanging, soft daylight,
flat stylized shapes, airy and calm, wide panoramic
composition"

P1: "Close dressing of a museum gallery — stone pedestal
silhouettes, a teal velvet rope line on brass stanchions,
a potted fig tree, one subtle wayfinding glyph glow, pale
stone with small teal and brass accents, flat stylized
color planes, wide panoramic composition"
