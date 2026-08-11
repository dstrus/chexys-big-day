# BRIEF-ART-04 — THE GARAGE: Cars, Elite V3, Environment

**For:** Art track (human in Aseprite; agent wiring noted)
**Read first:** BRIEF-05 (as amended through handoff
2026-08-09-i), BRIEF-ART-02 §0 (readability rules — they apply
verbatim), BRIEF-ART-03 §0/§2, art/palette-brand.md.
**Prereq:** none — the garage is playable on rects; every
deliverable here is a drop-in.

**Mood (BRIEF-05):** night-shift parking structure. Concrete
grays, warm sodium lamp pools, Action Blue #1528A6 signage
glow. The Coatroom was velvet-dark; the garage is hard-lit
gray — colder bones, warmer pools.

## 0. Before drawing: the dimensions inventory

Ask Claude Code for the car-body inventory first (the tile-
inventory precedent): exact collision rect sizes per silhouette
tier (sedan / SUV / luxury), roof-standing surface height, and
the deck clearance above parked cars. Car sprites must match
the RATIFIED collision field — round 4 froze the geometry;
art conforms to it, not the reverse. Expect roughly: sedan
shortest, luxury longest, roofs flat enough to read standable.

## 1. Cars (the headline — currently tinted rects in a
ratified level)

- **Three silhouette tiers,** lengths per the inventory.
  Canvas per tier sized to the collision rect + small visual
  overhang allowance (mirrors Chexy's rule: wheels/trim may
  overhang; the standable roof line must match the physics
  top EXACTLY — players platform on it).
- **Bodies in the garment-hue family** (actors.gpl v2:
  crimson, cobalt, olive, mustard, burgundy, winter teal) —
  NEVER ChexApp tag colors (the -b law; the chip carries
  category color), never enemy paper tones, never bright
  Chexy orange. 2–3 hue variants per tier via palette swap
  (draw once per tier, swap script per the -d palette-swap
  precedent) = 6–9 visible cars from 3 drawings.
- **Luxury reads as luxury:** longer, lower, a chrome/trim
  accent line, maybe a hood ornament pixel — the hold-tier
  promise visible at a squint.
- **One drawn state per car.** Requested glow, target
  highlight (additive overlay per the -09 finding), chip,
  safe-flash — ALL code-side overlays. Do not draw state
  variants. Document the chip anchor per tier (top-third,
  windshield side) — this also retires the standing chip-
  anchor debt for luggage if done in the same sitting.
- **Wheels:** static. No rolling animation in v1 — cars are
  parked scenery until tagged, and drive-off is code motion
  (slide + fade); a 2-frame wheel spin for drive-off is
  OPTIONAL polish, last on the list.

## 2. Elite V3 (retire the red-tinted V1)

Per BRIEF-ART-03's family rules — paper palette, boss-kin —
but the elite must read as the PREDATOR of the family:
- 24×24, left-facing native. Suggested identity: a crisp
  UNCRUMPLED valet-ticket stub (its pristine flatness against
  the swarm's crumple = rank), sharp corners, raffle-red
  diagonal stripe, small angry eyes. Menace over comedy, but
  still silly-adjacent (tone rule §1).
- **Animation set:** move 3f (aggressive dart-glide, faster
  read than the Stub's flutter-bob), rip 2f (the untag grab
  — syncs to initiation), carry 2f (chip held overhead —
  reuse the waddle language), stun 2f. Sprite-local
  registration as ever.
- The ripped-chip flight and re-apply are code-side (the chip
  is the shared 8×8 template).

## 3. Structure tiles (coatroom-tiles sibling:
garage-tiles.aseprite)

Ask for the garage's tile-role inventory (Chunk-1 precedent) —
expect: deck floor + underside (the decks are double-faced
strips like the Bell Desk mezzanines), support pillars
(bg dressing), ground floor sequence (oil-stained concrete,
4–6 tile period per the SotN lesson + 2 breaker tiles: oil
stain, painted bay number), ramp/edge caps, wall verticals
if the blockout uses them.
- Concrete reads via VALUE, not texture — flat gray planes,
  one shadow step, sparse cracks. Sodium lamp pools as
  overlay tiles (the Coatroom light-pool trick, warm
  #C85A12-family).
- Bay-number breakers: painted numerals ON THE FLOOR are
  allowed as shapes (blurred/stylized, no legible text per
  BRIEF-ART-02 rules — EXCEPT simple digits, which are
  permitted here: "2A" energy, they're wayfinding flavor).

## 4. Parallax (lighter than the Coatroom's — the garage is
interior-shallow)

Three layers, not four: P3 far wall (concrete + Action Blue
"EXIT →" glow smears, near-monochrome), P2 pillar rank
(repeating columns, deep gray), P1 near dressing (parked-car
silhouettes in shadow, chain-link, standpipes). City-night
glimpses through P3's opening slots (tiny cool window shapes)
are the one exterior note. Repeat-x rules per BRIEF-ART-02 §2.

## 5. Order & effort

1. Dimensions + tile-role inventories from Claude Code
   (free).
2. Cars, 3 tier drawings + swap variants (1–1.5 sessions) —
   transforms the ratified level immediately.
3. Elite V3 full set (1 session).
4. garage-env.gpl + ground/deck structural tiles (1 session).
5. Parallax P3→P1 (1–1.5 sessions).
6. Optional: wheel-spin polish, extra breakers.
Total ~4–5 sessions. After step 2 the garage stops looking
like a diagram; after step 4 it's a place.

## 6. Wiring contract (agent, after each drop)

Standard drop-ins throughout: car atlases keyed per tier
variant, elite atlas sprite-local, tileset registration + gid
map, parallax loader reusing the Coatroom scroll-factor table
scaled for constant-scroll (parallax scrolls with the camera
as usual — the auto-scroll is just a moving camera). 60fps
re-verify with full car field + parallax is the acceptance,
human hardware per precedent.
