# BRIEF-ART-03 — Items & Enemies (the small actors)

**For:** Art track (human in Aseprite; agent wiring noted)
**Read first:** DESIGN.md §2 (core loop), §2.4 (attention),
§5; art/palette-brand.md (ChexApp tag colors); BOSS-SPEC (stub
particle reuse).
**Scope:** Coatroom needs (coats + ticket enemies) specced
fully; forward notes for later levels so conventions hold.

## 0. Ground rules — the inverse of Chexy's

These sprites are small, numerous, and glanced at, never
studied. Their job is INSTANT recognition at a squint:
- **The TAG is the identity marker, not the item.** ChexApp
  tag colors belong to the physical tags Chexy applies.
  Items themselves come in varied garment/luggage colors.
  On successful tag, a small tag chip (category color) is
  applied to the item sprite — the tagged/untagged state is
  diegetic and readable at a squint. Item colors must: pop
  against the indigo environment (warm/bright mid-tones),
  never use the enemy paper family (white/cream/manila are
  thief-owned), and avoid Chexy-dominant bright orange.
- **Asymmetric fidelity, bottom tier:** 1–2 frames, flat
  planes, minimal shading (one shadow step max), no dithering.
- **Palette:** shared file art/palettes/actors.gpl (generate
  from the tag colors + a small neutral support set) — one
  palette for ALL items and enemies, unlike per-character
  palettes. Items across levels must feel like one family.
- Every sprite passes the silhouette test at 100% zoom against
  BOTH the indigo environment and the tan results panel.

## 1. Items — coats (Coatroom)

- **Canvas 24×24, visual mass ~16–20px.** Physics uses a
  smaller centered body (agent wiring; art just centers mass).
- **Three variants** (long coat, puffy jacket, fancy overcoat)
  — silhouette variety; coats come in assorted garment colors
  (crimson, cobalt, olive, mustard, burgundy — artist's pick
  from actors.gpl v2). Trim/lining may use neutrals and ONE
  dim accent.
- **Tag chip overlay, 8×8, drawn once in a neutral template**
  — code tints it per category color at runtime (one sprite,
  eight colors free). Chip anchor point documented per item
  canvas (top-third, rack-hook side).
- **States (drawn):** just one — the item at rest/in flight.
  All state signaling is code-side (target highlight outline,
  urgency tint, expiry flash) and layers ON TOP of the sprite;
  do not draw per-state variants.
- **Frames:** 1 static + optional 1-frame flutter alt for
  in-flight (deferrable). Items are props, not characters.
- Forward note (L2+): luggage = Tag Teal #006483 base, three
  weight-tier silhouettes (garment bag / roller / trunk) with
  tier dots per BRIEF-03; valet cars and strollers get their
  own one-page addenda when their levels enter production.

## 2. Enemies — paper ticket thieves

The enemy family wears the BOSS's palette, not the items':
paper white/cream/manila + raffle red accents (they are his
minions — visual kinship is the story). This also guarantees
enemies NEVER share a dominant color with any item category —
thief vs. loot is legible at pure color level.

- **Canvas 24×24, visual mass ~18–22px.** Left-facing native,
  same flip convention as Chexy.
- **Two variants for Coatroom** (third can trail):
  V1 "Stub" — crumpled ticket stub with stick limbs and an
  angry little face; the standard thief.
  V2 "Strip" — a fluttering ticket-strip ribbon, more air time
  in its bob; visual variety in swarms.
- **Animation set per variant (small!):**
  | Anim | Frames | Notes |
  |------|--------|-------|
  | move | 3 | flutter-bob loop; this is also idle |
  | grab | 2 | reach + clutch (syncs with gloat beat) |
  | carry | 2 | the encumbered waddle — item held overhead, |
  |      |   | body compressed, effortful; sell the 0.5× |
  | stun | 2 | dizzy wobble, stars optional (rescue feedback) |
  Death/despawn is the shared paper-poof particle — no drawn
  death frames.
- **The stub particle** (BOSS-SPEC deliverable 2, 2–3 tiny
  frames, ~8×8): build it HERE, first — it's rescue feedback
  now and boss fly-off/confetti later. Highest-reuse asset in
  the game.
- Registration: sprite-local anims (target param) per the
  2026-07-30-a policy — enemy tag names (move/grab/carry/stun)
  never touch the global namespace.

## 3. Also in this batch (tiny, unblocks ceremony art)

- **Golden Hanger icon, 12×12, three states** (golden /
  tarnished / broken) — replaces HUD + results placeholders.
- **NFC tag collectible, 12×12, 2-frame glint** — the coin.
  Chexology Orange with a cream chip glyph.

## 4. Suggested order & effort

1. actors.gpl + hanger icon + NFC tag (half session — quick
   wins, two systems get real art immediately).
2. Coat variants ×3 (half session).
3. Stub particle + V1 enemy full set (1 session).
4. V2 enemy (half session, deferrable past Gate 2).
Total: ~2–2.5 sessions; steps 1–3 are the Gate-2-relevant set
under the narrowed-A ruling.

## 5. Agent wiring session (after step 2 lands)

Swap item rectangles → coat sprites (drop-in contract, same as
Chexy's), enemy rectangles → V1 atlas with sprite-local
registration, hanger/tag icons into HUD + results + level
select, particle emitter retargeted to the stub sprite.
Acceptance: a full rush with zero rectangles on screen; 60fps
re-verify (final actor count is the last perf variable).
