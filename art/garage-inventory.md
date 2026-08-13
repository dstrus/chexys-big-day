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
are free. Sedan came in 44 wide (specced 40) and SUV 48 (specced 44);
the field's tightest gaps absorbed both (ground 68px, deck 22px) and
the instruments re-verified green each time.

**ROOF INSET (human ruling 2026-08-13):** a drawn car's top is not
flat — the roof runs level for about half the length, then the hood
RAMPS to the nose (sedan 6px of drop, SUV 7px). One AABB cannot follow
a ramp, and splitting the car into several rects would put hop-over
lips mid-roof on surfaces players RUN across (Arcade has no step-up),
so the single rect stays and its top drops `CAR_TOP_INSET` = 2px:
the roof reads as a 2px sink (invisible against a 2px roof line) and
the nose float halves. The wheel line — the body BOTTOM — never moves,
so parked bottoms stay 240 / 192. Roof lines and deck headroom in the
table above are post-inset (headroom only grew). Arted tiers only;
placeholder rects are flat and need no correction.

## (a) Car-body dimensions per silhouette tier

| Tier | Texture key | Collision rect (w×h) | Roof y, ground-parked | Roof y, deck-parked | Headroom above roof under a deck |
|------|-------------|----------------------|-----------------------|---------------------|----------------------------------|
| Sedan | `car-sedan` | **44×14** art, body 44×12 | 228 | 180 | 20px |
| SUV | `car-suv` | **48×18** art, body 48×16 | 224 | 176 | 16px |
| Luxury | `car-lux` | 56×16 | 224 | 176 | 16px |

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

**Wiring note (agent-side, when tiles drop):** all maps currently
share one drop-in image (`assets/tiles/coatroom.png`); the garage
tileset (garage-tiles.aseprite → its own strip) needs the loader to
key the tileset image per map. That's on the wiring contract
(BRIEF-ART-04 §6), not the artist.

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
| `art/aseprite/car-lux.aseprite` | 56×16 | 60×16 | 10 in the field; the TIER-3 HOLD car — must read "this one costs you time" at a squint |

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
