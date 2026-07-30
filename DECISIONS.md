# DECISIONS.md — Chexy's BIG DAY (append-only)

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

## 2026-07-29 — Handoff sequence check added to protocol (handoff 2026-07-29-j)

After -h was applied out of order.
Agents now verify the prior handoff ID exists in DECISIONS.md
before applying a new one.

## 2026-07-29 — Handoff 2026-07-29-j applied

- Item 1: verified -h already applied (its DECISIONS entry exists);
  sequence -b through -j is complete. No -a entry exists — it would
  predate the protocol's adoption in -b. FLAG per the new rule: if a
  2026-07-29-a was issued externally, it never reached this repo.
- Item 2: CLAUDE.md handoff protocol gains the sequence-check rule.
- Item 3: decision logged (entry above).

## 2026-07-29 — Hold duration narrowed (handoff 2026-07-29-a, applied late)

Hold duration narrowed after grey-box
testing felt sluggish at 400ms.

## 2026-07-29 — Handoff 2026-07-29-a applied

Arrived after -j (re-sent following the missing--a flag); applied
in arrival order per append-only log.
- Item 1: DESIGN.md §2.3 hold range 200–400ms → 250–350ms.
- Item 2: decision logged (entry above).
- Item 3: tuning.js holdTagMs already 300 — no change needed.
Note: the historical Gate 0 entry above still cites 200–400ms;
left untouched (append-only log records what was true then).

## 2026-07-29 — Style-proof economics (handoff 2026-07-29-k)

First production frame (side-profile idle) took ~90 min
including one-time costs. Projected full ~40-frame set:
20–28 hours, viable at hobby pace. Animation plan in
BRIEF-ART-01 §4 stands as written — no trimming, no
asset-pack fallback. Visual half of the style-proof (in-motion
in-game readability) still pending before Gate 2 art sign-off.

## 2026-07-29 — Handoff 2026-07-29-k applied

- Sequence check: -j present in log ✓ (day sequence -a..-k complete).
- Item 1: style-proof economics logged (entry above). No code or
  doc changes required.

## 2026-07-29 — STYLE-PROOF PASSED (handoff 2026-07-29-l)

Human sign-off on the art half of Gate 2: the side-profile
idle frame reads as canon Chexy in-game at gameplay zoom,
in both facings. Current art choices stand as drawn —
including the darker body plane (#D84818 as brightest body
color, Body Orange #F06018 unused) and current cream levels.
These are now the sprite style reference for all future
frames. Art production is cleared to proceed at full speed:
idle cycle, then run cycle, then remainder of BRIEF-ART-01
§4 table. Gate 2 as a whole remains open pending the code
half (BRIEF-02 complete: Coatroom playable end-to-end with
sound and sprite hooks).

## 2026-07-29 — Handoff 2026-07-29-l applied

- Sequence check: -k present in log ✓.
- Item 1: style-proof pass logged (entry above). Log-only; no code
  or doc changes required.

## 2026-07-29 — BRIEF-02 Chunk 4 COMPLETE (sprite/atlas hooks)

Art-track handshake live. Sprite priority: Aseprite atlas
(chexy.png+json) > static idle frame > rect; drop-in/delete needs
zero code changes (verified both directions via headless CDP with a
test atlas). Player animation state machine wired to the frame-tag
conventions (idle/run/jump/fall/land/tag/hold/hit/win/lose); missing
tags fall back to idle so incremental art drops always work.
scripts/export-sprites.sh wraps the Aseprite CLI — NOTE: exports
must use --filename-format '{frame}' (numeric frame names) because
Phaser's createFromAseprite looks frames up by index.
tools/flipbook.html previews strips/atlases from file:// with
auto-reload, tag buttons, fps override, zoom, and flip. 60fps
re-verify still requires the human (headless limitation).

## 2026-07-29 — Title changed to "Chexy's BIG DAY" (handoff 2026-07-29-m)

Superseding "The Biggest Day" now that Chexy
is established as the player character. "Chexy's BIGGEST DAY"
reserved for v2/sequel. Branding rule in CLAUDE.md amended
accordingly; repo-wide rename applied; DECISIONS.md history
left unmodified.

## 2026-07-29 — Handoff 2026-07-29-m applied

- Sequence check: -l present in log ✓.
- Item 1: title amendment acknowledged; BIGGEST reserved for v2.
- Item 2: CLAUDE.md header + branding bullet replaced verbatim.
- Item 3: DESIGN.md H1 + Title line replaced verbatim.
- Item 4: DESIGN.md §8 gains the sequel-title reservation.
- Item 5: repo-wide rename — CLAUDE.md intro, DESIGN.md §10
  Resolved title line, TitleScene display text, index.html
  <title>, package.json name (chexys-big-day; npm forbids
  apostrophes) + description, chexy-sprite.gpl palette name.
  DESIGN.md §1 "venue's biggest day ever" kept — premise prose,
  not the title. DECISIONS.md history untouched.
- Item 6: decision logged (entry above).

## 2026-07-30 — Chunk 4 atlas-loading spec amendment (design-chat note)

Native Aseprite pipeline confirmed as the only path for character
sprites: load.aseprite + anims.createFromAseprite; the .ase file is
the single source of truth for animation timing — frame rates and
durations are never redefined in code or tuning.js; no hand-rolled
frame configs; future tags (run, jump, ...) are picked up with zero
code changes. Implementation detail: createFromAseprite looks
frames up by numeric index, but Aseprite GUI exports default to
filename keys + json-hash — Boot now normalizes any export shape
to index-named frames at load (order/durations untouched), so GUI
and CLI exports both work. Verified against the real 11-frame idle
export: anim auto-created with per-frame durations (150/200/100ms)
straight from the .ase; no console errors.

## 2026-07-30 — Phaser Aseprite integration verified against 3.90.0 source (handoff 2026-07-30-a)

Tag names = global
keys, per-frame durations honored, .ase is timing authority,
once-per-boot registration avoids stale-tag hazard. Policy
set: player owns global anim namespace; all other characters
register sprite-locally via target param. Export script to
emit numeric frame keys ({frame} filename format); Boot
normalizer retained as warning fallback. No current
collisions found.

## 2026-07-30 — Handoff 2026-07-30-a applied

- Sequence check: first handoff of 2026-07-30; prior day's
  sequence (-a..-m) complete in log ✓.
- Item 1: DESIGN.md §5 gains the locked animation key policy.
- Item 2: export-sprites.sh already emits --filename-format
  '{frame}' (since the Chunk 4 fix); Boot normalizer now logs a
  console warning when it actually rewrites keys, so a
  misconfigured export is visible. NOTE: the committed
  chexy.png/json is a GUI export, so the warning will appear
  until the next export runs through the script or with {frame}.
- Item 3: verification decision logged (entry above).

## 2026-07-30 — Sprite source naming (handoff 2026-07-30-b)

Canonical source is art/aseprite/<name>.aseprite (app
default extension); export script accepts .aseprite or .ase,
errors if both exist. No file renames required.

## 2026-07-30 — Handoff 2026-07-30-b applied

- Sequence check: -a present in log ✓.
- Item 1: export script resolves <name>.aseprite first, then
  .ase; clear errors when neither or both exist; structured as a
  per-character loop for future sprites.
- Item 2: docs swept — assets/sprites/README.md and BRIEF-02.md
  updated to .aseprite (BRIEF-ART-01 had no .ase references;
  DECISIONS history untouched).
- Item 3: decision logged (entry above).
- Bonus: art/aseprite/chexy.aseprite exists, so the script ran a
  real export — chexy.json is now proper json-array with numeric
  frame keys ({frame} format); the Boot normalizer warning from
  the GUI export is gone. Verified in-game: 11-frame idle, clean
  console.

## 2026-07-30 — Spawn fairness rule added (handoff 2026-07-30-c)

After playtests showed items spawning unreachably close to
enemies. Placement validation + fresh-item grace, both
unconditional (outside the adaptive band). Rescue remains the
net for player misjudgment, not a tax on spawn luck.

## 2026-07-30 — Handoff 2026-07-30-c applied

- Sequence check: -b present in log ✓.
- Item 1: DESIGN.md §2.4 gains the spawn-fairness rule verbatim.
- Item 2: implemented — spawnFairnessGraceMs (600) and
  freshItemGraceMs (800) in tuning.js with panel sliders;
  fairness check at spawn (straight-line travel-time estimates;
  carrying/stunned enemies excluded as threats); wave entries
  accept optional fallbackSpawnPoints, tried in order, with
  least-unfair-point fallback so spawns are never dropped;
  enemies skip fresh items in both seek and steal; "Fairness
  overlay" panel flag draws green/red rings per spawn point plus
  a line to the beating enemy, only while the panel is open.
  Documented in assets/maps/README.md (+ schema row in
  assets/waves/README.md).
- Item 3: decision logged (entry above).

## 2026-07-30 — Steal fairness added (handoff 2026-07-30-d)

After playtests showed uninterceptable steals. Encumbered
carriers, gloat beat, carry-time floor asserted against
level geometry, steal-event spacing. Refined contract:
every loss must be a declined chase, never an impossible
one.

## 2026-07-30 — Handoff 2026-07-30-d applied

- Sequence check: -c present in log ✓.
- Item 1: DESIGN.md §2.4 gains the steal-fairness block verbatim.
- Item 2 (with human clarifications): the fourth tuning value is
  stealFairnessMarginMs (default 500 — agent pick, tune freely);
  stealCooldownMs defaults to 6000 with per-level overrides via
  the stealCooldownMs map property, trending down as mobility
  grows (Coatroom 6000, Bell Desk ~5000, Valet/Stroller ~4500,
  finale ~4000 — guesses to tune; the downward shape is the
  intent). Cooldown gates steal INITIATIONS only — menace is
  free, commitments are spaced. Implemented: encumbered getaway
  (carrierSpeedFactor), gloat beat (frozen taunt + distinct
  'gloat' SFX + Alert Red urgency-arrow spike for off-screen
  carriers), cooldown gate, and the (c) assertion as a live
  panel readout (green/red) + console warning naming the
  violating values and passing thresholds.
- Item 3: decision logged (entry above).
- FLAG for design: the (c) assertion is RED for the Coatroom
  with the handoff-locked defaults — worst-case carrier escape
  9.7s < max-effort traversal 10.7s + 500ms margin, violated by
  ~1.5s. To pass: carrierSpeedFactor ≤ 0.51, or gloatMs ≥ 2200,
  or slower enemies / narrower level / smaller margin. Defaults
  applied as specified; the tuning call belongs to the design
  chat.
- Log housekeeping: the "Handoff 2026-07-29-g applied" entry had
  been sitting at end-of-file due to an append-anchoring slip;
  relocated (byte-identical) to its chronological position.
