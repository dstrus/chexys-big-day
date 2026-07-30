# DECISIONS.md — The Biggest Day (append-only)

## 2026-07-29 — Gate 0 PASSED

DESIGN.md v1.0 and CLAUDE.md approved. Key decisions locked:

- Title: **The Biggest Day**. Player character: **Chexy**, squat
  anthropomorphic squirrel. Legacy company name banned everywhere.
- Graphics: 32-bit / SotN-style. 480×270 internal, integer scaling,
  per-asset palettes (16–32 colors/sprite, no global cap).
  Asymmetric fidelity. Style-proof gate in Phase 2.
- Tagging: hybrid — instant tap standard, charged interruptible hold
  (200–400ms) for heavy items; generous auto-target radius with
  target highlight.
- Difficulty: adaptive with score trade-off (multiplier 1.0×→0.7×
  as intensity eases; both recover on clean streaks; band clamped
  per level; multiplier always on HUD).
- Run length: 15–20 min full clear.
- Guest-matching mechanic: deferred to v2.
- Next milestone: Gate 1 (grey-box prototype is FUN). First agent
  session brief: BRIEF-01.md.

## 2026-07-29 — Handoff protocol adopted (handoff 2026-07-29-b)

Chat sessions produce HANDOFF blocks or replaced docs; agent
applies literally, logs here, commits with handoff ID. Repo is
now the single source of truth for all docs.

## 2026-07-29 — Art track decisions (BRIEF-ART-01)

- Canonical Chexy reference received: art/reference/Chexy.png.
- Canonical palette extracted and recorded in BRIEF-ART-01 §2
  (body orange #F06018, cream #F0F0D8, maroon ramp, #180000
  outlines — no pure black).
- Uniform question CLOSED: no uniform element on the gameplay
  sprite; chest badge is canon in larger art only (title/
  results/portraits). Gameplay sprite identity = tail + eyes +
  muzzle. Mirror-flipping is therefore fully clean.
- DESIGN.md open-questions list is now empty.

## 2026-07-29 — Handoff 2026-07-29-c applied

- Item 0: verified BRIEF-ART-01.md and art/reference/Chexy.png
  are present in the repo.
- Item 1: DESIGN.md §10 open questions emptied; uniform
  resolution added to the Resolved list.
- Item 2: art track decisions logged (entry above).
- Item 3: BRIEF-ART-01 checked against CLAUDE.md and DESIGN.md §5
  — no conflicts found.

## 2026-07-29 — Brand palette added from official Brand Guidelines (handoff 2026-07-29-d)

UI keys on brand hexes
(#FE701E etc.); Chexy sprite keys on mascot extraction.
In-game item category colors will use the real ChexApp tag
colors. DESIGN.md §5 palette TODO closed.

## 2026-07-29 — Handoff 2026-07-29-d applied

- Item 0: verified art/palette-brand.md present in repo.
- Item 1: DESIGN.md §5 palette TODO sentence replaced with pointer
  to art/palette-brand.md and the brand-vs-sprite palette split.
- Item 2: brand palette decision logged (entry above).
- Item 3: noted standing rule — any future src/config colors/theme
  file sources UI hexes from art/palette-brand.md; no grey-box
  restyle now (none exists yet, nothing to change).

## 2026-07-29 — Hitbox/sprite split locked (handoff 2026-07-29-e)

32×32 physics body = Chexy's body mass; 48×48
sprite canvas; tail/overhang visual-only, no collision.
Anchor bottom-center to bottom-center. Auto-target radius
measures from physics body center. Grey-box placeholder rect
updated to 32×32 to match.

## 2026-07-29 — Handoff 2026-07-29-e applied

- Item 1: DESIGN.md §5 gains the locked hitbox-vs-sprite bullet.
- Item 2: BRIEF-ART-01 §3 canvas line replaced (32×32 body region
  anchored bottom-center, overhang visual-only, Aseprite guide).
- Item 3: decision logged (entry above).
- Item 4: audit — enemy/steal/hold-interrupt contacts already use
  arcade physics bodies (correct). FLAG: tag auto-target distance,
  enemy seek goal, and stereo pan measure from the SPRITE center
  (player.x/y). Identical to body center on the grey-box rect, but
  will diverge by ~8px vertically once the 48×48 sprite anchors
  bottom-center — switch to body.center at art integration.

## 2026-07-29 — Palette files generated (handoff 2026-07-29-f)

chexy-sprite.gpl (16 colors, snapped from mascot extraction)
and chexology-brand.gpl (32 brand colors). Chexy sprite work
starts at 16 colors; expansion up to 32 allowed per DESIGN.md
§5 if needed. OpenArt used for pose reference generation only —
AI output never ships as game art.

## 2026-07-29 — Handoff 2026-07-29-f applied

- Item 0: verified art/palettes/chexy-sprite.gpl,
  art/palettes/chexology-brand.gpl, and
  art/reference/openart-prompts-chexy.md present (first attempt
  found the prompts file missing and a stray palette-brand.md
  duplicate in art/reference/ — human fixed both before apply).
- Item 1: palette decision logged (entry above).

## 2026-07-29 — Gate 1 PASSED

Grey-box prototype accepted by the human: the core loop is FUN.
Verdict includes the in-session playtest additions (stun-to-rescue,
directional item hints, pause, dash fix). DESIGN.md fold-in of the
session-originated mechanics to arrive via handoff from the design
chat.

## 2026-07-29 — Grey-box playtest addition: stun-to-rescue

Human call during Gate 1 playtesting: losing a snatched item with
no recourse felt bad. New mechanic — tagging (Z/J) a ticket that
is carrying an item stuns it (tunable duration) and drops the item,
taggable again; brief no-steal grace on wake. No score/streak for
the stun itself. Not yet in DESIGN.md §2 — fold into the design
doc via handoff if it survives Gate 1 evaluation.

## 2026-07-29 — Gate 1 session mechanics ratified (handoff 2026-07-29-g)

Stun-to-rescue canonized (§2 item 4b, always
tap, no score/streak/adaptive effects, urgency feedback);
directional hints canonized for ALL levels as §2.4 (arrows
encode urgency, stereo cues, future toggles); god-mode runs
excluded from persisted scores. Watch item for Gate 2: if
3-lost-items failure proves too rare in Coatroom playtests,
revisit steal pressure.

## 2026-07-29 — BRIEF-02 inputs resolved; brief started

- Dash decision: KEEP for Level 2 (per DESIGN.md §2.2/§3.2); stub
  stays disabled in tuning until then.
- Gate 1 tuning: committed tuning.js defaults confirmed final by
  the human (no further copy-values export).
- BRIEF-02 started; this session covers Chunks 1-2 (level pipeline
  + data-driven waves).

## 2026-07-29 — BRIEF-02 Chunk 1 COMPLETE (Tiled level pipeline)

Playground scene deleted; generic LevelScene boots any Tiled map by
key. coatroom.json (100×17 tiles, ~3.3 screens) with documented
conventions (assets/maps/README.md): bg2/bg1/main/fg tile layers,
spawns/zones object layers, levelId/rushSeconds/waveFile map
properties. Maps load via ESM import → tilemap cache (Vite bundles
them; no publicDir config needed). Placeholder tileset generated at
runtime in Boot. Verified: boots into coatroom, no console errors.

## 2026-07-29 — BRIEF-02 Chunk 2 COMPLETE (data-driven waves)

Wave schedules live in assets/waves/*.json (schema documented in
that README); WaveRunner plays the timeline back. coatroom-waves.json
drives the whole 2:30 rush: 17 item entries (escalating counts, ALL
weight tier 1 — weight tiers debut in Level 2 per DESIGN.md §3.2, so
the Coatroom has no hold-tags) + 20 enemy entries with late double
spawns. Item categories tint with the real ChexApp tag colors
(src/config/itemCategories.js). Adaptive intensity scales entry
counts and within-entry intervals in the clamped band; the
maxItemsOnField cap acts as the pressure valve. Obsolete spawn keys
removed from tuning.js. Verified: boots and runs clean; editing the
JSON changes the level with no code changes (registry + import).
NOTE: 60fps re-verify (DESIGN.md §7) still needs a human check —
headless Chrome cannot measure frame rate.

## 2026-07-29 — Sprite facing convention (handoff 2026-07-29-i)

Left-facing native, code flips for rightward movement, default
spawn facing right.

## 2026-07-29 — Handoff 2026-07-29-i applied

- Item 1: DESIGN.md §5 gains the locked facing-convention bullet.
- Item 2: Player flip logic confirmed (unflipped left, flipped
  right) and default spawn facing set to right.
- Item 3: BRIEF-ART-01 §3 notes native-LEFT facing for all frames.
- Item 4: decision logged (entry above).

## 2026-07-29 — Dash decision (handoff 2026-07-29-h)

KEEP.
Dash ships in Level 2 (The Bell Desk) alongside weight tiers,
per DESIGN.md §3.2. Remains disabled until Level 2's unlock
moment. Velocity-clamp bug fixed in grey-box session;
dashSpeed and dashDurationMs stay in tuning.js. BRIEF-02
input requirements are now fully satisfied.

## 2026-07-29 — Handoff 2026-07-29-h applied

- Item 1: dash decision logged (entry above). Applied after
  handoff -i (arrived out of sequence; append-only order kept).
  Consistent with the provisional keep-for-L2 call already made
  when BRIEF-02 started — no code changes needed.

## 2026-07-29 — Handoff 2026-07-29-g applied

- Item 1: DESIGN.md §2 gains rescue item 4b.
- Item 2: DESIGN.md gains §2.4 attention & feedback systems.
- Item 3: DESIGN.md §2.5 gains the rescue-neutrality line.
- Item 4: standing guard recorded — god-mode runs never write
  persisted best scores; implement when score persistence lands
  (BRIEF-02 Chunk 6 localStorage).
- Item 5: ratification logged (entry above).
- Code-vs-canon flags (future work, no change requested now):
  grey-box arrows do not yet encode urgency (fixed pulse, no
  Alert Red shift; item expiry does not exist yet); rescue
  feedback is placeholder (grey tint + particles, no dizzy
  effect); settings-menu toggles for §2.4 systems do not exist.
  Current code already matches: rescue always-tap, and rescues
  are adaptive-neutral (no streak/intensity effect).
