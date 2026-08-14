# Garage inventories — BRIEF-ART-04 step 0

Produced per handoff 2026-08-10-a (revised). Round 4 froze the
collision geometry (handoff 2026-08-09-i).

**AMENDED 2026-08-13 (human ruling): for CARS the relation inverts —
the drawn silhouette IS the collision rect.** A tier's art defines its
body; the numbers below track the art. Two rules keep that safe: the
TOP row of ink must be the roof (nothing — mirror, antenna, aerial —
may sit above it, or players would stand on air) and the BOTTOM row
must be the wheel contact. Height changes move the parked bottoms and
the deck-clearance facts, so flag one when you draw it; width changes
are free. Sedan came in 44 wide (specced 40), SUV 48 (specced 44), lux 60
(specced 56) — all three +4, all heights exactly as ratified. The
field's tightest gaps absorbed them (ground 66px, deck 22px) and the
instruments re-verified green after each drop.

**ROOF INSET (human ruling 2026-08-13):** a drawn car's top is not
flat — the roof runs level for about half the length, then the hood
RAMPS to the nose (sedan 6px of drop, SUV 7px). One AABB cannot follow
a ramp, and splitting the car into several rects would put hop-over
lips mid-roof on surfaces players RUN across (Arcade has no step-up),
so the single rect stays and its top drops `CAR_TOP_INSET` = 2px:
the roof reads as a 2px sink (invisible against a 2px roof line) and
the nose float halves. Measured ramps: sedan 6px over 17 columns, SUV
7px over 18, LUX 8px over 29 (the steepest — its flat cabin is only
27% of its length, so it still floats ~6px at the very tip). If that
reads badly in play the fix is a PER-TIER inset table (lux 3, others
2), not a deeper inset for every car. The wheel line — the body BOTTOM — never moves,
so parked bottoms stay 240 / 192. Roof lines and deck headroom in the
table above are post-inset (headroom only grew). Arted tiers only;
placeholder rects are flat and need no correction.

## (a) Car-body dimensions per silhouette tier

| Tier | Texture key | Collision rect (w×h) | Roof y, ground-parked | Roof y, deck-parked | Headroom above roof under a deck |
|------|-------------|----------------------|-----------------------|---------------------|----------------------------------|
| Sedan | `car-sedan` | **44×14** art, body 44×12 | 228 | 180 | 20px |
| SUV | `car-suv` | **48×18** art, body 48×16 | 224 | 176 | 16px |
| Luxury | `car-lux` | **60×16** art, body 60×14 | 226 | 178 | 18px |

Facts the drawings must respect:

- **The collision body is the full sprite rect** (no inset), origin
  center. The roof line = the physics top EXACTLY — players platform
  on it (Chexy's rule mirrored). Wheels/trim may overhang the SIDES
  by ~2px each; the bottom edge is the ground-contact line (parked
  bottoms sit at y 240 on the ground, y 192 on row-12 decks) — no
  visual overhang below.
- Suggested canvas per tier: collision width + 4, collision height
  exact. (Sedan 44×14, SUV 48×18, Lux 60×16.)
- **Deck clearance:** both parking stacks have exactly 32px of air —
  ground (240) up to the row-12 underside (208), and row-12 top
  (192) up to the row-9 underside (160). Chexy's body is 32×32:
  passes under decks with zero headroom, can never stand on an
  under-deck car roof (max 18px available). Car silhouettes must
  stay inside their collision height or the under-deck read lies.
- **One drawn state per car** (BRIEF-ART-04 §1). Requested glow,
  target highlight, chip, and safe-flash are all code-side overlays.
- **Chip anchor, current code:** the windshield chip rides at
  roughly x + width/4, y − height/6 from the car center (top-third,
  right/windshield side) — the stun re-apply tween targets exactly
  that point. Document the final per-tier anchor with the drawings
  and the code will match it (this also retires the luggage chip-
  anchor debt if noted in the same sitting).
- Drive-off is code motion (slide + fade, body disabled) — no art.
  Wheel spin is optional polish, last on the list (§1).

## (b) Garage tile-role inventory (Chunk-1 precedent)

Tileset: the embedded `placeholder` registry — 16×16, 8 columns × 3
rows = 24 slots, shared naming with the Coatroom (assets/maps/README
"Tileset" section). Garage usage as shipped in the ratified map:

| gid | Role in the garage | Uses | Placement |
|-----|--------------------|------|-----------|
| 1 | Ground — surface + fill | 1128 | rows 15–16, full width (564 cols). Skin: oil-stained concrete, 4–6 tile period + 2 breaker tiles (§3) |
| 2 | Deck strip — MIDDLE, double-faced | 268 | rows 9 and 12; 1-tile-thick, top walked AND underside visible (Bell Desk mezzanine precedent) |
| 6 | Deck strip — LEFT CAP | 26 | every strip laid `6 [2 …] 7` |
| 7 | Deck strip — RIGHT CAP | 26 | ditto |
| 5 | bg2 far dressing (non-colliding) | 253 | bg2 layer; garage role: support pillars / far dressing |
| 3 | UNUSED here (Coatroom counter block) | 0 | free for garage use |
| 4 | UNUSED here (bg1 near dressing) | 0 | bg1 layer is empty and available |
| 8 | spare | 0 | free |
| 9–24 | reserved rows 2–3, ALL unused | 0 | the expansion space: ground breakers (oil stain, painted bay number), sodium lamp-pool overlays, ramp/edge caps, wall verticals |

Layer stack: bg2 (depth −4, in use) · bg1 (−3, empty) · main (−2,
collision) · fg (+8, empty — the natural slot for lamp-pool overlay
tiles, the Coatroom light-pool trick).

Deck placements, for reference while texturing: twelve row-12 decks,
14 tiles wide, starting at column 18 + 46k; fourteen row-9 runs, 12
wide at 28 + 46k, except the two dash-gap modules where 8-wide runs
flank a 7-tile (112px) gap — gaps at columns 220–226 (x 3520–3632)
and 450–456 (x 7200–7312). Caps on every end per the 6/2/7 rule;
no run shorter than 2 tiles exists.

### UPDATE 2026-08-13 — skins changed what this section demands

Tile SKINS are now ratified project-wide (handoff 2026-08-12-a), so
**the garage sheet does NOT have to match the gid roles above.** Lay
it out however is natural to draw — the skin table translates roles →
your indices, exactly as the coatroom sheet does. Two consequences
worth having while drawing:

- **Ground can be two different tiles.** Skin functions receive
  `(x, y)`, and the garage floor is two rows: row 15 is the walked
  SURFACE, row 16 is fill beneath it. Draw a surface period (4–6
  tiles) *and* a separate sub-floor tile if you want them to differ,
  plus the two breakers (oil stain, painted bay number).
- **Deck strips are DOUBLE-FACED.** They are one tile thick, so a
  single 16×16 must read as both the walked top and the visible
  underside — Chexy passes beneath with exactly 32px of clearance.
  Minimum three tiles (left cap / middle / right cap); two alternating
  middles is the coatroom precedent and reads better across 14-wide
  decks.

**Sheet format:** 16×16 tiles, 8 columns × 3 rows = **24 slots**
(image 128×48), same as coatroom-tiles2. That ceiling is the garage
map's declared tileset, not a hard limit — if the sheet wants more
than 24, say so and the map's tileset declaration widens (a data
edit, no geometry touched).

**Shipped geometry to texture against** (re-derived from the map):
ground rows 15–16 across all 564 columns; twelve row-12 decks, every
one 14 tiles wide, at column 18 + 46k; fourteen row-9 runs, 12 wide
at 28 + 46k, except the two dash-gap modules where 8-wide runs flank
a 7-tile (112px) gap — the showcase gaps at columns 220–226 and
450–456. bg2 carries 253 dressing tiles (pillars/far dressing);
**bg1 and fg are empty and available** — fg renders in front of play,
the natural home for sodium lamp-pool overlays.

**Rough counts:** ~11 tiles is a viable sheet (4 floor + 1 fill + 2
breakers + 3 deck + 1 pillar); 16–20 is comfortable inside 24.

**Wiring note (agent-side, when tiles drop):** the skin's `texture`
field already selects a per-level sheet, so dropping
`assets/tiles/garage.png` plus a skin entry also retires the debt
where the garage borrows the coatroom's tileset. Tell me the sheet's
layout in a sentence (as with the coatroom) and the skin lands with
the drop.

## (c) Car drawing kit + palette-swap contract

Answers the artist's pre-drawing questions (2026-08-13). Field counts
are from the frozen round-4 map: **69 cars — 45 sedan, 14 SUV, 10
luxury** (2 of the luxes park on decks; 8 standard cars do too — same
art either way).

### What to draw: three canvases, one frame each

| Source | Collision rect | Canvas | Role |
|--------|----------------|--------|------|
| `art/aseprite/car-sedan.aseprite` | 44×14 — DRAWN, shipped | 44×14 | the workhorse, 45 in the field; standard tap |
| `art/aseprite/car-suv.aseprite` | 48×18 — DRAWN, shipped | 48×18 | taller silhouette, 14 in the field; standard tap |
| `art/aseprite/car-lux.aseprite` | 60×16 — DRAWN, shipped | 60×16 | 10 in the field; the TIER-3 HOLD car — must read "this one costs you time" at a squint |

- **Nose points RIGHT.** Cars drive off rightward (code tweens +340px)
  and the level scrolls right; no flipping happens.
- **The roof line must equal the physics top EXACTLY** — players
  platform on it. Wheels/mirrors/trim may overhang the SIDES by ~2px
  each (that's the canvas slack); nothing may overhang below the
  bottom contact line.
- **One drawn state per car.** Requested glow, target highlight, tag
  chip, and the safe-at-edge flash are all code overlays — do not draw
  state variants.
- **Wheels are static.** A 2-frame drive-off spin is optional polish,
  last on the list.
- Note the **chip anchor** per tier when you deliver. Code currently
  places it at (center x + width/4, center y − height/6) — top-third,
  windshield side; the code will match whatever you document.

### Palette swap: exactly two swappable colors

Draw the body with these two entries from `actors.gpl` and nothing
else — they are the ONLY colors the swap touches:

| Slot | Color | RGB |
|------|-------|-----|
| body base | Coat Cobalt | 46, 111, 208 |
| body shadow | Cobalt Shade | 30, 76, 150 |

The export pass swaps that pair through the six garment hues —
crimson, cobalt, olive, mustard, burgundy, winter teal — producing 6
variants per drawing (18 visible cars from 3 drawings). Mechanism:
save **indexed** (Sprite → Color Mode → Indexed) and the script
re-palettes via Aseprite's own `--palette` flag; no new tooling.
Two rules make the swap reliable: use no anti-aliasing or dithering
that invents in-between body colors, and keep the body to those two
values only.

### Fixed colors (never swapped) — the rest of the kit

| Part | Color | RGB | From |
|------|-------|-----|------|
| outline | Outline Cool | 16, 24, 40 | actors (the garage is cold-lit) |
| glass | Night Window Cool | 62, 90, 128 | garage-env |
| glass glint | Signage Glow Core | 169, 184, 245 | garage-env |
| tires | Concrete Void | 21, 23, 28 | garage-env |
| hub / tread detail | Concrete Deep | 35, 38, 46 | garage-env |
| chrome / bumper | Metal Mid | 102, 112, 133 | actors |
| bright chrome | Concrete Highlight | 154, 161, 172 | garage-env |
| LUX trim + hood ornament | Hanger Gold / Shade | 255, 210, 74 / 201, 154, 31 | actors |
| head/tail lamps | Sodium Core | 240, 162, 74 | garage-env (ties to the lamp pools) |
| specular glint | Pure White | 255, 255, 255 | actors |

**Never** use Raffle Red (192, 24, 24) or Raffle Red Deep on a car —
that accent is the elite enemy's identity and stays exclusive to it.
Also off-limits per BRIEF-ART-04 §1: ChexApp tag colors (the chip
carries category), enemy paper tones, and Chexy orange.

### Shipped 2026-08-13 (sedan drop)

- `scripts/export-sprites.sh` gained a CARS pass: it exports each drawn
  tier flat/indexed, then runs `scripts/palette-variants.mjs`, which
  rewrites ONLY the PNG's PLTE chunk to emit the six hue variants
  (pixels never touched, no dependencies). Undrawn tiers are skipped.
- Boot loads every `assets/sprites/car-*.png`; the garage rotates a
  tier's variants per car and takes the HUD request-chip color from the
  drawn hue, so the chip still matches the car you're hunting.
- Tint retires per tier as its art lands (multiplying over real art
  would muddy glass, tires, and chrome). SUV and lux keep interim rects
  until drawn — mixed states are fine.
- The collision body is the texture's own size, i.e. the drawing.


## (d) Sodium lamp pools — the `fg` layer

Asked 2026-08-14: what goes in the fg image, what's it called, how big?

**There is no fg image.** `fg` is one of the map's four TILE layers
(bg2 · bg1 · main · fg), so the pools are more tiles in the sheet you
already have — `art/aseprite/garage-tile.aseprite` →
`assets/tiles/garage.png`. Nothing new to name. The fg layer renders
at depth **+8**, i.e. IN FRONT of Chexy, the cars and the decks, which
is exactly what a cast light should do.

Note this would be the FIRST use of fg anywhere in the game — every
map's fg layer is currently empty, so the "Coatroom light-pool trick"
BRIEF-ART-04 §3 refers to was an aspiration, never built. The garage
sets the precedent.

### Free slots (nine of the sheet's 24)

| gid | sheet position | gid | sheet position |
|-----|----------------|-----|----------------|
| 7 | (96, 0) | 20 | (48, 32) |
| 8 | (112, 0) | 21 | (64, 32) |
| 15 | (96, 16) | 22 | (80, 32) |
| 16 | (112, 16) | 23 | (96, 32) |
| | | 24 | (112, 32) |

### Dimensions and composition

16×16 like every tile — a pool is COMPOSED from a run, not drawn as
one big sprite. Suggested set of three (plus one optional):

- **pool-left** — the falloff edge, dark at the outer side
- **pool-core** — the bright middle; repeats to widen a pool
- **pool-right** — mirrored falloff
- *optional* **pool-hot** — a brighter core variant for the tile
  directly under a fixture

That gives pools of 48px, 64px, 80px… by repeating the core. A
separate **lamp fixture** tile (Fixture Cool Black in the palette)
would belong on `main` or `bg1`, not fg — the fixture is an object,
the pool is its light.

### The one real constraint: draw the light on BLACK, not on alpha

The sheet exports INDEXED, and Aseprite's indexed mode carries only a
single fully-transparent index — so a soft, semi-transparent glow
cannot be authored in the current path, and an opaque pool at depth +8
would paint over Chexy's feet instead of lighting them.

So: **the fg layer gets ADDITIVE blend, code-side** (one call, the
same trick the coatroom's glow overlay uses). Under additive, black
contributes nothing and warm pixels brighten whatever is beneath —
including Chexy when she walks through the pool. Practically:

- Draw the pool's falloff as a **dark→warm dithered gradient**. Dither
  is the softness; additive turns the dark end into nothing.
- Outer areas can be black OR transparent — both vanish under
  additive. Black is easier to judge while drawing.
- Palette: the sodium ramp — Sodium Ember → Mid → Bright → Core →
  Hotspot (sparse). Blue signage tones stay out of the pools.

### Placement is agent-side

The fg layer is empty and the garage map is generator-owned, so tile
PLACEMENT is not the artist's job. Physically the lamps hang from deck
undersides, so pools want to fall on the ground beneath row-12 decks
and on row-12 deck tops beneath the row-9 runs. Say the rhythm you
want (one pool per parking module, one per second pillar, …) or leave
it and a proposal comes back with the drop.

**Shipped 2026-08-14 (proposal, adjustable):** 24 pools on the
walkable ground row every 23 columns — one per parking module, roughly
1.5 pools per screen — plus 12 on row-12 deck tops wherever the deck
is solid under all three tiles. 36 pools, 108 tiles.

**First-look note:** the falloff tiles (20/22) read exactly right —
warm orange dither over the concrete. The hotspot in tile 21 clips:
(255,217,160) added to the ~(150,150,155) floor saturates every
channel, so the core reads as a white checkerboard instead of a hot
centre. SCREEN blend and ADD at 60% alpha were both tried and land
within a shade of plain ADD — a bright floor blows out under any
lightening — so this one is an art call, not a code one. Either dim
the hotspot (something nearer Sodium Bright than white) or thin the
dither in the core so it gradients instead of checkers. The pools over
DARK pixels need no change, so a hotspot that looks weak on black is
probably correct on the floor.

**Shipped 2026-08-14:** the **flicker** is in — the fg layer's alpha
rides a 4200ms breath plus a 700ms ripple between `fgFlickerMin` 0.78
and `fgFlickerMax` 1.0. Tune all four values (or switch it off) from
the `` ` `` panel; nothing about it needs art. **And the fix for the clipping is code-side after all.** The pools were
never really an art problem — additive light can only brighten what has
headroom, and this floor is light grey, so any warm value clips to
white however it's drawn. The room now dims to meet them:
`TUNING.fgAmbient` (0.7, panel slider) is a MULTIPLY scrim under the fg
layer. At 0.7 the tiles as drawn read as warm orange dither with the
room fully legible; below ~0.6 the cars and elites stop reading, so
that's a gameplay floor. Nothing about the pool tiles needs redrawing —
if anything the hotspot is now free to go BRIGHTER.
