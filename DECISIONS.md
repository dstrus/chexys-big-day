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

## 2026-07-30 — stealCooldownMs default set to 6000 (handoff 2026-07-30-e)

Derived from worst-case chase-resolution time
under the steal-fairness inequality; per-level overrides
tighten as player mobility grows.

## 2026-07-30 — Handoff 2026-07-30-e applied

- Sequence check: -d present in log ✓. Arrived after the -f
  sequence stop caught it missing; applied before -f.
- Item 1: DESIGN.md §2.4 (d) clause amended with the 6000 default,
  map-property overrides, and the initiations-only boundary.
  Implementation already conformed (built from the human's
  clarification during -d) — no code changes.
- Item 2: decision logged (entry above).

## 2026-07-30 — Target lock added (handoff 2026-07-30-f)

After
continued unfairness reports: enemies commit to their
acquired target until it becomes unavailable (definition in
§2.4). Completes the fairness stack: spawn placement (-c),
interception guarantees (-d/-e), and now legible intent.
Predictability compensated via wave pressure, not
retargeting.

## 2026-07-30 — Handoff 2026-07-30-f applied

- Sequence check: initially STOPPED — -e was missing from the log;
  human supplied -e, which was applied first. -e now present ✓.
- Item 1: DESIGN.md §2.4 gains the target-lock block verbatim.
- Item 2: implemented — lock state on enemy AI (lockedTarget);
  lock released only when the target stops being taggable
  (tagged/stolen-by-another/despawned/carried-out) or on rescue
  stun (re-acquires on waking; no-steal grace unchanged);
  acquisition respects fresh-item grace; grab consumes the lock.
  "Target lock lines" panel flag draws enemy→target lines while
  the panel is open. Boss minions will inherit via the shared
  enemy update path.
- Item 3: decision logged (entry above).

## 2026-07-30 — Fairness stack closed (handoff 2026-07-30-g)

carrierSpeedFactor 0.5 locked, assertion green expected;
wave pressure, lock-baiting, and steal cooldown confirmed
as-is from playtest ('barely succeeding' = Level 1 target
texture). BIG DAY! perfect-clear bonus added: +25% score
line, results stamp, per-level medal; celebration-only,
never gating.

## 2026-07-30 — Handoff 2026-07-30-g applied

- Sequence check: -f present in log ✓.
- Item 1: carrierSpeedFactor 0.6 → 0.5 in tuning.js. VERIFIED
  GREEN: worst-case carrier escape 11.46s ≥ traversal 10.67s +
  500ms margin (~290ms slack); no assertion warning fired in a
  live headless run — first fully clean console since -d.
  Wave pressure, lock-baiting, stealCooldownMs untouched.
- Item 2: DESIGN.md §2.5 gains the BIG DAY! bonus block verbatim.
  Implementation note: the bonus line, stamp animation, medal,
  and localStorage all belong to BRIEF-02 Chunk 6 (results
  screen + persistence, incl. the standing godMode exclusion);
  bigDayBonusFactor enters tuning.js when that code lands — no
  code written now per the handoff's design-append scope.
- Item 3: decision logged (entry above).

## 2026-07-30 — Golden Hangers added (handoff 2026-07-30-h)

3/2/1 hangers for 0/1/2-loss clears, 3 losses still Game
Over. Absorbs the BIG DAY medal (stamp + 25% bonus now the
3-hanger celebration); HUD loss indicator restyled as
hangers; max-per-level persisted; celebration-only, no
gating in v1.

## 2026-07-30 — Handoff 2026-07-30-h applied

- Sequence check: -g present in log ✓.
- Item 1: DESIGN.md §2.5 BIG DAY! block replaced verbatim with
  Golden Hangers & the BIG DAY! bonus.
- Item 2: HUD restyled — "LOST n/3" text replaced by three
  placeholder hanger glyphs (gold intact, grey + red break as
  losses accrue); no new HUD element. Verified in-game.
- Item 3: DESIGN.md §8 gains the cosmetic-spending v2 line.
- Item 4: decision logged (entry above).
- Scope note: results-screen hanger slots + chimes, stamp, +25%
  line, and max-per-level persistence land with BRIEF-02 Chunk 6.

## 2026-07-30 — BRIEF-02 Chunk 3 COMPLETE (guest text-bubble UI)

Guests are lightweight data (one per item, id only). Returns and
losses emit guest-happy / guest-angry; UIOverlay renders brand-
styled bubbles (Background Tan translucent panel, Gray-700 text,
Success Green / Alert Red accent bar) queued bottom-right, max 3
visible, ~2.5s auto-dismiss, never obscuring HUD or play-area
center; results/pause panels layered above. Copy: 9 happy + 5
unhappy placeholder lines in src/config/guestLines.js (silly-
affectionate; human to punch up). Verified in-game via event-driven
headless run: styling correct, console clean. 60fps re-verify
still owed a human check.

## 2026-07-30 — Results layout (handoff 2026-07-30-i)

Hanger row centered between success
text and score; empty slots always shown; sequential fill
is the screen's second beat.

## 2026-07-30 — Handoff 2026-07-30-i applied

- Sequence check: -h present in log ✓.
- Item 1: clear-results stack implemented — success text → hanger
  row (3 slots, earned fill sequentially at 400ms with a chime;
  unearned render as tarnished outlines) → score lines (BIG DAY!
  +25% line when 3 hangers; bigDayBonusFactor added to tuning) →
  retry prompt. Fail layout unchanged (no ceremony on game over).
- Item 2: 8-point gaps (16 / 8 / 24) with the stack computed and
  centered as a group for both 3- and 4-line score blocks.
- Item 3: verified at 1, 2, and 3 hangers via crafted run-over
  events + screenshots; the stamp slams over the title region
  (space is tight at 480×270, per the item's allowance) and never
  touches the hanger row. New 'chime' and 'stamp' SFX.
- Item 4: decision logged (entry above).
- Note: this pulls the ceremony's display half forward from
  Chunk 6; persistence (max hangers, best score, godMode
  exclusion) still lands with Chunk 6.

## 2026-07-30 — BRIEF-02 Chunk 5 COMPLETE (audio bus + placeholder SFX)

Central AudioBus: named events resolve to dropped-in files
(assets/audio/<event>.wav|mp3|ogg) with the generated jsfxr-style
synth as the placeholder fallback — same drop-in/delete contract as
sprites; pulling any file never crashes (verified both directions
with generated test WAVs). Canonical event names per the brief
(tag/holdStart/holdComplete/holdInterrupt/itemLost/multiplierUp/
multiplierDown/rushStart/rushEnd/uiSelect) with finer game events
aliasing onto them; new multiplierDown/rushStart/uiSelect synths.
Music: per-level loop hook (assets/audio/music/<levelId>) with a
generated 4-bar chiptune stub fallback; ducks to 30% under results,
restores on retry. master/sfx/music volumes in tuning.js with live
panel sliders. Docs: assets/audio/README.md.
BONUS FIX: pause-resume had been silently broken since Chunk 1 —
UIOverlay still resumed the deleted 'Playground' scene key; now
resumes 'Level'. 60fps re-verify still owed a human check.

## 2026-07-31 — BRIEF-02 Chunk 6 COMPLETE (results + level flow + persistence)

Full loop: Title → level select ("SELECT YOUR SHIFT") → level →
results → continue back to select (or R to retry). Coatroom
unlocked; slots 2–5 shown as "???". Results grading per DESIGN.md
§2: items returned, guests served, tags collected, item return rate
% (the 99% joke's payoff meter), best multiplier held, score, and
the BIG DAY! bonus line — layered onto the -i hanger ceremony.
Persistence (localStorage, the one storage dependency, guarded for
blocked storage): best score per level (bonus included) and max
hangers, never downgraded; god-mode runs record nothing. Level
select shows BEST score + 0–3 hanger icons per level. Verified end
to end via headless CDP including the max-merge case (a worse-hanger
higher-score run raises the score, keeps the hangers). BRIEF-02 exit
condition met: Coatroom fully playable end to end, data-driven,
sound hooks live, sprite hooks receiving real art, results/flow in
place. Gate 2 code half done — the gate itself needs human sign-off
(and the standing 60fps check).

## 2026-08-01 — Movement jitter resolved; render-snap architecture adopted

A multi-day hunt (probes, live A/B toggle, two screen recordings with
frame forensics) found four stacked defects: camera lerp quantization
feedback + a 2px vertical scroll hunt (map 272px vs 270px viewport),
atlas edge-bleed exposure (fixed via --extrude, now standard in the
export script), float-dust rounding flips at rest, and a metronomic
.5 rounding boundary at run speed (maxSpeed 150 = exactly 2.5px per
frame). Standing architecture going forward: fixed-step physics
(60Hz), a manual pixel-coherent camera (integer scroll derived from
the rounded player position, scrollY pinned), and RENDER SNAP -
physics integrates in floats, sprites snap to whole pixels for render
only and are restored before the next step. Rendered positions are
integers by construction; rounding boundaries cannot flip. The
jitter probe (panel readouts, F-key 60-frame capture) remains in the
debug panel for future regressions.

## 2026-08-01 — 60fps human verification PASSED (handoff 2026-08-01-a)

On the current build (render-snap architecture,
real Chexy atlas, Chunks 1–6 complete). Clears the standing
perf debt noted in Chunks 3, 5, and the Chunk 6 exit. Gate 2
CODE HALF is now fully signed off: BRIEF-02 exit condition +
perf criterion both met. Gate 2 overall remains open pending
the human's scope ruling on the 'full art/audio' clause.

## 2026-08-01 — Handoff 2026-08-01-a applied

- Sequence check: first handoff of 2026-08-01 ✓ (2026-07-30's
  sequence closed complete at -i).
- Item 1: 60fps verification logged (entry above). Log-only.

## 2026-08-01 — Item color correction (handoff 2026-08-01-b)

Tag colors are the TAGS', not the items' — human product
ruling. Items get varied garment colors; tagged state shown
by an applied tag chip (8×8 template, runtime-tinted).
Diegetic state readability replaces category color-coding.
actors.gpl regenerated (v2) accordingly.

## 2026-08-01 — Handoff 2026-08-01-b applied

- Sequence check: -a present in log ✓. BRIEF-ART-02, BRIEF-ART-03,
  actors.gpl (v2, replaced by the human mid-apply), and
  coatroom-env.gpl arrived untracked alongside; committed here.
- Item 1: BRIEF-ART-03 §0 bullet replaced verbatim.
- Item 2: §1 coat variants amended to garment colors; tag-chip
  deliverable added verbatim.
- Item 3: implemented — 8×8 neutral chip template generated in
  Boot (dark border survives tinting so the chip reads against
  any item color); applied on successful tag, tinted per
  category; position-synced to its item every frame (anchor:
  top-third, hook side) and destroyed with it, so it
  structurally persists through carry/rescue. Note: under
  CURRENT mechanics tagged items despawn immediately and
  enemies only steal untagged items, so the persist-through-
  carry path is future-proofing, not yet observable.
  Urgency/expiry/highlight overlays untouched.
- Item 4: decision logged (entry above).
- FLAGS for the design chat: (a) BRIEF-ART-03 §1's L2 forward
  note still says "luggage = Tag Teal base" — inconsistent with
  the new ruling; (b) grey-box item rects remain category-
  tinted until the coat sprites land (out of this handoff's
  scope); (c) BRIEF-ART-03 §4 references a "narrowed-A ruling"
  for Gate 2 scope that has not arrived here as a handoff.
- Housekeeping: art/reference/chexy.af~lock~ (Aseprite editor
  lock file) was accidentally tracked; untracked + gitignored.

## 2026-08-01 — Luggage note fix; interim tints accepted; GATE 2 SCOPE RULED (handoff 2026-08-01-c)

BRIEF-ART-03 luggage note corrected to match
the -b item-color ruling; interim tinted-rect state
accepted; Gate 2 scope RULED: narrowed-A (handoff
2026-08-01-c) — gate closes on structural tiles + coats +
enemy V1 in-game; parallax depth, V2, motion polish, and
final audio tracked as debt. Note: §4's earlier 'narrowed-A'
reference predated ratification — flagged by the agent,
ruled here.

## 2026-08-01 — Handoff 2026-08-01-c applied

- Sequence check: -b present in log ✓.
- Item 1: BRIEF-ART-03 §1 luggage forward note replaced verbatim.
- Item 2: acknowledged, no change — tinted rects + matching chips
  stand until coat sprites land.
- Item 3: Gate 2 scope = NARROWED-A. Gate closes on structural
  tiles wired + coat sprites + enemy V1 in-game. Tracked polish
  debt (NOT blockers): P2–P4 parallax, enemy V2, BRIEF-ART-02
  Deliverable C autonomous motion, final audio passes.
  BRIEF-ART-03 §4 now cites this handoff as the ruling's source.
- Item 4: decision logged (entry above).

## 2026-08-01 — Tileset convention: platform caps (human ruling)

Platform strips use left cap / middle / right cap tiles (gids
6 / 2 / 7) rather than self-tiling single-role strips — the (b)
fork of the tileset-roles question. coatroom.json re-placed
(14 runs capped), role table documented in assets/maps/README.md,
placeholder strip updated so caps are visually distinct in the
grey-box. Runs shorter than 2 tiles are disallowed in layouts.

## 2026-08-01 — Chexy locomotion set COMPLETE and verified in-game (handoff 2026-08-01-d)

Idle (11f), run (8f), jump/
fall/land (2+2+2), all tags live via createFromAseprite,
.ase durations authoritative. Remaining character anims
(tag, hold, hit, win, lose) are non-locomotion and trail
per queue. Confirm in passing: Player.js triggerAnim calls
for not-yet-drawn tags ('tag', 'hit') and playEndPose
('win'/'lose') degrade gracefully (no-op or fallback, no
console errors) until those tags exist.

## 2026-08-01 — Handoff 2026-08-01-d applied

- Sequence check: -c present in log ✓.
- Item 1: logged (entry above). Verified in passing as asked:
  atlas exports exactly idle(11) run(8) jump(2) fall(2) land(2),
  all five registered by createFromAseprite; a live jump-land
  cycle, a tag press (missing 'tag' anim), and a forced run end
  (missing 'win' pose) all ran with zero console errors —
  triggerAnim/playEndPose no-op on missing tags and playState
  falls back to idle, per the Chunk 4 guards.

## 2026-08-02 — Structural tiles WIRED (Gate 2 narrowed-A item 1 of 3)

Real Coatroom tileset art in-game: art/aseprite/coatroom-tiles
.aseprite → assets/tiles/coatroom.png, loaded via the standard
drop-in contract (delete = placeholder strip returns). Map tileset
descriptor widened to 8×3 = 24 slots; row 1 = structural roles,
rows 2–3 (gids 9–24) reserved for dressing. Verified in-game:
parquet floor, carpeted platforms with caps, counter, dressing
posts; squint test passes (Chexy pops). Console clean. Remaining
for Gate 2: coat sprites, enemy V1.

## 2026-08-02 — Coat sprites WIRED (Gate 2 narrowed-A item 2 of 3)

assets/sprites/coats.png (3-frame 24×24 strip: cobalt long coat,
crimson overcoat, olive puffy jacket — garment colors per the -b
ruling) loads via the drop-in contract. Tier-1 items spawn as a
random coat variant, untinted (the tag chip carries category);
physics body 16×18 centered per BRIEF-ART-03 §1. Rect + category
tint remains the fallback and the heavy-item path until luggage
art (L2). Verified in-game, console clean. Remaining for Gate 2:
enemy V1.

## 2026-08-03 — Enemy V1 "Stub" WIRED (Gate 2 narrowed-A item 3 of 3, move set)

art/aseprite/enemy-stub.aseprite (11-frame move loop incl. blink;
artist expanded from the brief's 3 per craft judgment) exports via
the standard script and loads as enemy-atlas. Anims register
SPRITE-LOCALLY per the 2026-07-30-a policy — verified live: 'move'
exists on the sprite, not in the global namespace. Enemy state →
anim mapping wired with graceful fallback (stun/grab/carry fall
back to 'move' and will light up automatically when drawn — the
artist queues them next). Body 18×16 on the 24×24 canvas;
left-facing native with velocity flip. A full Coatroom rush now
renders with zero placeholder rectangles (heavy items keep the
rect fallback but Coatroom waves are tier-1 only). Still queued
from BRIEF-ART-03: remaining V1 anims, stub particle, hanger +
NFC icons, remaining Chexy anims. Gate 2 close call is the
human's once the V1 set completes (or is ruled sufficient as-is).

## 2026-08-03 — Enemy V1 animation set COMPLETE

enemy-stub atlas now carries the full BRIEF-ART-03 §2 set:
move(11f) grab(2f) carry(3f) stun(5f). No code changes — the
state mapping's fallbacks simply stopped falling back. Verified
live through the full cycle: seek→move, steal→grab (gloat beat),
getaway→carry, rescue→stun, wake→move; sprite-local registration
holds; console clean. All three narrowed-A Gate 2 items are now
fully in-game with complete art. Gate close awaits the human's
sign-off.

## 2026-08-03 — Golden Hanger icons WIRED (BRIEF-ART-03 §3)

assets/sprites/hanger.png (12×12 × 3 states: golden / tarnished /
broken) replaces the placeholder glyphs in all three consumers via
a unified createHanger API (image when the sheet exists, glyph
fallback otherwise): HUD loss meter (golden→broken), results
ceremony at 2× (tarnished slots land golden per chime), level
select bests (golden/tarnished). Verified in all three, console
clean. Remaining §3 art: NFC tag collectible (system itself is a
future chunk), stub particle.

## 2026-08-03 — Stub particle WIRED (BRIEF-ART-03 §2 "highest-reuse asset")

particle.aseprite (3 frames, 8×8, 130ms each) exports via the
standard script. The file is untagged, so the anim is built
programmatically under the namespaced key 'fx-stub-poof' with
durations read from the export JSON (.ase timing stays
authoritative; fx- prefix keeps the global namespace clear of
character tag names). Rescue stuns now emit 6 tumbling paper
scraps (speed spread, slight gravity, rotation) from a dedicated
emitter; the tag burst stays on the sparkle emitter — check-ins
must not read as paper destruction. Same asset reserved for enemy
despawns and the boss finale confetti. Verified live, console
clean.

## 2026-08-03 — BRIEF-03 presence discrepancy resolved (handoff 2026-08-03-a)

Root cause: BRIEF-03.md has been in HEAD at the repo root since
2026-07-30 — swept in silently by the agent's own `git add -A`
during the "Apply handoff 2026-07-30-b" commit (56c9d50) after the
human dropped it unannounced; it was never read or applied. The
2026-08-03 status report's "never arrived" flag was written from
memory without a filesystem or history search, and earlier globs
(`ls BRIEF-ART*`) could not have matched it. Search that found it:
ls *.md + find -iname '*brief*3*' + git log --all -- '*BRIEF-03*'.
Weight-tier luggage line corrected to match -b ruling;
belldesk-waves.json typo fixed (no references existed under the
misspelled name — verified by repo-wide grep); referenced-artifact
check added to CLAUDE.md protocol.

## 2026-08-03 — Handoff 2026-08-03-a applied

- Sequence check: first handoff of 2026-08-03 ✓.
- Item 0: BRIEF-03 located in HEAD (root cause above); no stop
  needed.
- Item 1: luggage color line replaced verbatim.
- Item 2: bellddesk → belldesk fixed; repo-wide grep confirmed no
  file or code reference ever used the misspelled name.
- Item 3: referenced-artifact check appended to CLAUDE.md verbatim.
- Item 4: decision logged (entry above).
- NOTE: BRIEF-03 (Bell Desk code brief) is now surfaced and unread
  debt — it has never been reviewed or started; flagging for
  scheduling in the design chat.

## 2026-08-03 — Grab-state wedge investigation: no wedge; menace loiter added

Bug report: enemies intermittently "stuck in grab/gloat", correlated
with two items spawned at one location. Investigation (mechanism
audit + attach-failure enumeration + instrumented repro + 90s
adversarial soak with wedge detector and exception capture) found NO
state-machine wedge: the gloat exit is a pure timer (94fc031), all
four two-item attach-failure paths are closed by atomic guards, and
every observed grab transitioned to carry on schedule. Root cause is
perceptual: a cooldown-blocked enemy flew to its locked target and
parked dead-center on it for up to stealCooldownMs (6s) — with
enemy V1 art this reads as a wedged grab/gloat, and stacked items
guarantee a camper right where a real gloat just played.

Human ruling: MENACE LOITER (chosen over lock-deferral and over the
now-inert gloatMs×3 watchdog). While not cleared to steal (global
cooldown or post-stun grace), a locked enemy circles its target at
loiterRadius instead of camping; it dives in the moment it clears.
New tunables loiterRadius (28) / loiterOrbitMs (3800), on the panel.
Steal gates unified into clearedToSteal() used by both the grab and
the approach, so they cannot drift. Target-lock semantics
(2026-07-30-f), steal fairness values, and gloat timing unchanged;
lock is held throughout the loiter (intent stays plannable — the
circling itself is a readable telegraph). Verified live: orbit holds
27-29px through the full 6s cooldown, instant grab on expiry, clean
console.

## 2026-08-03 — Handoff 2026-08-03-b applied

- Sequence check: 2026-08-03-a applied (entry above) ✓.
- Item 1: design-ruling entry appended verbatim below.

2026-08-03 — Grab-wedge report resolved as PERCEPTUAL
(commit 614e0d7): no state-machine defect; cooldown-blocked
enemies camping on targets read as wedged once V1 art
landed. Design ruling (human, in-session): MENACE LOITER —
not-cleared enemies orbit their locked target (loiterRadius
28, loiterOrbitMs 3800) and dive on clearance. Steal gates
unified into clearedToSteal(). Target lock, gloat, and all
fairness values unchanged. gloatMs×3 watchdog dropped as
inert (timer-driven exit proven); the state-exit principle
carries to the boss implementation brief instead. Open
evaluation: urgency-arrow weighting for loitering vs.
diving enemies, pending human loiter play-check.

## 2026-08-03 — Handoff 2026-08-03-c applied

- Sequence check: 2026-08-03-b applied (entry above) ✓.
- Item 1: gate-close entry appended verbatim below.
- Item 2: DESIGN.md §9 Gate 2 row marked PASSED 2026-08-03.

2026-08-03 — GATE 2 PASSED (handoff 2026-08-03-c). Human
inspection playthrough verdict: PASS under the narrowed-A
scope (-c). The Coatroom is certified as a finished product
slice: recognizably the game, zero placeholders, 60fps,
ceremony and fairness texture intact. Loiter behavior
accepted (no issues filed); urgency-arrow weighting for
loitering enemies remains an open watch item per -b.
PUNCH LIST → DEBT: floor/platform tile variety pass
(sequence tiles + breakers per the 2026-08-02 design
discussion) — deferred by the human, joins the polish
ledger. Full debt ledger as of gate close: P2–P4 parallax,
enemy V2, BRIEF-ART-02 Deliverable C (autonomous motion),
final audio passes, tile variety pass, chip anchor
documentation.
PHASE 3 IS OPEN: BRIEF-03 (Bell Desk) is unblocked for
execution — its prerequisite (Gate 2) is now satisfied.

## 2026-08-03 — BRIEF-03 executed: The Bell Desk (Phase 3, code track)

Prerequisite verified: Gate 2 PASSED (-c above); BRIEF-02 systems
(Tiled pipeline, waves, bubbles, audio bus, results flow) all
present. Applied with the four execution-context updates.

Shipped: belldesk.json (120×17 blockout: ground run, front-desk
counter, four static luggage-cart platforms, mezzanine + upper
strips, bell-cart return zone; props levelId/rushSeconds 180/
waveFile/stealCooldownMs 5000 per -e trend/dashUnlockBeat) +
belldesk-waves.json (opening tier-1 spacing after the 10s beat →
tier-2 at far ends → tier-3 near enemy edges with rescue-spike
tickets → final mixed swarm with the two-trunk multiplier bait).
Weight tiers: tier data on items, tier 2 = short hold (new
holdTier2Factor 0.6), tier 3 = full holdTagMs, interim silhouettes
= rect sizes (14/20×22/26×30) + chips per the accepted convention.
Dash: unlocks at Bell Desk start via one-bubble captain beat
(persists in progress storage; godMode guard inapplicable — control
unlock, not a best), double-tap ←/→ or X/K, dashCooldownMs 900,
dashDoubleTapMs 250, 3-ghost additive afterimage, locked out during
holds (dashCancelsHold flag trials the opposite — verified both
ways), passes through tickets, no wall clip (collider untouched).
First dash → Success Green confirmation bubble. Level select: THE
BELL DESK unlocks on any Coatroom clear (bestHangers > 0).

AMENDMENTS applied per the brief: DESIGN.md §3.2 dash-lockout
paragraph appended verbatim; §2.2 dash row note updated.

ACCEPTANCE ADDITION verified: (c) steal-fairness readout GREEN for
belldesk geometry with dash factored — escape 11464ms ≥ traverse
10872ms + 500ms margin (92ms slack; tight, flag if the level
widens). Coatroom stays green post-unlock (9060+500 ≤ 11464).
Verified headless: boots clean (zero console errors), map props
live, beat + confirm bubbles, dash unlock/cooldown/double-tap/
ghosts, tier-2 hold 180ms and tier-3 300ms both complete to tag,
movement interrupt intact, dash-in-hold blocked (and cancels when
flag on), Bell Desk locked without a Coatroom clear.

Judgment calls (flagging, not silent): (1) tier-2 items use the
heavy-variant edge arrow — brief groups hold-tiers as "heavy" for
§2.4 arrows; (2) tier-2 scoring left at standardItemScore — brief
silent on tier-2 value, needs a design ruling; (3) first-dash
confirmation copy "That's the hustle!" is invented placeholder
copy — brief specifies the bubble but not its text; (4) new map
convention documented in assets/maps/README.md: item spawn points
must clear the trunk silhouette (≥20px above floor) or the item
embeds and falls through — found and fixed during verification.

Remaining acceptance (human): punch-list play session (part of the
brief, not a follow-up), 60fps at ×2 confirmation, dash feel.

## 2026-08-03 — Handoff 2026-08-03-d applied

- Sequence check: 2026-08-03-c applied (entry above) ✓.
- Item 1: hold-start-buffering paragraph appended to the DESIGN.md
  §2.3 heavy-items bullet verbatim; implemented as default with
  holdDeferredStart tunable flag (true) on the panel.
- Item 2: confirmed at runtime — Z held while running past two
  tier-1 items fired zero taps (tap remains a press event); arrival
  + movement-key release near a trunk started the buffered hold
  (300ms, zero struggle penalties) and completed to a tag.
- Item 3: ruling entry appended verbatim below.

2026-08-03 — Hold start buffering ruled (handoff
2026-08-03-d): deferred start (option 2) — movement input
at hold start waits rather than interrupting; struggle
penalties price abandonment only, never arrival overlap.
Framed as the hold-verb sibling of jump buffering.
itemDragX slide bug separately fixed at 1929d0d.

## 2026-08-03 — Handoff 2026-08-03-e applied

- Sequence check: 2026-08-03-d applied (entry above) ✓.
- Item 1: fresh-press sentence appended to the DESIGN.md §2.3
  hold-start-buffering block verbatim.
- Item 2: implemented as a per-press arm consumed by the hold it
  starts (holdArmed). Confirmed at runtime, both edges: (a) hold
  completed with Z still down and a second trunk in range — no new
  hold, zero struggles, until release + repress (fresh 300ms hold on
  the second trunk); (b) enemy-interrupted hold (steal-proof
  interrupter) — one struggle penalty for the interrupt itself, no
  auto-restart while Z stayed down, release + repress started a
  fresh hold with no extra penalty. Note: per the literal spec (arm
  consumed by holds only), a press that fires an instant tap or a
  rescue stun still arms a later hold if the button stays down —
  flagging in case design wants taps to consume the arm too.
- Item 3: ruling entry appended verbatim below.

2026-08-03 — Fresh press per hold ruled (handoff
2026-08-03-e): held tag button never chains holds;
buffering forgives timing, not commitment. Applies after
completion, abandonment, and enemy interrupts alike.

## 2026-08-03 — Handoff 2026-08-03-f applied

- Sequence check: 2026-08-03-e applied (entry above) ✓.
- Item 1: §2.3 fresh-press block amended to the "one press, one
  action" general form verbatim.
- Item 2: arm now consumed by the first action produced — instant
  tap, rescue stun, or hold start. Verified all three ordered cases
  at runtime: (a) tap with Z held → no hold at a trunk until
  release + repress; (b) rescue stun with Z held → dropped heavy
  targeted but no auto-hold; repress holds it; (c) press in empty
  space, run to a trunk, stop → waiting arm honored, hold starts
  (-d behavior unchanged).
- Item 3: ruling entry appended verbatim below.

2026-08-03 — One press, one action (handoff 2026-08-03-f):
the tag-button arm is consumed by the first action it
produces (tap, stun, or hold start); unconsumed arms wait
per -d. Closes the tap/stun boundary the code track flagged
on -e.

## 2026-08-04 — Handoff 2026-08-03-g applied (after BOSS-SPEC stop)

- Sequence check: 2026-08-03-f applied (entry above) ✓.
- STOP/RESUME: item 2(d) referenced BOSS-SPEC, absent from HEAD and
  all history (searched: ls, find, git log --all, grep, git log -S;
  only references were BRIEF-ART-03's dangling ones). Human added
  BOSS-SPEC.md and chose to keep carpet IMPLEMENTATION deferred
  (design tweaks expected); 2(d) therefore executed as a
  spec-consistency read. BOSS-SPEC.md committed with this handoff.
- Item 1: dash-trajectory block appended to DESIGN.md §3.2 verbatim.
- Item 2 verified at runtime: (a) ledge dash — flat at constant y
  for the full duration, past the edge, then fresh fall from vy 0;
  (b) dash mid-fall — 206px/s descent arrested to flat instantly,
  fresh fall on end; (c) jump pressed mid-dash never fires mid-air;
  the buffered press fires on the first frame after a grounded dash
  end (first (c) run "failed" — root cause was a legitimate
  mezzanine-underside head bonk at the test venue, not a code
  fault); air-dash cap isolated from cooldown — one air dash per
  airborne period, second attempt blocked even with cooldown
  elapsed, refresh on landing, grounded chaining unaffected.
- Item 2(d) spec-consistency: Paper Carpet (BOSS-SPEC, phase 1) is
  a reduced-traction floor zone (slipFactor). Grounded dash sets
  velocity directly and zeroes acceleration — traction has no lever
  on it; flat-air dash can no longer sag onto the carpet mid-flight
  since gravity is suspended, so "dash crosses it clean" holds in
  BOTH cases and the -g ruling strengthens it. Forward note for the
  boss brief: implement slipFactor as accel/decel scaling (not
  velocity clamps) and dash immunity falls out for free.
- Item 3 findings: (a) routing — empirical max jump+air-dash reach
  from a mezzanine edge ≈136px vs 368px minimum inter-strip gap; no
  strip-to-strip skips; heavy-items-stay-low intent intact (a flat
  dash ZEROES vy and never aids ascent); (b) fairness — belldesk (c)
  readout GREEN: escape 11464ms ≥ traverse 10872ms + 500ms margin
  (92ms slack). The in-code traversal model stays valid and
  conservative: -g only restricts dash availability and grants no
  new horizontal speed. Coatroom unaffected.
- Item 4: ruling entry appended below with findings filled.

2026-08-03 — Horizontal dash ruled (handoff 2026-08-03-g):
gravity suspended, vy zeroed at start, fresh fall on end,
one air-dash per airborne period (refresh on landing),
jump-during-dash buffered not honored mid-air. Bell Desk
routing and fairness inequality re-verified under the new
traversal model: routing clean — max jump+air-dash reach
≈136px against 368px minimum mezzanine gaps, no unintended
skips, heavy-stays-low intact; fairness GREEN — escape
11464ms ≥ traversal 10872ms + 500ms margin (92ms slack),
traversal model unchanged and conservative.

## 2026-08-04 — Dash feel tuned (human, via panel paste)

dashSpeed 340→400, dashDurationMs 140→200; all other values
unchanged. Downstream -g numbers refreshed: belldesk (c) readout
GREEN with slack 92ms→1364ms (traverse 10872→9600ms — a faster
player makes the inequality easier); coatroom GREEN (traverse
8000ms). Routing: per-dash distance 47.6→80px, est. jump+air-dash
reach ≈190px — still well under the 368px minimum mezzanine gap,
no new skips. Afterimage cadence (duration/3) unaffected.

## 2026-08-04 — Handoff 2026-08-04-a applied

- Sequence check: first handoff of 2026-08-04; prior day closed at
  -g ✓.
- Item 1: tier scoring implemented — tier2ScoreFactor 1.5 /
  tier3ScoreFactor 2.0 in tuning.js, results math scores
  standardItemScore × factor × adaptive multiplier. heavyItemScore
  (300) removed as superseded — nothing else consumed it. DESIGN.md
  §3.2 updated. Verified live: +100/+150/+200 at 1.0×.
- Item 2: confirmation copy replaced verbatim ("Let's gooooo!",
  five o's) and marked canon in-code; captain's beat copy untouched.
  Verified live.
- Item 3: BRIEF-04 (Collectibles System) read and now tracked.
  Summary: three §4 collectibles level-agnostic — NFC Tags (coin;
  Tiled `collectibles` layer + stun drops; magnet pickup; 50/tag ×
  adaptive), Contact Card (rare wave-spawned auto-return of the
  MOST-ENDANGERED item via priority chain, streak-neutral like
  rescues), Insights Report (×2 score 10s, multiplicative,
  own HUD chip that never masks the adaptive readout) + a shared
  collectible registry, tuning sliders, results lines, AudioBus
  events, and DESIGN §4 / maps-README amendments on execution.
  Renames Contact Card / Insights Report authoritative over §4.
  EXECUTION GATED on human go. Flags for that session: (a) the
  existing results "tags collected" counter increments on ITEM
  check-ins (it always equals items returned) — BRIEF-04 §4 assumes
  it means NFC tags, so its semantics must be split on execution;
  (b) the Contact Card priority chain references item EXPIRY, which
  exists in DESIGN §2.1 but has never been implemented in code —
  needs a ruling or the chain's step 3 re-anchored (e.g. oldest
  item) when the brief runs.
- Item 4: dash-end skid left as-is — punch-list judgment.
- Item 5: ruling entry appended verbatim below.

2026-08-04 — Post-BRIEF-03 rulings (handoff 2026-08-04-a):
tier scoring 1×/1.5×/2× by weight tier; dash confirmation
copy ruled 'Let's gooooo!' (Chexology catchphrase),
replacing the code-track placeholder; BRIEF-04 announced
and tracked (execute on human go); dash-end skid deferred
to punch list. BOSS-SPEC dangling-reference catch noted as
the referenced-artifact check's first live save.

## 2026-08-04 — Tap windup adopted (human ruling, in-session playtest)

The instant tap is now a fast tap: effect lands on the tap anim's
2nd frame, Chexy rooted for the full 2-frame animation. Artist
retimed frames during the playtest loop to 80ms/frame (effect at
80ms, root 160ms) — frame durations in the .ase ARE the mechanic;
code reads timing from the anim. Whiff rule: the effect re-validates
at landing, so an item stolen mid-windup is a clean no-penalty miss.
Scope rulings: rescue stuns stay truly instant (§2 item 4b lock);
hold completions unaffected. Without tap art the tap degrades to
instant. DESIGN.md §2.3 amended. Verified: frame-2 effect timing,
forced stop and clean control return, whiff-on-steal, no console
errors.

## 2026-08-04 — Handoff 2026-08-04-b applied

- Sequence check: 2026-08-04-a applied (entry above) ✓.
- Item 1: §2.3 windup re-validation language amended to the explicit
  no-retarget form; code comment tightened to match (behavior was
  already press-time-target-only — no code change needed).
- Item 2: confirmed at runtime — hitstop and particle burst both
  fire 83ms after press (the effect frame), never on press.
- Item 3: forward note appended to BOSS-SPEC.md's tuning-surface
  section verbatim.
- Item 4: ruling entry appended verbatim below.

2026-08-04 — Tap windup ratified (handoff 2026-08-04-b):
80ms to effect / 160ms rooted, .ase frame durations are
the mechanic's timing authority; whiff = clean miss with
no retarget (press-time target only); hitstop on effect
frame; boss telegraph budgets carry the windup tax.
Supersedes 'instant tap' language for standard items;
rescue-stun instancy and hold mechanics unchanged.

## 2026-08-04 — Dash level-gating fixed (human report: dash in L1)

The unlock was implemented as a global flag, so a persisted unlock
also enabled dash on Coatroom replays — over-granting §3.2's
"persists for all SUBSEQUENT levels." Fix: new dashAllowed map
property (set on belldesk; every later level should declare it; the
Coatroom omits it), one shared isDashAvailable() gate used by BOTH
player input and the (c) fairness traversal model, so the readout
never counts a dash the player can't perform. Panel dashEnabled
stays a pure debug override. Verified with unlock persisted:
Coatroom X press inert + fairness excludes dash (traverse 10667ms,
green); Bell Desk dashes (vx 400) + fairness counts it (9600ms,
green). Earlier -g note "coatroom stays green post-unlock" is moot
under the gate but remains true either way.

## 2026-08-04 — Rescue-drop embed fix + risk-priority targeting (human)

Bug: a floor-hugging (or platform-overlapping — enemies fly through
tiles) carrier dropped its item at enemy.y+10, embedding large items
in solid tiles where arcade separation can't recover them; the item
sat in the floor until an enemy lifted it out. Fix: placeItemClear()
walks the drop position upward out of any colliding tile before the
pop. Verified: floor-level carrier drop now rests with the trunk
bottom exactly at floor top.

Ruling (human, in-session): auto-target picks the most AT-RISK
valid target in radius, not the nearest — an active steal (carrying
ticket) outranks any tap; an item an enemy has locked outranks idle
items; nearest wins within a class. Press near an active steal
always goes to the rescue. DESIGN.md §2.3 targeting bullet amended.
Verified: carrier outranks a nearer idle item (Z stuns, frees the
prey, idle untouched); a locked item outranks a nearer idle item.

## 2026-08-05 — Handoff 2026-08-04-c applied (arrived after -d; order restored)

- Sequence check: -b applied above; -d arrived first and was HELD
  per protocol until this handoff closed the gap. Applied in order:
  -c now, -d next.
- Item 1: §3.2 dash persistence sentence amended verbatim — matches
  the dashAllowed implementation already shipped (0ee2cdb).
- Item 2: ratified as shipped — hold anim 3f/60ms looping charge
  (artist's call over the 4-frame spec); tap-flash frozen-flag guard.
- Item 3: reference-art disposition rule added to CLAUDE.md workflow
  rules verbatim; the three chexy-tap*.png files remain untouched —
  the human applies the rule to them.
- Item 4: ruling entry appended verbatim below.

2026-08-04 — Dash is level-gated via dashAllowed (handoff
2026-08-04-c): ability sets are per-level so records stay
comparable; Coatroom certified dashless, readout corrected.
Hold anim ratified at 3f/60ms; tap-flash guard ratified.
Reference-art disposition rule added to CLAUDE.md.

## 2026-08-05 — Handoff 2026-08-04-d applied

- Sequence check: -c applied (entry above; -d was held until -c
  arrived) ✓.
- Item 1: ratified as shipped (90efffa) — drop de-embed walk-up and
  risk-priority auto-target with the §2.3 amendment as applied.
- Item 2: one-endangerment-ranking rule added to DESIGN.md §2.4
  after the target-lock block verbatim. Code: ranking extracted to a
  single itemDangerRank() (carried 0 / enemy-locked 1 / at-rest 2);
  auto-target now consumes it; BRIEF-04's Contact Card and the
  urgency-arrow weighting consume the same helper when they land.
- Item 3: placement-validity gate added to assets/maps/README.md
  verbatim. Refactor: spawnItem now routes through placeItemClear
  (stun-drops already did) — a deliberately embedded spawn (trunk at
  y=250, inside the ground) now walks up to rest exactly on the
  floor; normal spawns unchanged; ranking classes verified 0/1/2.
- Item 4: ruling entry appended verbatim below.

2026-08-04 — Play-session pair ratified (handoff
2026-08-04-d): risk-priority targeting (windup made target
choice a commitment; the radius now triages) + drop
de-embed. Two standing rules extracted: single shared
endangerment ranking (tap/card/arrows must agree), and a
universal placement-validity gate (bug family closed at
two members).

## 2026-08-05 — Handoff 2026-08-04-e applied

- Sequence check: -d applied (entry above) ✓.
- Item 1: pause menu built — RESUME / EXIT TO SHIFT SELECT with
  marker navigation (arrows + Enter/Z; ESC/P still resumes
  directly). Exit opens the one-step confirm ("Abandon this rush?
  Progress won't be saved." / CONFIRM / CANCEL) with the cursor
  defaulting to CANCEL since Exit sits one slot from Resume; ESC in
  the confirm backs out. No Retry exists in the pause menu (none
  was present to sit above).
- Item 2: abandonment verified — abandoned belldesk run recorded
  nothing (no store key, seeded coatroom best untouched, no results
  screen); unlocks untouched; per-run state (score/losses/adaptive/
  multiplier/timer) fresh on the next run. AUDIO FINDING: stopMusic
  never reset the duck flag, so a results-screen duck leaked into
  any cross-level music start (started at 30% volume) — latent
  since ducking shipped; fixed in stopMusic and verified end-to-end
  (ducked at results → false after exit → next level starts
  un-ducked).
- Item 3: single shared teardown implemented — teardownRun(dest)
  serves results-Retry, results-Continue, and pause-Exit; verified
  retry resets cleanly through the same path.
- Item 4: ruling entry appended verbatim below.

2026-08-04 — Pause exit ruled (handoff 2026-08-04-e):
Exit to Shift Select with one-step confirm; abandoned
rushes record nothing (no partial stats, no results);
unlocks untouched; single shared teardown path for
exit/retry.

## 2026-08-05 — Restart Level added to the pause menu (human, in-session)

RESUME / RESTART LEVEL / EXIT TO SHIFT SELECT. Restart abandons the
live run exactly like Exit, so it shares the -e one-step confirm
(cursor defaults to CANCEL) and the single teardownRun path — just
the retry destination. Verified: restarting a PAUSED scene comes
back fresh and running (score 0, full clock, unpaused, panel
hidden); 3-option nav wraps; exit path unchanged.

## 2026-08-05 — Handoff 2026-08-05-a applied

- Sequence check: first handoff of 2026-08-05 (the -b that arrived
  first was HELD until this closed the gap) ✓.
- Item 1: tagsCollected no longer bumps on check-ins — "Tags" is the
  BRIEF-04 collectible counter; itemsReturned confirmed as the single
  check-in source (verified: 3 check-ins → itemsReturned 3,
  tagsCollected 0). Results show TAGS COLLECTED only when nonzero,
  per the BRIEF-04 minor-line convention, on both layouts.
- Item 2: expiry struck per order — §2.1 loss line, §2.4 arrow
  language (steal-threat ladder), §2.4 ranking refinement (at-rest
  age, oldest first — also noted on the itemDangerRank helper),
  BRIEF-04 §2 chain ("longest at rest"); §8 v2 line added verbatim;
  cardLingerMs untouched. FLAGGED, not silently edited (outside the
  ordered list): §2.3's whiff enumeration still says "(stolen,
  expired, despawned)" — expired is now dead-letter there; and §3.1
  Coatroom flavor "before timers expire" reads like per-item timers
  that never existed. Strike both in a future amendment or leave as
  color — design chat's call.
- Item 3: ruling entry appended verbatim below.

2026-08-05 — BRIEF-04 pre-flight rulings (handoff
2026-08-05-a): 'Tags' counter = collectible pickups
(returns already cover check-ins); expiry ratified OUT of
v1 — steals are the sole loss channel, matching five weeks
of code reality and the fairness stack's 'every loss is a
declined chase' contract; endangerment third class =
longest at rest; guest-patience expiry filed to v2.

## 2026-08-05 — Handoff 2026-08-05-b applied

- Sequence check: -a applied (entry above; -b was HELD until -a
  arrived) ✓.
- Item 1: teeter implemented — supported-fraction trigger
  (teeterSupportFraction 0.5, on the panel), per-half support
  comparison picks the drop side, sprite faces the drop with the
  facing variable untouched (input restores it instantly), pure
  visual, replaces only idle. 4 frames from the .ase (90/120/150/
  120ms), loops. Verified: centered = idle; right/left overhang =
  teeter facing the correct drop; movement overrides with input
  facing; a hold started on the edge shows hold, not teeter.
- Item 2: 'teeter' added to the sprites README tag list with its
  trigger note.
- Item 3 answer (fell out, reporting for ratification): the
  deferred-hold wait state IS idle-equivalent — Z held with no
  heavy target in range on an edge shows teeter (arm stays live);
  the moment an actual hold starts, hold wins. Rationale from the
  code shape: the wait state doesn't freeze Chexy, so it inherits
  idle's costume — teetering while waiting reads as "ready but
  wobbling," which fits the buffered-intent fiction.
- Item 4: ruling entry appended verbatim below.

2026-08-05 — 'teeter' edge-idle animation added (handoff
2026-08-05-b), artist-initiated: idle-only replacement,
faces the drop, supported-fraction trigger (default 0.5),
zero mechanical effect. First art-track-led feature.

## 2026-08-07 — First real music track: coatroom.mp3 (WIP, usable)

Human added assets/audio/music/coatroom.mp3 (28.8s stereo loop). Zero
code changes — it matches the documented drop-in convention
(music/<levelId>.<ext>). Verified: file wins over the chiptune stub on
Coatroom, loops, ducks to 30% under results and restores on retry;
Bell Desk (no file yet) still falls back to the stub un-ducked.
Partially retires the "final audio passes" polish-debt item for L1.

## 2026-08-07 — Handoff 2026-08-07-a applied

- Sequence check: first handoff of 2026-08-07; prior day closed at
  2026-08-05-b (no 2026-08-06 handoffs existed; IDs are per-day) ✓.
- Item 1: both stragglers de-drifted verbatim — §2.3 whiff
  enumeration now "(stolen or otherwise removed)"; §3.1 flavor now
  "before the rush timer runs out". Repo-wide grep confirms no
  expiry-as-item-loss language survives in DESIGN.md or BRIEF-04
  (only the §8 v2 entry and the legitimate rush-timer reference).
- Item 2: ratified as shipped — teeter wait-state (buffered arm
  stays live during teeter, closing -b item 3), pause confirm copy
  "Abandon your shift?", 16f run cycle, Coatroom music loop via the
  drop-in convention (L1 final-audio debt partially retired; L2 on
  stub).
- Item 3: export-pipeline note appended verbatim. Placement: the
  "Exporting from Aseprite" section of assets/sprites/README.md —
  the handoff said "the sprite-sync section of the anim/maps
  README"; no section by that name exists, and the content is
  sprite-export knowledge, so it went where the next person
  re-exporting will read it. Flagging the interpretation rather
  than guessing silently.
- Item 4: ruling entry appended verbatim below.

2026-08-07 — Housekeeping ratifications (handoff
2026-08-07-a): whiff enumeration and §3.1 flavor de-
drifted; teeter wait-state, shift-framed pause copy, 16f
run, and the first drop-in music loop all ratified.
Sequence check credited with catches three and four.

## 2026-08-07 — Handoff 2026-08-07-b applied

- Sequence check: 2026-08-07-a applied (entry above) ✓.
- Items 1–2: BRIEF-03 acceptance complete — human sign-off, no
  punch list; all six queued feel-checks closed as PASS with
  behavior kept as-is (tap windup texture, dash-end skid kept —
  suppression one-liner declined, loiter arrows unchanged,
  pause/restart/exit flow, teeter at 0.5, 60fps ×2 confirmed).
- Item 3: BRIEF-04 GO — executed this session (entry follows).
- Item 4: ruling entry appended verbatim below.

2026-08-07 — BRIEF-03 CLOSED with human sign-off, no
punch list (handoff 2026-08-07-b): Bell Desk accepted;
all six queued feel-checks pass as-is (windup texture,
skid kept, arrows unchanged, pause flow, teeter, 60fps).
BRIEF-04 cleared and ordered. The -b watch item is
formally retired.

## 2026-08-07 — BRIEF-04 executed: Collectibles System (Phase 3, code track)

Ordered by 2026-08-07-b item 3; consumes the -d shared endangerment
ranking and the -05-a pre-flight rulings (Tags counter = pickups;
expiry out of v1 — priority chain third class is longest-at-rest).

Shipped: one collectible registry (src/config/collectibles.js — a
future pickup is a data entry + effect hook; spawning, magnetism,
linger, pickup plumbing, and the debug overlay are shared). NFC
Tags: Tiled `collectibles` layer (5 placed in coatroom on the upper
routes) + one dropped per rescue stun (pop arc, rides the -d
placement-validity gate), magnet drift inside tagMagnetRadius,
tagScoreValue × adaptive, HUD icon+counter under the hangers.
Contact Card: wave-spawned only (2 in coatroom's back half),
cardLingerMs despawn with 2s blink warning, save picks the
MOST-ENDANGERED item via the shared ranking (carried > locked
nearest-to-dive > longest at rest; ties toward farthest-from-
player), pulls carried items out of the thief's grip, scores
normally with NO streak progress, chip + Success Green flight to
the return zone, two "got the text" guest lines added. Insights
Report: one wave-spawned high in coatroom, ×insightFactor on ALL
score gains for insightDurationMs via the new central addScore()
(multiplicative with adaptive, band untouched), own HUD chip beside
the adaptive readout with countdown ring in the final 3s, screen-
edge shimmer while active, insightEnd cue on expiry. Five new
tunables with panel sliders; five AudioBus events with placeholder
synths; results add CARDS USED / INSIGHTS CAUGHT minor lines when
nonzero. Amendments applied: DESIGN §4 renames + notes verbatim;
maps README documents the collectibles layer + wave entry shape.
Art hooks: 12×12 drop-in strips (nfc-tag/contact-card/
insight-report) with generated placeholders (orange diamond / white
card / yellow diamond).

ACCEPTANCE VERIFIED headless: all three live in a coatroom rush;
staged three-item scenario exact (ranks 0/1/2, the CARRIED item
saved from the thief's grip, others untouched, streak unchanged,
card bubble fired); insight gain measured 200 = 100 × 1.0 adaptive
× 2.0 insight, chip clear of the multiplier readout (right edge
424 < 441) with the readout visible; magnet pickup +50 and counter;
stun drop coexists with the -b poof; card blink at 0.25 alpha then
despawn; zero console errors. First staging attempt invalidated
itself (steal cooldown from a prior test kept the thief loitering
— the pick was correct for the field that existed); re-staged with
the cooldown cleared. 60fps at ×2 remains the human's check, per
precedent.

## 2026-08-07 — Handoff 2026-08-07-c applied

- Sequence check: 2026-08-07-b applied (entry above) ✓.
- Item 1: BRIEF-04 ratified as shipped (178c857); export-note
  placement ratified where it landed, no maps-README mirror.
- Item 2: unknown audio events now console.warn once per name per
  session (seated in the synth fallback — the last stop after file
  lookup, so both resolution layers are covered). Verified: three
  plays of a bogus event produced exactly one warning.
- Item 3: Bell Desk populated data-only, zero code — 6 NFC tags on
  the mezzanine routes including the (890,130)/(960,130) pair in
  the gap off strip-2's edge (x=848) so one flat air-dash line off
  the ledge sweeps both; insight at t=70 on the upper accent
  (1240,78 — high/awkward); cards at t=100/135 in the trunk-heavy
  back half. Verified live: all 6 layer tags load, the three wave
  entries fire (1 insight at the accent, 2 lingering cards), clean
  console. Values untouched pending the human's play-check —
  placement, not tuning.
- Item 4: ruling entry appended verbatim below.

2026-08-07 — BRIEF-04 ratified as shipped (handoff
2026-08-07-c): registry + shared ranking + central
addScore all verified; the ranking's 'disagreement' during
acceptance was correct per true field state — the -d rule
holding. AudioBus unknown-event warning added. Bell Desk
populated with collectibles via data only, zero code,
per the inheritance design.

## 2026-08-07 — Handoff 2026-08-07-d applied

- Sequence check: 2026-08-07-c applied (entry above) ✓.
- Item 1: 'm' master mute — DOM-level listener (works on menus,
  gameplay, and while the Level scene is paused), persisted in the
  progress store as a preference (godMode rule inapplicable),
  independent of the sliders (verified: mute drives setVolume(0)
  with sliders untouched at [1, 0.5]; unmute restores 0.5).
  Persistent muted-speaker indicator (generated 10×10 icon, Gray
  500 at 0.7 alpha, bottom-right) on UIOverlay, Title, and Shift
  Select.
- Item 2: pause now PAUSES the track — position held (seek frozen
  through a 700ms pause window), resumed on unpause; menu SFX stay
  audible. Teardown interactions verified: exit-from-pause never
  resumes the level track (menu gets a fresh title start);
  retry-under-pause resumes cleanly through startMusic's same-track
  branch. Pause-under-results is UNREACHABLE (runOver early-returns
  before the pause keys) — reported rather than guarded.
- Item 3: title.mp3 wired as the menu-space track — starts on Title
  (deferred past the browser autoplay lock to the first keypress),
  continues through Shift Select without restarting (same sound,
  seek continuous), level tracks take over on rush start, and every
  return to the menu starts the title track from the top. Mute
  indicator confirmed on menu scenes.
- Bug found & fixed during verification: the new LevelSelect mute
  icon used GAME_HEIGHT without importing it — crashed the
  Title→Shift Select transition (masqueraded as input flakiness for
  two test runs before the exception was captured).
- Headless-verification note for the record: Phaser's volume setter
  schedules on the WebAudio gain node; in headless Chrome the gain
  read-back lags the scheduled value indefinitely, so volume
  assertions must intercept setVolume calls, not read gain back.
- Item 4: ruling entry appended verbatim below.

2026-08-07 — Audio QoL trio (handoff 2026-08-07-d):
'm' master mute with persistent corner indicator and
session persistence; music pauses (position-held) under
pause; title.mp3 wired as the menu-space track (Title +
Shift Select continuous, fresh start per menu visit).
Second human-composed track in the game.

## 2026-08-07 — Handoff 2026-08-07-e applied

- Sequence check: 2026-08-07-d applied (entry above) ✓.
- Item 1: §2.3 post-interrupt-grace block appended verbatim;
  iframesMs (1100) added to tuning.js with a panel slider. Flicker
  is alpha oscillation on the player sprite, driven per-frame from
  update() so it rides through the hold pose (it's on the sprite,
  not the animation); alpha is force-restored in endRun so results
  can never freeze mid-flicker.
- Item 2 boundaries, each verified by direct invocation of the
  contact handler (physics drift made overlap-based staging
  unreliable):
  · No grace → contact interrupts, one struggle, grace granted
    (~1042ms remaining at sample time).
  · Under grace → FIVE consecutive contacts left the hold intact
    with the struggle count unchanged at 1, and the tier-3 hold ran
    to completion (trunk tagged) inside the window — the "re-press
    + full hold + margin" budget holds in practice.
  · Enemy unaffected: not stunned, not displaced by us, still
    active (it moved only under its own seek).
  · Theft during a graced hold → quiet reset, NO struggle, thief
    carrying and gloating: the steal race and gloat-window rescue
    counter are untouched. Grace protects the body, never the item.
  · Movement exit under grace still abandons and still pays its
    penalty; a movement interrupt grants NO grace.
- Item 3: BOSS-SPEC tuning-surface forward note appended verbatim.
- Item 4 (watch item, logged not solved): deliberate hit-tanking —
  eating one struggle to buy a guaranteed hold — is now a
  purchasable trade priced at the multiplier drop + streak reset.
  Verified purchasable in exactly the intended shape (case B above
  IS the trade executing). If play shows it dominating, the lever
  is grace duration (iframesMs, on the panel), not the struggle
  price.
- Item 5: ruling entry appended verbatim below.

2026-08-07 — Post-interrupt grace ruled (handoff
2026-08-07-e): 1100ms interrupt immunity after a hold
interrupt, flicker-signaled; protects the body, never the
item; single struggle penalty per window; boss grab
respects grace. Closes the loiter-orbit interrupt loop —
the first hit is the price, the rest was the clock.

## 2026-08-09 — Handoff 2026-08-09-a applied

- Sequence check: prior chain closed at 2026-08-07-e; no 2026-08-08
  handoffs existed and IDs are per-day, so -a is correct ✓.
- Item 1: BRIEF-04 closed with sign-off after extended play; all five
  collectible tunables (tagMagnetRadius 20, tagScoreValue 50,
  cardLingerMs 8000, insightDurationMs 10000, insightFactor 2.0)
  locked at defaults. No code change.
- Item 2: tier-2 edge-arrow color ruled as-is. Flag retired — the
  LevelScene comment now cites the ruling and its rationale (arrow
  says "needs a hold"; tier identity rides silhouette + dots + meter
  speed) instead of reading as an open BRIEF-03 judgment call.
- Item 3: hit-tanking retired as a watch item, kept as a documented
  lever — the iframesMs tuning comment now records that play showed
  no dominance at 1100 and that later-level enemy density is what
  would change the math.
- Item 4: NFC glint deferred with NO debt entry, per order. Standing
  instruction for whoever exports next: if the icons file gains a
  second frame, wire the 2-frame loop (the collectible already
  renders frame 0 from a spritesheet, so it is a small anim
  registration + play on spawn).
- Item 5: ruling entry appended verbatim below.

2026-08-09 — BRIEF-04 CLOSED, human sign-off, values
locked at defaults (handoff 2026-08-09-a). Tier-2 arrow
color ruled as-is; hit-tanking retired as watch item (no
dominance in play), kept as documented lever. Every
shipped system is now played and certified. Remaining
build surface: lose anim, audio content, polish ledger,
and Phase 3's back half — Levels 3–5 and the boss.

## 2026-08-09 — Handoff 2026-08-09-b applied

- Sequence check: 2026-08-09-a applied (entry above) ✓.
- Item 1: garage design session logged verbatim below —
  pre-execution, resolving the "Read first" citation BRIEF-05
  arrived with (flagged on arrival as pointing at a not-yet-written
  entry).
- Item 2: BRIEF-05 touch-ups applied — "Read first" now cites this
  entry; §6.4 now cites this handoff instead of ordering a
  post-build log.
- Item 3: this entry.

2026-08-09 — VALET GARAGE DESIGN SESSION (design chat;
compiled into BRIEF-05). Core loop: request-queue
auto-scroll — guests text for cars, requests carry a
fairness lead time (spawn validation translated to scroll
coordinates, per-request green/red readout), tagged cars
drive off themselves. Rulings: (1) missed requested car =
1 lost item — the second loss channel, garage-scoped,
amending the -a steals-only ruling for auto-scroll levels;
(2) enemies hybrid — swarms obstruct only, elite stubs
untag tagged cars and carry the chip (rescue-stun returns
it; untags consume steal-initiation semantics, elites flee
WITH the scroll so interception holds); (3) vehicle riding
scoped to cars-as-platforms only, riding setpieces to v2;
(4) trailing edge pushes, never harms; hold caught by the
edge = quiet reset, no struggle; (5) hold-tier luxury cars
exist SPARINGLY (2–3/rush, 1.5× lead) — holding-while-
scrolling is the level's signature tension; (6) scroll
speed constant for v1, per-section knob built but flat.
Endangerment ranking gains a garage-scoped scroll-distance
input. dashAllowed: true — first map under the -c
convention.

## 2026-08-09 — BRIEF-05 session 1 executed: garage scroll/request core

Ordered by the human ("Start") after -b logged the design session.
Everything through the §5 seam; blockout + wave arc are session 2.

Shipped: GarageScene extends LevelScene (scene key 'Garage', routed
via a new sceneKey field on the level roster; UIOverlay now resolves
the active gameplay scene from the registry instead of a hardcoded
'Level'). Scroll clock with float accumulator + rounded camera (the
jitter-saga discipline); rush duration = scroll length. Cars are the
item vocabulary AND platform vocabulary: immovable bodies the player
stands on, tinted silhouette rects (sedan/SUV/luxury) in garment
hues, placement-gated. Request lifecycle: wave 'request' entries →
HUD chips (car body color, gold dot = hold-tier) → tag = score once
+ chip + drive-off after driveOffDelayMs (the elite-vulnerability
window — an implementation-necessary tunable the brief implies;
flagging) → resolve green at pull-out; a requested car crossing the
trailing edge = the garage loss channel (bubble/struggle/hangers).
Request fairness precomputed at load in scroll coordinates
(max-effort traversal from the trailing edge at fire time + grace,
luxury ×luxuryLeadFactor with the hold added), RED entries
console-warned with the fix direction, panel readout replaces the
(c) inequality on this level (which cannot apply — no vertical
escape), per-request green/red rings in the fairness overlay.
Enemies: swarms (flock drift, obstruct only — hold interrupts +
grace inherited); elites (V1 art + raffle-red accent) lock the
nearest TAGGED car with loiter/cooldown semantics, untag on strike,
carry the chip overhead fleeing WITH the scroll (encumbered +
scrollSpeed — always slower than the player), rescue-stun returns
the chip in flight and auto-reapplies streak/score-neutrally, NFC
drop per stun as everywhere. Scroll-aware endangerment (level-
scoped): requested cars rank by time-to-exit, <4s = carried-class;
Contact Card saves the most-endangered REQUEST and never wastes on
dressing. Trailing edge pushes (clamp + nudge), never harms; a hold
caught by the edge quiet-resets with zero struggle. DESIGN §2.1 /
§3.3 / §2.4 amendments applied per BRIEF-05 §6.

Verified headless: scroll advances with an integer camera; all 10
skeleton requests green; tag → +100/chip/drive-off/green resolve;
forced miss → exactly one loss + angry bubble + red resolve; luxury
300ms hold; edge-caught hold quiet-reset (struggles 0, player
clamped to the edge); elite loop end-to-end with no double score
(the "score drift" in the test was the player instantly collecting
the stun's NFC drop — correct); near-edge request ranks 0 and the
card picks it; pause/exit teardown works from the Garage scene via
the registry; coatroom and belldesk regression-clean. Judgment
calls flagged: driveOffDelayMs 2500 default; dressing-car tags
score carBonusScore with no streak and no bubble; chip teal
0x006483; elite accent 0xd94848 pending V3 art. Map and waves are
SESSION-1 SKELETONS — session 2 replaces them with the real 8–10
screen blockout, roof routes, dash gap, and the four-phase arc.

## 2026-08-09 — BRIEF-05 session 2 executed: garage blockout + wave arc

The real level replaces the session-1 skeleton. Map: 288×17
(4608px ≈ 9.6 screens; rush = 206s ≈ 3:26 at scrollSpeed 20).
Three tiers (ground / row-12 decks / row-9 decks, every step ≤48px,
mid decks overlapping a lower deck for clean routes), 22 cars (3
luxury; 4 parked on decks for the cross-tier phase; exact parking
heights — no float, since cars are gravity-free and never settle),
concrete-pillar dressing, 6 roof-route NFC tags including the
showcase pair strung across the dash gap. Wave arc per §5: (1)
0:00–0:45 three sparse standard requests, swarms only; (2)
0:45–1:45 density up, luxury #1, elites introduced one at a time;
(3) 1:45–2:45 overlapping requests across tiers (two deck cars),
luxury #2, elite pressure; (4) final stretch — request cluster +
luxury #3 as the multiplier bait with exactly-sufficient lead
(readout margin 1.1s, deliberately the tightest in the level).

BUG found & fixed during verification: LevelScene's WaveRunner
handler swallowed the entry argument (spawnEnemy: () =>
this.spawnEnemy()), so the garage's elite flag never arrived and
every wave spawn became a swarm. One-line passthrough fix; elites
now spawn one per entry as designed.

Showcase gap tuned during verification: 128px → 112px. Perfect-play
math clears 128px by ~66px, but harness runs with realistic timing
jitter landed 1–2px short at ground level — a showcase should be a
trick, not a frame trap. At 112px the gap remains dash-MANDATORY
(jump-only same-height reach ≈107px) and a frame-exact run verified
in-engine lands on deck G sweeping a line tag; real 60fps input has
3× the timing granularity of the harness. Human feel-check per
acceptance.

Verified: readout 15/15 green; all 22 cars parked bottom-exact on
240/192; forward phase warp shows the arc populating correctly
(1 live request in phase 1 → 4 overlapping in phase 3 → cluster)
with elites present from phase 2; scroll completion → RUSH
SURVIVED results; zero console errors. Remaining before the brief
closes: the human punch-list play session (edge-push feel, dash-gap
feel, 60fps ×2, full-rush pacing).

## 2026-08-09 — Garage punch list round 1: FAILED ("slow, no challenge") — data-side retune executed

Human verdict after the first play session: not fun — very slow, no
challenge. Diagnosis: the systems held; the NUMBERS starved them.
(1) scrollSpeed 20 = 13% of player speed — the edge never threatened;
(2) 15 requests/206s with 1–4 live — long idle gaps; (3) request
leads scheduled at 5–10× the fairness floor — the readout ensures
FAIR, nothing ensured INTERESTING; (4) elites structurally starved
(2.5s drive-off window + spawn-behind + 6s cooldown ≈ no strikes);
(5) swarms decorative (they only threaten holds; 3 holds/rush).

Retune (data + knobs, no design changes): scrollSpeed 20→45 with the
map stretched to 9024px (rush 3:10 preserved; 2.25× urgency); 44
cars (8 on decks, 6 luxury), two dash-showcase gaps; 28 requests
SOLVED against a tension band (target available/required per phase:
2.4 → 1.9 → 1.5 → 1.35, lux bait hottest) instead of hand-guessed —
measured ratios 1.04–2.06, zero slack; driveOffDelayMs 2500→5000
(the tagged backlog persists, so elites have something to hunt);
garage stealCooldownMs map override 3500; elites 5→8 (3–5 concurrent
through the back half in verification); swarm waves 12, counts 3–5.
NEW SYSTEM from the lesson: the request readout gains a tension-band
signal — green-but-SLACK (yellow ring, panel count) when available
lead exceeds 3× required, so over-generous scheduling gets flagged
the way unfairness does. Verified: 28/28 green / 0 slack, parking
exact, full rush → RUSH SURVIVED, zero console errors.

Honest notes for round 2: tightest solved ratios sit at 1.04 (green
but <1s slack — deliberately hot; raise the floor to ~1.2 if it
reads as ambush); steady-state live requests estimate ~2 rising to
3+ in the rush phases — if it still feels sparse the lever is
request count, not lead times. Needs design-chat rulings: swarm
teeth (contact-slow would be a new rule — "slow nothing permanently"
stands until amended), elite spawn side (currently behind), and
whether the tension band's 3× slack threshold should be canon.

## 2026-08-10 — Handoff 2026-08-09-c applied

- Sequence check: 2026-08-09-b applied; -d arrived mid-application
  and correctly ordered -c first (its item 0) ✓.
- Item 1: round-1 retune ratified; tension-band instrument permanent
  (threshold tunable). Lesson on the record: fairness readouts are
  floors; tension bands are targets; levels need both.
- Item 2: swarm contact-slow implemented per spec — swarmSlowFactor
  0.4 / swarmSlowMs 600 on the panel; refresh-not-stack (the timer
  resets, the cap never compounds); NOT interrupt-class (no hit
  anim, no struggle, no grace grant or shield — verified struggles 0
  and grace untouched through contact); dash immune and starting a
  dash cancels an active drag; expiry self-restores (Player.update
  re-asserts full maxVelocity every frame). §2.4 garage note
  amended. Verified: 150 → 60 px/s on contact, full speed back at
  expiry, dash-cancel confirmed.
- Item 3: elites now spawn AHEAD (leading edge + margin), flying
  back toward the tagged backlog — never behind the player.
  Verified spawn x past the view's right edge.
- Item 4: band floor held at 1.04 for round 2, per order.
- VERIFICATION-ENVIRONMENT FINDING, logged so it never bites again:
  fresh headless profiles never ran the Bell Desk beat, so
  dashUnlocked was unset and THE DASH WAS SILENTLY LOCKED in every
  prior garage test — the session-2 "dash-mandatory gap: MADE IT"
  was actually a dashless frame-perfect edge-clip. Re-verified with
  the unlock seeded: with-dash crossing lands 90px past the far
  deck (comfortable); dashless remains a razor-thin edge-clip only.
  The showcase stands as effectively dash-gated. Garage test
  batteries must seed dashUnlocked.
- Item 5: ruling entry appended verbatim below.

2026-08-09 — Garage round 1 FAILED punch list; retune
ratified (handoff 2026-08-09-c). Fairness-floor-as-
ceiling lesson logged; tension-band instrument permanent.
Swarms gain contact-slow (position is the garage's
currency); elites spawn ahead (legible intent); band
floor held hot for round-2 calibration.

## 2026-08-10 — Handoff 2026-08-09-d applied

- Sequence check: 2026-08-09-c applied and committed first, per this
  handoff's own item 0 ✓.
- Item 2: REQUEST GATE implemented as a single GarageScene
  isTaggable override (requested-unmet only). The base scene routes
  auto-target, glow, whiff-lock, tap completion, hold gating, and
  the danger ranking through isTaggable, so inert cars vanish from
  all of them at once. The garage arrow pass and Contact Card
  already filtered to live requests. Unrequested-tag bonus removed
  (completeTag else-branch, carBonusScore tunable, panel slider).
  Elite untags untouched: tagged=false with requested kept =
  requested-unmet, so the gate re-opens. BRIEF-05 §1/§3 and DESIGN
  §3.3 amended.
- Item 3 verified (staged headless, dashUnlocked seeded per the -c
  finding): pinned at the leading edge with tap spammed EVERY frame
  while cars scrolled through the target radius — 654 frames with
  an inert car in range produced 0 targets, 0 tags, 0 score
  (tag-everything demonstrably dead, not just untested). Firing a
  request made the same spam tag that car at once (+100 standard,
  no bonus path). Elite-untag transition re-opened the gate and the
  re-tag paid nothing (score-once held). Ranking/card verified, not
  assumed: with no live requests mostEndangeredItem() returns null
  even amid dressing and tagged cars; with one live far request it
  picks exactly that car; inert cars rank class 2. No console
  errors.
- Item 4: all other levers held (request count, band floor 1.04,
  overlap, gap width) — one structural change per round.
- Item 5: ruling entry appended verbatim below.

2026-08-09 — Round 2: request gate ruled (handoff
2026-08-09-d). Cars taggable only while their request is
live; unrequested bonus removed; auto-target blind to
inert cars. Tag-banking dead, position-banking is the
skill. One structural change per round — other levers
held for round-3 calibration.

## 2026-08-10 — Handoff 2026-08-09-e applied

- Sequence check: 2026-08-09-d applied and committed first ✓.
- Item 1a: elite untags INITIATE only while any part of the target
  car is on-screen (carVisible guard in onEnemyTouchItem). An elite
  whose target is offscreen falls into the standard loiter grammar
  (the loiter branch now also covers not-visible) and dives once
  the car is visible. Locking an offscreen car remains legal —
  initiation is what gates. Verified: elite pinned overlapping an
  offscreen tagged car, cooldown cleared, 1.2s — no rip, lock held,
  loitering; same elite the moment the car warped on-screen —
  rip landed.
- Item 1b: SAFE-AT-EDGE — a tagged car whose left edge reaches the
  trailing edge banks (safe flag): elites can neither lock nor rip
  it (acquire skips safe; a lock releases if its car goes safe
  mid-flight and re-acquires per normal rules); cue is a brief
  Success Green chip flash (0x12b76a, 500ms). Safe cars stay
  tagged, so the shared ranking, arrows, and Contact Card drop
  them with no new plumbing (all three skip tagged cars). The
  stun-rescue chip flight composes: a chip re-applying to a car
  that meanwhile reached the edge re-tags it and it banks on the
  next frame. Verified: bank fires with the car half-exposed; a
  cooldown-cleared elite pinned on the safe car for 1s locked
  nothing and ripped nothing; card pick null / rank 2 / taggable
  false / arrow predicate false.
- Item 2 report (carried-chip escape — behavior that falls out):
  NEITHER named shape exactly. The revert happens at RIP time (the
  car goes requested-unmet the moment the chip is torn), so when a
  carrier exits nothing remains to auto-revert — escape only
  forfeits the stun-rescue shortcut (chip auto-reapply). The chase
  is contestable for its entire flight: flee speed is
  enemySpeed×carrierSpeedFactor + scroll (27.5px/s + scroll) vs
  player 150, and the only escape hatch is the LEADING edge (+48px)
  — never the trailing edge. Verified end-to-end: carrier fled
  forward at 28px/s (scroll frozen), exited ahead, chip destroyed,
  car left requested-unmet and immediately re-taggable. Read as
  consistent with BRIEF-05 §2's interception guarantee; flagged for
  a ruling only if the design chat sees a conflict.
- Item 2, generator guard: static sweep of all 28 garage requests —
  worst case fires with the car 98px (2.2s) ahead of the trailing
  edge; all margins positive. Structurally, a car cannot enter
  already-safe: safe requires tagged, tagged requires a live
  request (the -d gate), and fully-exited unrequested cars are
  destroyed before fireRequest could resolve them.
- Item 3: ruling entry appended verbatim below.

2026-08-09 — Visibility rules for elites (handoff
2026-08-09-e): untags initiate on-screen only; tagged
cars are SAFE once any part reaches the trailing edge
(banked, locked, cued). No consequential elite action
offscreen — the ambush channel is closed and the
trailing edge becomes the garage's return-zone moment.

## 2026-08-10 — Handoff 2026-08-09-f applied

- Sequence check: 2026-08-09-e applied and committed first ✓.
- Item 1: carried-chip semantics ratified as implemented — rip-time
  revert; the chase prize is the auto-reapply (labor + position,
  near the edge potentially the bank), never the car as hostage.
  Noted on the elite AI comment in GarageScene, including the ruled
  round-3 lever if near-edge rips read as ambush: elite target
  preference (bias away from near-safe cars), not the revert model.
- Item 2: no README existed anywhere in the repo or its git history
  (root README.md/TESTING.md never added; no historical .md carries
  a testing-notes section) — held per the referenced-artifact check
  and asked; human ruled: create the root README.md. Created with a
  minimal skeleton (title, run commands) and a Testing notes section
  carrying the rule verbatim: "seed progression explicitly;
  fresh-profile defaults are a test hazard, not a baseline."
- Item 3: ruling entry appended verbatim below.

2026-08-09 — Carried-chip economy ratified (handoff
2026-08-09-f): rip-time revert, chase wins labor not
hostages; near-edge rips are the intended clutch beat.
Test profiles must seed progression state (dashUnlocked
lesson). Garage cleared for round 3 with levers held:
request count, band floor, overlap, gap width.

## 2026-08-10 — Handoff 2026-08-09-g applied

- Sequence check: 2026-08-09-f applied and committed first ✓.
- Item 1: dash-through-vehicles implemented as a collider process
  callback — vehicle separation suspends while dashing (grounded or
  air alike); the tile collider is untouched, so structure stays
  solid. Extend-until-clear: GarageScene.update pushes dashUntil
  forward while the dash would expire overlapping a vehicle, so the
  dash ends on its own terms (fresh fall, -g air rules) once clear —
  never embedded, never a vertical pop (vy is pinned 0 for the whole
  dash). Dash-through ignores car state (safe/tagged/inert identical)
  and never tags. One-time tutorial bubble on the first garage rush,
  persisted like the Bell Desk beat (garageDashTipShown in progress):
  "Dash goes THROUGH cars! Let's gooooo!"
- Item 2: anti-crush guarantee — the pinch (edge push pressing +
  vehicle ahead-blocking + structure overhead within the rise needed
  to clear the car) makes the VEHICLE yield, latched until Chexy is
  clear; structure tiles never yield. In open sky the car stays solid
  (jump or the standable roof is the escape). Blockout rule appended
  to assets/maps/README.md: tiles may never enclose an edge-reachable
  pocket; vehicles may (they yield).
- Item 3 verified (staged headless, progression seeded):
  (a) dash entered 42px before a 56px lux car, natural expiry
  mid-overlap → extended and exited 35px past the far side, vy 0
  throughout, y pixel-identical, dash then ended clean; identical
  through a REQUESTED car — no tag, request stayed live.
  (b) pinch staged under a row-12 deck (32px clearance, jump
  physically cannot clear a car): yield latched, Chexy slid through
  to the far side at push speed, latch released on clear, no
  interrupt, run alive. Open-sky control with real contact: never
  yielded. The 60fps acceptance point needs the human's machine —
  headless runs uncapped (~113fps) and can't attest it.
  (c) air-dash through a car hovering over the second row-9 deck gap:
  real pass-through (extension included), fresh fall from vy 0 on
  exit, second mid-air dash denied, air dash refreshed on landing —
  and the extended exit caught the far deck's lip, which is exactly
  the showcase reading well.
- Test-harness lessons for the record (they cost four runs):
  headless=new Chrome freezes BOTH RAF and DOM timers mid-run (game
  clock dead, ~13s in) — anti-throttling flags and screencast pumps
  do NOT prevent it; the reliable pattern is kicking game.loop.step()
  from CDP whenever loop.now goes stale. And CDP awaitPromise on
  long-lived page promises dies to GC ("Promise was collected") —
  store stage results on window and poll instead.
- Item 4: ruling entry appended verbatim below.

2026-08-09 — Dash-through-vehicles ruled, plain dash
(handoff 2026-08-09-g): vehicle collision suspended
during dash, extend-until-clear, structure stays solid;
charged variant rejected as scope. Anti-crush guarantee:
the edge push slides Chexy through yielding vehicles —
the pinch pocket cannot exist. Blockout rule: tiles may
never enclose an edge-reachable pocket.

## 2026-08-10 — In-session rulings: round-3 playtest prep (ratified by play)

Round-3 symptom (human report): every run collapsed into hugging the
trailing edge spamming Z — always effective, and the only effective
answer to last-second steals. Contributing mechanics on the record:
stunnable chip-carriers are class-0 auto-target priority, so edge
camping made Z-spam a zero-commitment interceptor for every rip; and
deck cars were taggable from the ground through the deck floor
(66px radius vs ~40px vertical gap), so verticality — and the air
dash the map was built to showcase — was optional. Three tweaks,
played and ratified ("plays well now"):

1. Elite cap: at most eliteMaxActive (2) concurrent elites — the
   auto-scroll bounds the arena; more elites only stacked the edge.
   Capped spawns are skipped; wave timing untouched.
2. Idle wander: elites with no tagged backlog drift between random
   in-view points. The follow-the-player fallback is deleted —
   shadowing fed the camp loop and read as menace without a threat.
3. Feet-level tag reach: a car is taggable only when Chexy's feet
   are within tagReachY (28px) of its wheels. Deck requests demand
   ascent (roof routes and dash gaps are load-bearing now); jumping
   beside a deck edge still tags mid-air; under-deck ceilings
   prevent hop-tags through the floor. Arrows, ranking, and Contact
   Card still see unreachable cars (routing info; card saves on
   unreached cars stay legal per BRIEF-05 §4). Held in reserve if
   camping persists: the -f lever (elite target preference biased
   away from near-safe cars) and a cost on whiffed/spammed stuns
   (touches the shared verb — design-chat call).

Also this session (human-supplied): level 3 display name renamed
"THE VALET GARAGE" → "THE GARAGE" (levels.js; DESIGN §3.3 heading
synced). First real SFX landed: assets/audio/tag.mp3 replaces the
tap-tag synth via the BRIEF-02 drop-in contract — zero code changes,
verified loading as audio-tag with a clean boot.

## 2026-08-10 — Handoff 2026-08-09-h applied (round-4 calibration)

- Sequence check: 2026-08-09-g applied and committed first ✓; the
  round-3 tweaks it ratifies were committed in ec55993.
- Items 1-2 logged: round-3 tweaks, root README, "THE GARAGE", and
  tag.mp3 all ratified; whiff/spam cost RULED OUT permanently
  (whiffs stay clean per -b; the anti-camping lever is -f elite
  target preference, never the verb).
- Item 3 calibration (released to agent; decisions on the record):
  - CAPACITY FINDING: steady-state 3 live is unreachable with 44
    cars — zero-slack caps a standard request's window at ~13s
    (ratio 3 boundary), so 44 windows can't sum to 3×190s without
    parking every request at the slack line. The car field grew as
    DATA (round-1 retune precedent): 69 cars (10 lux incl. 2
    deck-lux, 14 deck, 45 ground; 11 dressing incl. 3 past
    maxScroll that never exit). 58 requests.
  - Metric: live = scheduled request windows [fire, exit] assuming
    unserved (the pre-play instrument; played counts run lower).
    Fitted curve: warmup avg 1.9 (cap 3) → steady 2.9 (cap 4) →
    rush avg 3.8 PEAK 5 → finale avg 3.0 peak 5. Steady-state
    (20-175s) 3.11. Hard caps enforced: peaks 4-5 live only in
    phases 3-4.
  - Band: floor 1.04 HELD (three finale standards forced to
    1.04-1.08), max 2.90, zero slack. Runtime instrument (real
    validateRequests, dash-unlocked effSpeed): 58/58 green, 0
    slack, floor 1.054 (0.1s fire-time rounding drift).
  - Cross-tier conflicts: 26 seconds of deliberate lux+deck+ground
    triple-overlap in phases 3-4; every P3/P4 lux window contains
    deck and ground work (deck-lux cars make the tier conflict a
    route conflict under feet-reach).
  - Gap: HELD at 112px, verified rather than resized — the flat
    air-dash line (jump → dash at height → fall) lands 11px deep
    on the far deck; a roll-off dash falls short; jump-only falls
    in 20px short (the -c frame-perfect edge-clip remains as the
    flex). No cars park on row-9 decks, so no roof-assisted
    crossing exists.
  - BUG FOUND BY THE GAP PROBE, FIXED IN THE SHARED SCENE:
    collectible pickup used a physics overlap pair, and Arcade's
    overlap pass sets body.touching — flying through an NFC tag
    read as onGround() mid-air, silently refreshing the air dash
    and arming coyote (a tag-touch coyote-jump could cross the
    showcase gap with NO dash). Pickup is now a manual AABB check
    in updateCollectibles; verified: zero grounded frames inside a
    tag, air dash stays consumed, pickups unchanged.
- Item 4: ruling entry appended verbatim below.

2026-08-09 — Round 3 stabilized and ratified (handoff
2026-08-09-h): elite cap 2, wander-not-follow, feet-level
reach — camping starved at all three feeds. Whiff cost
ruled out permanently (whiffs are clean by -b). Round-4
calibration released to the agent: request count free,
band floor held, cross-tier overlap deliberate, showcase
gap sized for the air-dash line. Human verdict closes.

## 2026-08-10 — In-session ruling: request fire-position deadline

Human ruling: a request must arrive no later than when its car first
reaches 75% of the distance to the left screen edge. Late requests
read as ambushes even when the lead-time math says they're catchable
— the fairness floor bounds CATCHABILITY, the deadline bounds FEEL.
Implemented as requestFireDeadlineFrac (0.75, panel slider) inside
validateRequests, so the permanent readout now enforces both rules
(a late fire is RED with its own message). Schedule regenerated
under the deadline: it becomes the binding hot constraint for
standard cars — the effective band floor moves from 1.04 to ~1.54
(lux at the 1.04 fairness floor already fired earlier than the
deadline). Hot finale entries now sit AT the deadline (with 0.2s
margin so fire-time rounding can never tip past it — two knife-edge
entries read RED at runtime before the margin). Re-verified: 58/58
green under both rules, zero slack, tightest fire 27% of screen
remaining, concurrency curve unchanged (steady 3.10, peaks 4-5 only
in phases 3-4, cross-tier overlap 28s), gap and collectible
regressions hold.

## 2026-08-10 — Dash-wedge fixed (stuck inside a car while dashing)

Human report: stuck inside vehicles when dashing, freed only by the
screen-edge squeeze. Reproduced exactly: tapping DURING a
dash-through of a requested tier-1 car fired beginTap, whose windup
movement-freeze zeroed the dash velocity while inside the vehicle —
and -g's extend-until-clear then extended the dash forever (gravity
off, vx 0, suspended in the car) because a motionless dash can never
clear. The edge push was the only thing that ever restored velocity.
The tap also TAGGED through the car, violating -g's "dash-through
does not tag" (tier 2+ holds were immune — holds can't start
mid-dash — which is why the wedge was intermittent). Fix in the
shared scene: no tag verb may INITIATE mid-dash; a mid-dash press is
dropped, not buffered (updateTagging gate). Verified: mid-dash tap
tags nothing and the dash exits clean at speed; a post-dash press
tags normally; dash-into-hold remains impossible in the other
direction (dash can't start while frozen), so no reverse wedge
exists.

## 2026-08-10 — The -f lever pulled: near-safe elite sanctuary (ratified)

Round-4 report (human): elites still ripped tags off nearly-offscreen
cars — no rescue window under the new tension; "starts to feel
unfair." That is verbatim the trigger 2026-08-09-f pre-armed: "if
round 3 reads it as ambush, the lever is elite target preference
(bias away from near-safe cars), not the revert model." Lever
pulled as EXCLUSION rather than soft bias (a preference would still
rip the near-edge car whenever it was the only tagged target — the
reported case): tagged cars within eliteSanctuaryS (4s, panel
slider) of banking are invalid elite targets — acquire skips them,
a lock releases when its car enters the sanctuary, initiation is
refused. Same grammar as safe (-e), one notch earlier: the trailing
edge is now a two-stage return zone — protected approach, then the
bank. Guarantee: any rip leaves at least the sanctuary window to
stun the carrier or re-tag. Verified staged: rip blocked at 2s-to-
bank with a cooldown-cleared elite pinned on the car (and the car
NOT yet safe — sanctuary is distinct); control rip lands at 8s;
locks release on sanctuary entry with the tag intact. Human played
it: "Much better. Still quite challenging. Keep it." Ratified.

## 2026-08-10 — Handoff 2026-08-09-i applied

- Sequence check: 2026-08-09-h applied and committed first ✓ (round-4
  package: 87e0eda, be853d2, 091f1f8, 85fb6a6).
- Item 1: round-4 package RATIFIED in full — the 69-car field (field
  density is henceforth a FREE data lever, no per-change ruling
  needed while instruments stay green); the declared "live" metric;
  the fire-position deadline with the catchability-vs-feel
  distinction on the record; the gap held at 112px (showcase line =
  only clean crossing); the tag-touch grounded-state fix (manual
  AABB pickup); the mid-dash verb drop (the -g contract's last edge
  closed); the elite sanctuary as the spent -f lever.
- Item 2: GARAGE CLOSE-OUT CRITERIA set — BRIEF-05 closes on one
  full clean session: at least three consecutive start-to-results
  rushes with no new structural findings, hanger/score/feel verdict
  filed, 60fps confirmed twice on hardware. A new finding that needs
  design (not a panel slider) resets the criterion; in-session panel
  nudges do NOT (panel play is calibration, not structure). On
  close: standard sign-off entry, levers frozen at played values.
- Item 3: lever ledger acknowledged — pre-armed answers SPENT.
  Standing rule: post-close garage needs return to the design chat;
  no invented levers agent-side.
- Item 4: ruling entry appended verbatim below.

2026-08-09 — Round 4 ratified (handoff 2026-08-09-i):
deadline instrument canonized (catchability vs feel),
field density freed as data, sanctuary spent, dash-tap
contract closed. Close-out criteria set: three clean
consecutive rushes + hardware 60fps = BRIEF-05 signs
off. Lever cupboard empty by design — future garage
needs are design-chat matters.

## 2026-08-10 — In-session ruling: fulfilled-request checkmark

Human ruling: fulfilled requests (tagged but still stealable) must
read differently on the HUD queue — "perhaps a checkmark."
Implemented: request chips wear a small Success Green check from the
moment the car is tagged until the chip resolves at bank/drive-off;
an elite rip removes the check (the request is live work again), and
any re-tag — player or stun-rescue chip-flight — restores it. Wired
as request-tagged / request-untagged events from GarageScene's three
tag-state transitions (completeTag, elite rip, chip-flight reapply).
Verified through the full lifecycle: request (no check) → tag
(check) → elite rip (check removed) → re-tag (check restored); no
console errors. Queue now reads "handled" vs "still needs me" at a
glance.

## 2026-08-10 — BRIEF-05 CLOSED: The Garage signed off

Close-out criteria (handoff 2026-08-09-i item 2) met and declared by
the human: at least three consecutive clean start-to-results rushes
with no new structural findings; verdict filed: "Clean close-out
session played; hangers and score where they should be; feel
ratified as played. Signed off, including 60fps ×2 on hardware."

LEVERS FROZEN at played values (the -i freeze):
- Field: 69 cars (10 lux incl. 2 deck-lux, 14 deck, 11 dressing),
  58 requests; map 564×17 (9024px), showcase gaps 112px ×2.
- Scroll/rush: scrollSpeed 45, rushSeconds 190,
  stealCooldownMs 3500 (map properties).
- Requests: requestGraceMs 1500, luxuryLeadFactor 1.5,
  requestFireDeadlineFrac 0.75 (effective band 1.54–2.90, zero
  slack, steady-live 3.1, peaks 5 in phases 3–4 only).
- Cars/verbs: tagReachY 28, driveOffDelayMs 5000, edgePushMargin 10.
- Enemies: eliteMaxActive 2, eliteSanctuaryS 4, swarmSlowFactor 0.4,
  swarmSlowMs 600.
Per the -i standing rule, any future garage need returns to the
design chat — the lever cupboard is empty by design.

Shipped under this brief, for the record: the request-queue
auto-scroll core; cars as items and platforms; swarm/elite hybrid
enemies with contact-slow, wander, visibility rules, safe-at-edge,
and the near-safe sanctuary; the request gate and feet-level reach;
dash-through with extend-until-clear and the anti-crush guarantee;
the fire-position deadline instrument; the tension-band instrument
(permanent); fulfilled-request checkmarks; two shared-scene fixes
found by garage probes (collectible grounded-state, dash-wedge).

## 2026-08-10 — Handoff 2026-08-10-a applied

- Sequence check: first handoff of 2026-08-10; the 2026-08-09 chain
  closed at -i ✓.
- Item 1: log corrected — the 'lose' frames shipped earlier and have
  been live in-game (wired on export, human-confirmed). With them
  the Chexy animation set is COMPLETE: all twelve tags (idle, run,
  jump, fall, land, tap, hold, dash, hit, win, lose, teeter) final,
  all hooks lit, BRIEF-ART-01 §4 delivered as evolved (16f run, 3f
  hold, artist-initiated teeter). No character placeholder remains.
- Item 2 verified in passing: all twelve tags registered in the
  animation manager; results screen plays the outcome poses per the
  -09 report — win plays once and parks on its final frame (frame
  2/2, not playing), lose loops (repeat -1, playing); zero console
  noise across boot, both outcomes, and a mid-battery restart.
- Item 3: ruling entry appended verbatim below.

2026-08-10 — Chexy animation set COMPLETE (handoff
2026-08-10-a): twelve tags final, BRIEF-ART-01 delivered
in full. The character has no remaining placeholder
anywhere.

## 2026-08-11 — Handoff 2026-08-10-a REVISED applied (supersedes the draft)

- The earlier -a draft was applied and committed (bbc9b4c) before
  the revision arrived; its items 1 and 3 (animation-set completion
  log; win-parks/lose-loops verification, twelve tags, zero console
  noise) stand as done. This entry applies the revision's delta.
- Item 0: held per the file check — BRIEF-ART-04.md was absent from
  HEAD and the working tree (searched tree, case-insensitive names,
  and full git history before flagging); the human dropped it in.
  art/palettes/garage-env.gpl had landed with the handoff. Both now
  committed.
- Item 2: BRIEF-ART-04 read and tracked (garage art: cars, elite
  V3, tiles, parallax; wiring contract §6 is agent-side after each
  drop; nothing in it invalidates existing code — it conforms art
  to the ratified collision field). Both step-0 inventories
  produced in art/garage-inventory.md: (a) car-body dimensions per
  tier with roof lines, parking bottoms, the 32px deck-clearance
  fact, canvas guidance, and the current chip anchor; (b) the
  garage tile-role inventory (gids 1/2/6/7/5 in use with placements
  and the double-faced deck-strip note; 3/4/8 and all of 9–24 free;
  layer stack; deck/gap coordinates). Wiring note flagged: the
  per-map tileset image keying lands with the first tile drop.
- Item 4: ruling entry appended verbatim below.

2026-08-10 — Chexy animation set COMPLETE; BRIEF-ART-04
+ garage-env.gpl landed with the two step-0 inventories
produced (handoff 2026-08-10-a). With BRIEF-05 closed,
the project's remaining build surface: Level 4 design +
brief, Level 5 + boss, garage/Bell Desk art and audio
content, polish ledger.

## 2026-08-11 — Handoff 2026-08-10-b applied

- Sequence check: 2026-08-10-a (revised) applied ✓. Item 0: BRIEF-06
  was absent at handoff arrival — held per the file check (tree +
  history searched); the human dropped it in and ordered: EXECUTE
  IMMEDIATELY. BRIEF-06 read in full; nothing in it invalidates
  existing code; the -b clean-miss rule's drift clarification is a
  scoped refinement, not a contradiction.
- Item 1: design-session entry appended verbatim below.

2026-08-10 — STROLLER VALET DESIGN SESSION (compiled
into BRIEF-06). Human chose the NOVEL option: rolling
items as Level 4's mechanic. Bounded design: strollers
roll perpetually (speed hard-capped ≤0.3× player — the
mover fairness rail), backpacks bounce-and-settle, cups
are comedy; tag BRAKES a stroller (checked = parked).
Rulings: mover tap grace (press-time acquisition lands
despite windup drift — drift is not invalidity); locks
and loiters follow movers; no feet-reach outside the
garage; density is the level identity and the perf
ceiling test; field count is the perf lever. Garage
round system + close-out criteria apply.

## 2026-08-11 — BRIEF-06 EXECUTED: The Stroller Valet (core + waves)

One session per the brief. Shipped:
- MuseumScene ('Museum') extends LevelScene — no feet-reach (garage-
  scoped), ground-plus-mezzanine per the Bell Desk pattern. Three
  item classes on tinted rects: strollers 26×18 (movers), backpacks
  14×14 (bounce-settle ~1s), cups 8×8 (high-restitution confetti,
  cupScoreFactor 0.4). Tag BRAKES a stroller: the full check-in beat
  lands (score/chip/pose/guest) and the item PARKS in place instead
  of whisking — braked, static, chip on. Movers re-assert
  strollerSpeed whenever grounded (one loop covers roll-out, post-
  rescue resume — perpetual until tagged — and landings); wall
  rebounds via bounce.x 1.
- Tunables: strollerSpeed 45 with the HARD RULE noted on the tunable
  (≤0.3× maxSpeed — the mover fairness rail), backpackBounce 0.5,
  cupBounce 0.75, cupScoreFactor 0.4 (+ sliders, stroller slider
  capped at 45 so the rail can't be broken from the panel).
- Map museum.json 120×17 (~4 screens): marble ground, two exhibit
  mezzanines (double-faced strips), return-alcove counter block
  center — the deliberate rebound anchor making two readable lanes;
  roll-in spawn points at both lane ends. Waves: 210s four-phase arc
  (backpacks+cups teach → sparse strollers → chaos → convoy bait),
  mix 38/35/28 vs the brief's ~40/35/25; collectibles 8 tags +
  2 cards + 1 insight. maxItemsOnField is now a per-level map
  property (museum: 20) — field count is the density/perf lever.
- Registrations: scene, map, waves, levels row (id 'museum',
  "THE STROLLER VALET", requiresClear garage; music hook
  music/museum.<ext> via levelId).
Verified (staged headless per §4): instruments green at boot, no
console noise; tap mid-roll brakes/chips/scores/parks; WINDUP-DRIFT
TAP LANDS — and the §2 ruling held with ZERO code change (the -04-b
windup already re-validates taggability only, never radius; drift
was never invalidity); thief lock follows the mover (lockedTarget
ref tracks it while rolling) and grabs in place, carrier rules
unchanged; a stroller rolls off a mezzanine and remains valid,
rolling, and taggable below. Map bug caught by the spawn gate during
verification (player spawn inside the alcove block) and fixed.
Observation for the design chat (no lever invented, per -i): a
tail-chase against a mover closes at only 10px/s (enemy 55 vs
stroller 45) — thief pressure on movers comes from intercepts and
rebound returns, not pursuit. Reads as intended texture; flagging
in case round play contradicts.
Awaiting the human: full rush start-to-results, punch-list rounds
per garage precedent, and the perf ceiling test — 60fps ×2 at peak
density on hardware (the lever is field count, not physics).

## 2026-08-11 — In-session rulings: cups cut (coats re-used); "THE MUSEUM"

Human rulings on the fresh BRIEF-06 build, pre-first-playtest:
1. Sippy cups cut — funny, but not a checkable item. The museum's
   third class re-uses COATS: standard items, standard tap, and the
   real coat art ships with them (the museum's only non-rect class).
   Removed: the cup item class, cupBounce/cupScoreFactor tunables
   and sliders, the cup category color. Waves regenerated with coats
   in the cup slots — mix unchanged (strollers 38%, backpacks 35%,
   coats 28% vs the brief's ~40/35/25). BRIEF-06 §1/§3/§4 amended in
   place; DESIGN §3.4 rewritten to match the built level.
2. Level 4 display name: "THE STROLLER VALET" → "THE MUSEUM"
   (levels.js; DESIGN §3.4 heading synced; BRIEF-06's title left as
   the historical artifact, per the GARAGE rename precedent).
Full acceptance battery re-run after the changes: ALL PASS, no
console noise (brake mid-roll, windup-drift grace, mover steal with
lock-follow, mezzanine roll-off, instruments green).

## 2026-08-11 — Museum mezzanines lowered to a legal hop (human-reported)

Human report: mezzanines unreachable — items there taggable only
through the floor, and mezzanine steals effectively unrescuable (a
carrier at mezz height sits outside the 66px tap radius from the
ground). Root cause: the generated map put the mezzanines at row 10
(80px rise) against the maps-README layout rule (max jump ~61px,
hops ≤48px / 3 rows) — a generator bug, same rule the coatroom was
built under. Fixed: mezzanines moved to row 12 (top y=192, a 48px
hop), mezz item spawns and collectible tag heights re-based to the
new geometry (mezz-route tags reachable from ON the mezz, ground
tags from the ground), far-dressing pillars trimmed to fit. Full
battery re-run: ALL PASS including a new M6 reachability proof —
autopilot run-jump from the ground lands standing on the mezzanine
(and M4 re-verified: lock-follow on a rolling target, grab, carry).
Under-mezz clearance is now 32px (the garage stack) — Chexy walks
under; strollers roll under and off the ends as before.

## 2026-08-11 — Museum difficulty pass 1 (human platforms + slower steal clock)

Human round report: the Museum is very difficult — items spawn on
opposite ends of the 1920px stage and cross-map saves are near-
impossible even with optimal dash. Diagnosis: 'any' spawn selection
shuffles all ten points uniformly (opposite-end demands are the
DEFAULT), and the fairness instruments validate each spawn against
enemy distance individually — nothing budgets the player's serial
travel between far-apart events. Two changes this pass:
1. HUMAN-DRAWN traversal platforms committed (rows 9 and 6 hop
   routes bridging the mezzanines across the mid). The museum map is
   hand-maintained from here — the generator's map half is retired
   (waves edits go through the wave file directly).
2. Human chose the steal-clock lever (offered: zoned wave fronts,
   steal clock, both): museum stealCooldownMs 4000 → 5500 (map
   property) — steal initiations space out so consecutive saves have
   cross-map travel budgeted. Zoned fronts remain on the table if
   round 2 still reads as scattered.
Verified live: cooldown override 5500 at runtime, boot clean, no
console noise.

## 2026-08-11 — Handoff 2026-08-10-c applied

- Sequence check: 2026-08-10-b applied ✓ (and the pass-1 work this
  handoff ratifies was committed: BRIEF-06 execution, cups cut, THE
  MUSEUM, mezzanine fix, hand-drawn platforms, steal-clock 5500).
- Item 1 ratified in full, including the workflow shift on the
  record: GENERATORS PROPOSE, HUMANS OWN MAPS ONCE HAND-EDITED (the
  museum map's generator half is retired). Tail-chase intercept
  texture ratified as intended — watch, no lever.
- Item 2: TRAVEL BUDGET built — instrument three. The lineage:
  fairness floor = catchability per event, tension band = heat per
  request, travel budget = serial ROUTING feasibility. Formalized
  event set (agent, per the handoff): (1) an untagged item ENTERING
  danger — first enemy lock landing on it, 4s re-arm so lock churn
  doesn't spam the itinerary; (2) a steal INITIATING — the
  grab/gloat start. Over a sliding travelBudgetWindowS (12s), the
  max-effort serial travel between consecutive events (dash-aware
  effective speed, same formula as the (c) instrument) may use at
  most travelBudgetFactor (0.8) of the wall-clock the window spans —
  no schedule may demand an impossible itinerary. Implemented
  level-agnostic in LevelScene (museum-first; the static levels
  retro-fit for free; the garage's elite path can wire
  recordTravelEvent when relevant), panel slot 2 readout + a RED
  console.warn on the green→red transition. Verified: feasible
  itinerary green; three cross-map events in 1.5s → RED with the
  warn; the window slides and recovers; an organic enemy lock stamps
  danger-onset and records the event.
- Item 3: ZONED WAVE FRONTS pre-armed for a scattered round-2
  verdict — bursts cluster at adjacent points, the front MIGRATES
  across the rush (the crowd moves through the museum), and finale
  opposite-end simultaneity is reserved as the deliberate BIG DAY
  bait, PRICED by the travel-budget readout rather than banned.
  Applied only on the human's verdict.
- Item 4: ruling entry appended verbatim below.

2026-08-10 — Museum pass 1 ratified (handoff
2026-08-10-c): cups cut, map hand-owned, steal-clock
lever spent. TRAVEL BUDGET canonized as instrument three
(serial routing feasibility — the museum exposed what the
scroll had been hiding). Zoned fronts pre-armed for a
scattered round-2 verdict; finale opposite-end
simultaneity reserved as priced bait.

## 2026-08-11 — Museum PLAYTEST SUCCESS; mid-air brake polish

Human verdict on round 2: playtest is a success (steal-clock 5500 +
hand-drawn platforms held; zoned fronts stay pre-armed, unused).
One aesthetic note, fixed: tagging a mid-air stroller (e.g. just
rescued) froze it in the air. The brake now kills horizontal motion
immediately but lets gravity finish — the stroller falls and locks
on touchdown (brakePending, resolved in the mover loop). Grounded
tags still lock instantly. Verified: mid-air tag fell from y=110 to
y=231 (resting exactly on the ground) before locking; grounded
regression locks same-tick; no console noise.

## 2026-08-11 — BRIEF-06 CLOSED: The Museum signed off

Close-out per the -i pattern (BRIEF-06 §4 adopted it): clean rushes
played through round 2, no open structural findings, and the perf
ceiling test — 60fps ×2 at peak density on human hardware — covered
by the human's sign-off ("All good! I'm ready to sign off on the
playtest."). Verdict recorded plainly per the BRIEF-05 precedent:
clean session, hangers and score where they should be, feel
ratified as played.

LEVERS FROZEN at played values:
- Items: 69 scheduled (strollers 38% / backpacks 35% / coats 28%),
  strollerSpeed 45 (the ≤0.3× mover rail), backpackBounce 0.5,
  maxItemsOnField 20 (map property — the perf lever, untouched:
  the ceiling held at 20).
- Clock: rushSeconds 210, stealCooldownMs 5500 (round-1 lever, held
  through round 2).
- Map: hand-owned (human traversal platforms rows 6/9; mezzanines
  row 12; alcove block center; two dash-friendly lanes).
- Instrument three (travel budget) live: factor 0.8, window 12s.
- PRE-ARMED, UNSPENT: zoned wave fronts (with finale opposite-end
  bait priced by the travel budget) — remains the designed answer
  if future museum play reads as scattered.

Shipped under this brief: rolling items (tag = brake, with the
touchdown-lock polish), bounce-settle backpacks, coats as the third
class, per-level field cap, the travel-budget instrument (canonized
project-wide by -c), and the mover rulings verified as shipped
truth (tap grace held with zero code change; locks follow movers).

Four levels built, played, and closed. Remaining build surface:
Level 5 + boss, garage/museum art and audio content, polish ledger.

## 2026-08-11 — Handoff 2026-08-10-d applied

- Sequence check: 2026-08-10-c applied ✓; the closure package this
  handoff ratifies is committed (round-2 pass, frozen levers,
  touchdown-lock polish, travel budget live, zoned fronts pre-armed
  and unspent, sign-off d6af7fe).
- Item 1: ratified in full — nothing outstanding.
- Item 2: ruling entry appended verbatim below.

2026-08-10 — BRIEF-06 CLOSED (handoff 2026-08-10-d):
the Museum joins the certified list. Four of five levels
complete. Remaining gameplay build surface: the Mass
Exodus and the Paper Ticket King, pending the design
chat's BOSS-SPEC reconciliation pass.

## 2026-08-12 — Handoff 2026-08-11-a applied

- Sequence check: first of the -11 series; the -10 chain closed at
  -d ✓. Item 0: BRIEF-07.md landed with the handoff (read in full;
  no shipped code invalidated — the BOSS-SPEC supersessions kill
  spec-only concepts like stealRefund before they were built).
- Item 2 standing: BRIEF-07 Session 1 (Act-1 rush) executes on the
  human's go.
- Item 1: design-session entry appended verbatim below.

2026-08-11 — MASS EXODUS DESIGN SESSION (compiled into
BRIEF-07; its amendments supersede BOSS-SPEC where they
conflict). Rulings: two-act structure with the Boss Door
checkpoint (act-1 losses AND score bank; boss retries
restore both; hangers judge the full shift); claw = rip
grammar (giant elite — the King undoes work, never
creates losses; minions steal untagged under the standard
stack); tier-weighted Return Meter (1.0/1.5/2.0 mirroring
score, symmetric rip/restore, stealRefund deleted,
thresholds 12/15/18 points first-calibration). Fiction
flips level-wide: tags RETURN items to departing guests.
Act 1 is the medley finale and the zoned fronts' true
home. Watchdog rule lands on the King's state machines
per the -03-b promise.

## 2026-08-12 — BRIEF-07 SESSION 1 EXECUTED: the Exodus Rush (Act 1)

Shipped at the brief's first seam:
- ExodusScene ('Exodus') extends MuseumScene — the mover stack
  (brake-on-tag, touchdown lock, perpetual roll) inherited whole;
  coats and tier-2/3 luggage flow to the base scene. Thieves at full
  standard grammar; sanctuary-less by construction (no scroll).
  MuseumScene's constructor gained a key parameter to be
  subclassable. Act 2 + the Boss Door land at the S2 seam (the rush
  currently ends with standard results).
- FICTION FLIP, level-wide: handbackCopy map property → registry →
  the UIOverlay bubble pools swap to EXODUS_HAPPY/UNHAPPY_LINES
  (hand-back copy; card lines stay — still a save). Placeholder
  copy, human punches up later, per the guestLines convention.
- Venue: exodus.json 132×17 — SIZED BY THE (c) INSTRUMENT: the
  2400px proposal violated steal fairness by 1036ms (carrier escape
  11.46s vs traversal + margin); at 2112px the margin holds with
  400ms slack. The brief's "~5 screens" bent to the instrument.
  Three mezzanines (row 12), two rack blocks (rebound anchors),
  roll-in lanes at both ends. Generator proposal — human owns the
  map on first hand-edit, per the -10-c rule.
- Waves: ZONED FRONTS SPENT (their true home per the -11-a session):
  five zones (L/ML/M/MR/R), the front opens at L and MIGRATES across
  the venue through four phases over 240s; 58 items (32 coats, 13
  luggage t2/t3, 13 strollers), 22 enemies. Opposite-end
  simultaneity ONLY in the pre-checkpoint climax window (t≈190-206),
  exempted from the static itinerary check as the deliberate BIG DAY
  bait and priced at runtime by the travel budget. Static itinerary
  check otherwise CLEAN.
- Instrument note: a static arena has no request surface, so the
  tension band does not apply here — the instrument set pricing the
  exodus is spawn fairness + the (c) inequality + the travel budget.
Verified (S1 acceptance): 55s LIVE with the schedule running — zero
red frames on fairness and travel budget, no console noise; the
medley in one rush — a tier-3 HOLD (started, completed, whisked), a
stroller BRAKE mid-roll (parked with chip), and a RESCUE (staged
steal, stun landed, item freed); fiction flip live (registry flag +
exodus pools drawing). Two verification misreads corrected along the
way (completed tags whisk — asserts must observe the tag in flight),
logged so the next battery author knows.

## 2026-08-12 — Handoff 2026-08-11-b applied

- Sequence check: 2026-08-11-a applied ✓; S1 shipped at 98f3f9a.
- Item 1 ratified, two principles canonized: INSTRUMENTS CONSTRAIN
  BLOCKOUTS, BRIEFS PROPOSE (the venue sized by the (c) inequality at
  create time, 2400→2112px); and INSTRUMENT APPLICABILITY IS
  PER-LEVEL GRAMMAR — no request surface, no tension band; absence
  reads as N/A, not omission (noted on the instrument docs: the
  lineage comments in LevelScene and tuning.js).
- Item 2: zoned fronts logged SPENT in their true home; the climax
  window's static-check exemption + runtime travel-budget pricing
  ratified as the deliberate BIG DAY bait pattern.
- Item 3: ruling entry appended verbatim below.

2026-08-11 — S1 ratified (handoff 2026-08-11-b): venue
instrument-sized, fronts spent, medley verified, fiction
flip live. Act-1 round 1 is the human's next verdict.

## 2026-08-12 — Parallax drop-in wired (BRIEF-ART-02 §4, the agent's pass)

Triggered by the artist's first export (coatroom P4). The loader is
a full drop-in per the house contract: assets/parallax/<levelId>/
p1..p4.png (+ optional glow.png), discovered by glob, missing
layers skipped, partial stacks fine. Scroll-factor table per
BRIEF-ART-02 §2 (0.05/0.2/0.45/0.7), depths −9…−6 behind the tile
map's bg layers; tileSprites for repeat-x. The §3 autonomous motion
shipped code-side with it: P3 crowd sway (±1px sine) and the
glow.png additive alpha-pulse — sconce flicker stays tile-side art
debt. Convention documented in assets/parallax/README.md (the
garage's three-layer stack per BRIEF-ART-04 §4 just omits p4).
Verified: coatroom P4 loads at depth −9 and tracks the camera at
its factor while walking; paintingless levels boot with empty
stacks; no console noise. The 60fps re-check with a full stack
stays on the human's hardware per the brief.

## 2026-08-12 — Coatroom parallax stack COMPLETE (five layers live)

The artist delivered the full BRIEF-ART-02 §2 stack — p4/p3/p2/p1 +
glow, every canvas at exactly the contract size (480/960/1280/1600
×270). Drop-in, zero code changes. Verified live: all four layers
track the camera at their scrollFactors (p4 5.3/5.3, p2 47.3/47.3,
p1 73.5/73.5 at scrollX 105), p3 rides its ±1px crowd sway on top
of 0.2 (21.9 vs 21.0 base — the sway visible in the numbers), and
the glow overlay alpha-pulses (0.704 → 0.517 across a sample). The
coatroom is the first level with its full painted depth. Remaining
BRIEF-ART-02 §3 debt: sconce flicker (tile-side art). The 60fps
full-stack re-check is the human's, per the brief.

## 2026-08-13 — Tile SKINS: the coatroom2 sheet experiment

The artist dropped art/aseprite/coatroom-tiles2.aseprite with a
DIFFERENT role layout than the original sheet (row 1: four repeating
floor tiles, then platform left cap / two middles / right cap).
Rather than rewrite the hand-owned coatroom map to the new indices,
map data keeps speaking ROLE gids and a SKIN translates roles →
sheet indices (TILE_SKINS in LevelScene, keyed by levelId, applied
only when its texture exists — delete the PNG and the level reverts,
no code change). Convention documented in assets/maps/README.md.
Also: scripts/export-sprites.sh gained a TILES pass (flat canvas
save, NO --extrude — the tilemap slices on a fixed grid, so padding
would shift every tile), so re-export stays one command.
Verified: floor row reads 1,2,3,4,1,2,3,4 across columns; a platform
strip reads 5,[6/7…],8; collision survives the re-index (floor and
strip solid, empties still empty); tileset texture is tiles2; no
console noise. buildMap now parses map properties BEFORE creating
layers (the skin needs levelId) — the parallax/copy hooks read the
same object as before.
Two art notes reported to the human, not acted on: (a) bg1/bg2 tile
dressing is hidden under this skin (no dressing art in the sheet) and
the return counter renders as floor — it wants a role of its own if
the experiment ships; (b) PER-LAYER ISOLATION CAPTURE found the
mid-screen "seam" in the composite is P2: p2.png holds a single
column in an otherwise transparent 1280px canvas, so one lonely
pillar appears every ~2800 world px and its hard edge reads as a
seam. P4/P3/P1 all verified clean and tiling correctly.

## 2026-08-13 — coatroom2 skin: counter role added (row 2)

Artist re-exported with row 2 = four counter TOP tiles + four counter
BOTTOM tiles. Wired as the `counter` role (gid 3), and the skin
contract grew a block-relative context: role functions now receive
{ dx, isTop } — columns from the block's left edge and whether it's
the block's first row — computed from a SNAPSHOT of original indices
so neighbor lookups never see already-skinned tiles. The coatroom's
2×4 counter therefore reads 9,10,11,12 across its top and 13,14,15,16
beneath, and a counter moved or resized in Tiled still skins right (a
3-row counter would use the bottom set for both lower rows). Verified:
both counter rows exact, block still solid (standable top), floor and
platform mappings unchanged, no console noise. Remaining sheet space:
row 3 (gids 17-24) free; bg1/bg2 dressing still unskinned and hidden.

## 2026-08-13 — Cars: collision follows the ART (human ruling) + swap live

First garage car drawn (sedan, cobalt, nose-right, 44×14 full-bleed).
The human ruled that the collision rect should follow the art rather
than the reverse — an inversion of BRIEF-ART-04 §0 and of the
frozen-field posture from BRIEF-05's close-out, so it is recorded as a
deliberate amendment (brief + inventory both annotated in place). The
guard rails that make it safe, now canon: the top row of ink must BE
the roof (nothing above it, or players stand on air), the bottom row
must be the wheel contact, and any change re-verifies the instruments.
Height changes move parked bottoms and the deck-clearance facts;
width changes are free.
This drop was width-only: sedan 40 → 44. Every ratified platforming
fact therefore stands untouched (roof lines 226/178, the exactly-32px
deck clearance, tagReachY 28). Checked, not assumed: tightest car
gaps 68px ground / 22px deck (no overlaps introduced), and the full
round-4 battery re-ran green — 58/58 requests, zero slack, band floor
1.558 (up from 1.537: the 2px-wider right edge exits marginally
later), max 2.92, both showcase-gap crossings unchanged, no console
noise. Runtime confirms body 44×14 from the texture.
PALETTE SWAP SHIPPED as specified in the inventory kit: one drawing →
six hues. scripts/palette-variants.mjs rewrites only the indexed PNG's
PLTE chunk (+CRC) — pixel indices untouched, zero dependencies, so it
cannot disturb the drawing; the export script's new CARS pass runs it
per drawn tier and skips undrawn ones. Tint retires per arted tier
(it would muddy glass/tires/chrome); the HUD request chip now takes
its color from the drawn hue so chip-to-car matching survives.
Known, pre-existing and unrelated: the garage still renders the
coatroom tileset (all maps share one drop-in image — the per-map
keying debt already flagged in the inventory's wiring note).

## 2026-08-13 — SUV art lands; ROOF INSET ruled (multi-rect rejected)

SUV drawn (48×18 full-bleed, boxy roof) — exported with its six
palette variants through the CARS pass, no new wiring needed; the
loader and hue rotation are generic, and its body is art-defined
(48×18, +4 wide vs the specced 44 — same width-only amendment as the
sedan). Source had been saved to art/palettes/ by mistake; moved to
art/aseprite/ (the canonical home the export script reads).
MULTI-RECT COLLISION CONSIDERED AND REJECTED (human asked; agent
recommended against, human chose the alternative). Measured both
drawings: the top is level for ~half the length (sedan 19/44 columns,
SUV 27/48) and then the hood RAMPS down 1px per column to the nose
(6px sedan, 7px SUV). Findings that decided it: (1) a ramp cannot be
matched by any finite set of AABBs — 3 bands would still leave 2-3px;
(2) every band boundary becomes a LIP, and since Arcade has no
step-up, running toward the cabin would be blocked mid-roof — cars
are the garage's platform vocabulary and roofs are ROUTES, so that
trades a cosmetic artifact for a traversal one; (3) the artifact only
shows on the sloped nose, while the flat roof (43-56% of the length)
is pixel-perfect under one rect.
Chosen instead: CAR_TOP_INSET = 2 — the collision top drops 2px on
arted cars, the wheel line (body bottom) never moves. Roof reads as a
2px sink instead of a 6-7px float; deck headroom only grows (18→20,
14→16). Verified: sedan body 44×12 top 228 bottom 240, SUV 48×16 top
224 bottom 240, placeholder lux uninset at 56×16; landing on a roof
leaves Chexy grounded with feet exactly on the inset top (2px into the
drawn roof); instruments 58/58 green with both real widths, gaps
unchanged, no console noise. Restart needed to re-apply if dialed.
Harness note: the between-frame body.reset pitfall bit again — staged
placement must run inside time.delayedCall(0) or the render-snap
restore undoes it (the player never leaves spawn, which reads as a
collision failure).

## 2026-08-13 — Handoff 2026-08-12-a applied

- Sequence check: 2026-08-11-b applied ✓ (bf7003a).
- Items 1-3: the three art-track rulings ratified as shipped
  (collision-follows-art with its guard rails; CAR_TOP_INSET 2 over
  multi-rect, on the measured evidence — roofs are routes and
  traversal integrity outranks nose cosmetics; coatroom dressing
  layers stay hidden).
- Item 4: TILE SKINS ratified as a PROJECT-WIDE convention (maps
  speak role gids, skin tables translate per sheet, block-relative
  roles for multi-tile structures, delete-the-PNG reverts) — noted
  as such in assets/maps/README.md; applies to the garage and museum
  sheets when they land.
- Item 5: P2 forked to the artist — (a) complete the architecture
  layer (pillar rank at varied spacing + balcony rail + coats in
  shadow) or (b) shorten P2's repeat as an interim stopgap. Design
  lean (a); logged again when the artist calls it.
- Item 6: BRIEF-07 Session 2 ordered — GO. Noted: S2 does NOT close
  Act 1's round; the human's Act-1 round-1 verdict (front
  readability, medley texture, climax window, arc sag, breath beat)
  is still owed, and rounds run parallel to build per the garage
  precedent.
- Item 7: ruling entry appended verbatim below.

2026-08-12 — Art-track rulings ratified (handoff
2026-08-12-a): collision-follows-art with guard rails,
CAR_TOP_INSET over multi-rect (measured), skins canon
project-wide, P2 forked to the artist (lean: complete
it). S2 ordered; Act-1 round verdict still owed.

## 2026-08-13 — BRIEF-07 SESSION 2 EXECUTED: Boss Door + the King's core

Shipped at the brief's second seam (S3 remains: full kit, phase
tables, the scripted ending):
- BOSS DOOR checkpoint. Act 1 ending on the rush timer no longer ends
  the run — it banks losses AND score to the registry, empties the
  lobby, plays a breath beat (bossDoorBreathMs), then opens Act 2 in
  the same run. Three losses in Act 1 still ends it. A boss defeat
  retries ACT 2 ONLY with the bank restored exactly; the checkpoint
  clears on victory and on exit, so a fresh run can never resume a
  stale one. Hangers judge the FULL SHIFT (losses accumulate across
  acts — they are never reset at the door).
- PaperTicketKing entity: three phases, shrinking bodies (128/104/80,
  crown spools 5/3/1), speed scaling UP as he shrinks, phase 3
  descending to floor level, chest-ticket meter drawn on the body
  (the interim-art allowance, §4).
- TIER-WEIGHTED RETURN METER as amended: returns add the item's weight
  (1.0 / 1.5 / 2.0), thresholds 12/15/18 POINTS per phase. Rips
  regress by exactly the ripped weight and restores re-add it —
  symmetric, so bookkeeping can never drift. stealRefund never built.
- CLAW = giant elite with rip grammar: telegraphs over a racked
  return, then rips — the return un-counts, the meter regresses, the
  item goes RE-TAGGABLE, and the claw carries the chip home. NO new
  loss channel: the King undoes work, he never creates losses. Two
  counters: tap during the telegraph (the rip never happens) or stun
  the carrier (item re-racks, meter re-adds the same weight). The
  claw reaches the tap's rescue class through a new base extension
  point (stunnableCandidates) so it is stunnable WITHOUT ever seeing
  the thief AI.
- Act-2 returns stay RACKED on screen (they must persist for the claw
  to rip them); arena locks to a single 480px screen with the player
  confined; Stub Spew minions run the standard thief stack with
  per-phase steal cooldowns; act 2 runs its own wave schedule on a
  fresh clock (73 points of returns available against 45 needed).
- WATCHDOGS brought forward from S3 (the state machine is S2's
  deliverable, so it ships guarded): every phase transition arms a
  timeout that forces the state and warns.
BUG CAUGHT BY THE BATTERY, fixed: a resumed Act 2 kept Act 1's
countdown running and would have "won" the shift when the old clock
hit zero. Act 2 has no rush clock — the fight ends on the meter — so
the timer now dies in startAct2(), the one place both entries
converge.
Verified (S2 acceptance): two-act run with the bank correct at the
door, arena locked to 480 with the player inside and boss waves live;
meter arithmetic on a tier-3 item — return +2.0, rip −2.0 (item
re-taggable), restore +2.0 (re-racked); telegraph counter-tap leaves
the meter untouched and the return intact; watchdog forces a stalled
transition and warns; boss defeat → retry restores lostItems 1 /
score 500 at phase 0 with the act-1 clock dead; victory reports
full-shift losses (1 → two hangers) and clears the checkpoint. No
console errors.
Harness note for future batteries: Phaser REUSES the scene instance
across restart() (init/create re-run on the same object), so scene
identity cannot discriminate a restart — wait on restored STATE.

## 2026-08-13 — Luxury car art lands: the garage car field is fully drawn

car-lux drawn (60×16 full-bleed, low sleek profile) — exported with
its six palette variants through the CARS pass; body art-defined at
60×16 with the standard 2px roof inset (body 60×14, roof line 226,
wheel line 240). Width +4 vs the specced 56, the third consecutive
+4; every height came in exactly as ratified, so no parked bottom
ever moved. Verified: all three tiers' bodies exact (44×12 / 48×16 /
60×14, each inset 2 with the wheel line untouched), landing on a roof
grounds Chexy with feet on the inset top, tightest gaps 66px ground /
22px deck, instruments 58/58 green with floor 1.558, gap crossings
unchanged, no console noise.
MEASUREMENT FLAGGED, not acted on: the lux has the steepest nose in
the field — an 8px ramp over 29 columns, with only 27% of its length
flat (sedan 6px, SUV 7px). At the shared inset it still floats ~6px
at the very tip. Recorded in the inventory with the remedy if play
dislikes it: a PER-TIER inset table (lux 3, others 2), never a deeper
inset for every car.
With sedan, SUV and lux drawn, the garage's interim tinted rects are
fully retired — CAR_COLORS now only serves levels that have no car
art at all. Remaining garage art: the tileset (which also lands the
per-map tileset keying) and parallax.

## 2026-08-13 — Garage tileset, first drop (ground) + per-map tilesets

Artist drew garage-tile.aseprite: row 1 = three walked SURFACE tiles
then two FILL tiles, nothing else yet. Wired via the skin convention:
the garage floor is two rows, so the skin splits them by y — row 15
takes the 3-tile surface period, row 16 the 2-tile fill.
PER-MAP TILESETS LAND WITH IT (the debt flagged in the inventory's
wiring note is retired): every assets/tiles/<name>.png now loads as
texture 'tiles-<name>' and a level's skin names the sheet it wants,
so the garage no longer borrows the coatroom's tiles. coatroom.png
keeps the legacy shared key 'tiles' as the no-skin fallback; the
coatroom skin's texture renamed 'tiles2' → 'tiles-coatroom2'.
Two judgement calls, both interim and logged: (1) DECKS have no art
yet and their caps live at gids 6/7 — empty slots in this sheet — so
untouched every deck would have lost both ends. The skin temporarily
reads deck middles AND caps from the surface period; they read as
concrete slabs until deck art lands. (2) bg2 dressing left VISIBLE:
its tiles are 1-wide, 6-tall runs every 12 columns and gid 5 lands on
a fill tile, so the far dressing already reads as concrete support
pillars — a happy accident of this sheet's layout.
Verified: garage texture is tiles-garage, row 15 reads 1,2,3,1,2,3,
row 16 reads 4,5,4,5, deck caps visible and solid, ground solid, bg2
visible; COATROOM REGRESSION CLEAN (its own sheet, floor period
1,2,3,4 unchanged); no console noise.
Harness note: launch()/start() live on a SCENE's plugin, not the
SceneManager — and inside an async IIFE that mistake rejects
silently, surfacing only as a timeout.

## 2026-08-13 — Garage pillars: skins now dress BACKGROUND layers too

Artist pointed the two tiles at sheet (0,16)-(15,47) — gids 9 and 17 —
at the concrete pillars. Read from the pixels rather than assumed: gid
9 dithers Concrete Deep→Dark across its TOP rows, gid 17 dithers back
out across its BOTTOM rows, so they are a vertical PAIR — stacked
9,17,9,17 they read as precast segments with a dark joint every 32px.
Wired as a new `dressing` role, which required extending the skin
system: applyTileSkin now skins DRESSING LAYERS (bg1/bg2), not just
the collision layer, and the per-tile context grew `dy` beside `dx` —
so multi-tile structures skin correctly whether they run horizontally
(the coatroom counter) or vertically (these pillars), wherever the map
places them. `hideDressing` and `dressing` are mutually exclusive per
skin. The remap moved into a reusable skinLayer(layer, roleOf, skin).
Verified against the SHIPPED map geometry (my first probe used
coordinates recalled from the exodus generator and read nulls — the
garage's pillars are at columns 12, 36, 60… every 24, and are ELEVEN
tiles tall, rows 4-14): the pillar reads 9,17,9,17,9,17,9,17,9,17,9 —
fading in at the top, meeting the floor on a solid edge. Ground,
decks, collision, and the coatroom regression all unchanged; no
console noise.

## 2026-08-13 — Garage deck strips + floor breakers wired

Artist exported row 2 of the garage sheet: deck left cap (gid 10),
middle (11), right cap (12), bay-number breaker (13), oil-stain
breaker (14). The deck stopgap that borrowed surface tiles is retired
— decks now render their own double-faced art (walked top, visible
underside), caps correctly oriented (transparent outer edges,
confirmed from the pixels).
Breaker placement (agent's call, easily vetoed): the ground's 3-tile
surface period is interrupted on two OUT-OF-PHASE cadences so they
can never line up into a grid — bay numbers every 23 columns (a
wayfinding rhythm), oil stains every 17. Oil stains also ride deck
middles about once per deck: the pixel evidence supports it, since
BOTH breakers carry the DECK tiles' exact edge signature (Bay Paint
White walked top, Concrete Mid underside) rather than the ground
surface's Asphalt Light bottom. Flagged to the artist: on the ground
row that leaves a 1px seam difference against neighbouring surface
tiles — invisible at 480×270, but if the breakers were drawn strictly
as DECK tiles they come off the floor in one line.
Verified: deck strip reads 10,11×5,14,11×6,12 with caps solid;
surface row 1,2,3,1,2,14 (the x%17 cadence); bay breakers at columns
11/34/57, oil at 5/22/39/56; pillars still 9,17,…; collision
unchanged; coatroom regression clean; no console noise. Note for
future skins: a middle's `dx` counts from the MIDDLES run, not from
the cap — the caps are their own index.

## 2026-08-13 — Floor and deck oil stains separated (artist correction)

Artist's correction: the row-2 oil stain (sheet index 14) is for DECKS
ONLY, and a dedicated FLOOR stain landed at sheet (80,0)-(95,15) =
index 6. Wired exactly: ground uses 6 on its cadence, deck middles use
14 on theirs, and the battery now asserts the deck stain NEVER lands
on the floor. The pixels confirm why they can't be interchangeable —
each breaker carries the bottom edge of the surface it belongs to (the
floor stain meets Asphalt Light fill, the deck stain is an underside
in Concrete Mid). The same export also moved the BAY-NUMBER tile's
bottom edge to the ground signature, which retires the 1px-seam
caveat logged in the previous entry: every breaker now matches its
surface exactly, with no compromise anywhere in the garage.
Naming trap noted in the skin comment for future readers: a SHEET
index is not a map ROLE gid — sheet index 6 is the floor oil stain,
while map gid 6 means "deck left cap" and skins to index 10.
Verified: surface row 1,2,3,1,2,6; deck 10,11×5,14,11×6,12; floor
stains at columns 5/22/39/56, bay numbers at 11/34/57; pillars,
collision, and the coatroom regression unchanged; no console noise.

## 2026-08-13 — Two more garage floor breakers (crack, drain grate)

Artist added a hairline CRACK (sheet index 18) and a drain GRATE
(index 19), both floor tiles — confirmed by their bottom edges
(Asphalt Light, matching the surface period rather than a deck
underside). The floor now runs a 3-tile base period broken by FOUR
tiles on out-of-phase prime cadences, ordered rarest-first so a
collision shows the more meaningful tile:
  grate  x % 37 === 18   (~2.7% — the loud one)
  bay    x % 23 === 11   (wayfinding rhythm)
  oil    x % 17 === 5
  crack  x % 11 === 4    (~9% — the subtlest)
Cadence chosen against MEASURED loudness (pixels differing from plain
concrete: grate 136/256, bay 42, oil 40, crack 28) — density runs
inversely to how much a tile shouts, leaving ~78% of the floor on the
base period. All four numbers are the tuning surface if play reads
busy or plain.
Verified: crack at columns 4/15/26/37/48/59, grate at 18/55, bay at
11/34/57, oil at 5/22/39/56, no collisions in the sampled span; the
DECK stain still never appears on the floor (asserted); decks,
pillars, collision and the coatroom regression unchanged; no console
noise.

## 2026-08-13 — Request chips carry SILHOUETTE, not just colour

Human report: two live requests of the same body colour are
indistinguishable in the HUD queue (a sedan from an SUV). Asked
whether the chips could be scaled car sprites.
RULED (agent recommendation, human's own alternative accepted):
scaling is rejected — the cars are 14-18px tall, so a chip-sized
version needs a ~0.35x NON-INTEGER downscale, which is mush and
breaks the nearest-neighbor discipline locked in DESIGN §5. The
answer is purpose-drawn icons at target size, which is also the
project's own precedent (the 12x12 collectible icons).
Shipped now (no art needed): the request-added event carries the
car's `kind`, and each tier gets distinct chip PROPORTIONS — sedan
16x7, SUV 13x10, luxury 18x6 — so shape separates them immediately.
Wired and waiting for art: assets/sprites/request-chips.png, one
16x10 frame per tier in sheet order sedan / SUV / luxury, drawn FLAT
(white or light gray) because the HUD tints each chip with its car's
hue — colour-matching to the car survives, shape is added on top.
Boot loads it as a spritesheet, the ICONS export pass covers it, and
the gold luxury dot retires automatically when the art lands (the
silhouette says luxury by itself).
Also fixed: adding request-chips to the ICONS list would have broken
the next export run, since the script errors on a missing source. The
ICONS pass now SKIPS undrawn sources, matching the CARS pass.
Verified: three requests fired with an identical forced hue produce
three distinct chip shapes (16x7 / 13x10 / 18x6), all correctly
tinted; no console noise.

## 2026-08-13 — Request-chip silhouette icons landed

Artist drew request-chips (48×10 strip, three 16×10 frames: sedan /
SUV / luxury, flat cream so the HUD tint carries each car's hue).
Zero wiring needed — the drop-in path shipped ahead of the art. The
fallback proportioned rectangles stepped aside automatically and the
gold luxury dot retired, as designed: the silhouette says luxury by
itself now.
Verified with three requests forced to an IDENTICAL hue (the exact
case the human reported as unreadable): each chip is an Image at
16×10 on its own frame 0/1/2, all correctly tinted, and each chip
container holds a single child — proving the gold dot is gone. No
console noise.

## 2026-08-13 — Handoff 2026-08-12-b applied

- Sequence check: 2026-08-12-a applied ✓ (4df3b8f).
- Item 1: S2 ratified as shipped — nothing outstanding.
- Item 2: HUD chip ruling ratified. The standing note is now CANON in
  DESIGN (§5.x, "Pixel-art scaling law"): draw at target size, tint at
  runtime, never scale pixel art non-integrally — recorded after the
  second refusal of a scale-down shortcut.
- Item 3: skin convention extended and ratified (background layers +
  dx AND dy on every role); carries forward to the museum and exodus
  sheets when they land.
- Item 4: BRIEF-07 Session 3 ordered — GO. Interim rect King is
  acceptable throughout; BRIEF-ART-06 runs parallel.
- Item 5: ruling entry appended verbatim below.

2026-08-12 — S2 ratified (handoff 2026-08-12-b): the
King's core, the Boss Door bank, tier-weighted meter,
rip-grammar claw, dead-clock fix. HUD silhouette chips
ratified; no-non-integer-scaling recorded as canon. Skins
gained bg layers + dy. S3 ordered. Act-1 round verdict
still owed.

## 2026-08-13 — BRIEF-07 SESSION 3 EXECUTED: the King's kit and his ending

The finale is code-complete (interim rect King; BRIEF-ART-06 runs
parallel). Shipped at the third seam:
- PAPER CARPET: a litter zone running the swarm contact-slow rules
  exactly — speed CAP at slipFactor (0.45), refresh-not-stack, NOT
  interrupt-class — and DASH CROSSES IT CLEAN, the dash's promised
  finale moment. Verified: capped at 68px/s (= maxSpeed × slipFactor)
  walking, full 400 through a real dash.
- TICKET TORNADO (phase 2+): scatters UNCHECKED items to fresh
  positions through the placement-validity gate. Racked returns are
  never touched and nothing is ever lost — re-routing pressure only.
  Verified: 3 moved, 3 alive, racked untouched, 0 embedded, 0 losses.
- GRAB CHEXY (phase 3): telegraph → lunge → held, escaped by mashing
  any key; costs TIME, never items; interrupt-class (breaks a hold)
  and grants grace on release. A GRACED player is immune outright.
- LAST GASP: one scripted all-out wave at bossLastGaspFrac (0.9) of a
  phase threshold, firing once and never advancing the phase itself.
- THE ENDING, scripted and short: crown falls with an oversized
  clatter → body bursts into dead stubs → the 0045 stub flutters down
  swaying → a rubber stamp slams with a screen shake → results under
  DEATH TO THE PAPER TICKET, LEADING with ITEM RETURN RATE (the
  number the whole game argues). Verified end to end: finale flag
  true, headline and first line correct, sequence ran ~3.4s.
THREE BUGS CAUGHT BY THE BATTERY, all fixed:
1. The grab's lunge never connected — the King's idle drift overwrote
   the lunge velocity every frame. He now hands his state to the grab,
   and the WATCHDOG was widened to cover it: a stuck transition still
   completes, any other wedged state returns to idle. The watchdog
   earned its keep on the first new state it met.
2. The mash escape was dead on arrival: Player.update consumes every
   key through JustDown before the boss code runs, so a JustDown check
   there could never see a press. Mash detection now does its own
   isDown edge tracking.
3. The Boss Door cue used 'rushEnd', which has no synth — it was
   silent AND warning. Swapped to 'chime'.
INSTRUMENT SCOPE (applying the -11-b per-level-grammar ruling, flagged
for ratification): the travel budget reads N/A in Act 2. The arena is
a single 480px screen, so serial routing feasibility is answered by
the arena itself; left running it fired RED on tight simultaneity a
player can both see and reach. Act 1's 2112px venue still prices it.

## 2026-08-13 — Handoff 2026-08-13-a applied

- Sequence check: 2026-08-12-b applied ✓ (f9db080).
- Item 1: P2 fork resolved by the artist — completed, not stopgapped.
  Verified in the shipped file rather than taken on faith: p2.png now
  carries ink in 556 of 1280 columns (was one lonely pillar) — THREE
  full-height pillars at 200 / 533 / 1031 with 499 columns of rail
  spanning 195..1054, i.e. a rank with the rail running pillar to
  pillar. Columns 1055-1279 stay empty, so the repeat-x wrap is still
  seamless. Coats-in-shadow cut from the spec.
  TRANSCRIPTION NOTE: the handoff cites "BRIEF-ART-02 §4's P2 line",
  but the P2 content line lives in the §2 layer table (§4 is the
  export/wiring contract). Amended the §2 table row, which is the line
  that actually specified coats-in-shadow — intent applied, location
  corrected.
- Item 2: the coatroom parallax stack is COMPLETE. Regression clean
  after the drop: all four layers track their scrollFactors (p4
  5.5/5.5, p2 49.5/49.5, p1 77/77 at scrollX 110), p3 rides its crowd
  sway (23 vs 22 base), the glow pulses (0.988 → 0.366), other levels
  still boot with empty stacks, no console noise.
- Item 3: ruling entry appended verbatim below.

2026-08-13 — Coatroom parallax COMPLETE (handoff
2026-08-13-a): P2 resolved as pillar rank + pillar-to-
pillar balcony rail, coats-in-shadow cut. Level 1 is the
first fully dressed level — skinned tiles, four painted
layers, glow, sway, real items, music. Sconce flicker is
its last art item.

## 2026-08-14 — BRIEF-ART-06 landed; the King's art drop-in wired ahead

The human added BRIEF-ART-06 (the King's three bodies — the game's
largest drawing project) and art/palettes/paper-king.gpl (16 colours:
the shared paper family plus crown reds, tear-edge dark and a gold
glint that are HIS ALONE — kin to the swarm, royalty over it).
Wired ahead of the art so the brief's §4 order works without a code
session in the middle:
- Each body state is its own tagged atlas (king-intact / king-torn /
  king-ragged), loaded per state and registered SPRITE-LOCALLY per
  the 2026-07-30-a namespace policy. Per-state drop-in is what makes
  §4 step 1 possible: the STYLE-PROOF GATE drops state 1 alone over
  the interim rect King, judged at arena distance, while states 2-3
  keep their rects.
- The characters export pass gained the missing skip guard, so
  running the export before the King is drawn prints "skipping"
  instead of failing (the same fix the icons and cars passes needed).
- The King prefers drawn art per phase and falls back to its rect,
  playing the 'idle' tag only when the atlas actually declares it.
Boss battery re-run after the wiring: ALL PASS, no console noise.

## 2026-08-14 — Trailing edge CARRIES Chexy (animation fix)

Human report: letting the auto-scroll edge push her looked very odd —
asked for the screen to slide her along in idle instead. Cause found
in one line: the edge push set velocity to 60 + scrollSpeed (105),
and Player's anim rule is |vx| > 10 → 'run', so a player standing
still at the edge was shoved along playing a FULL-CLIP RUN cycle.
Fixed by making the push a position clamp only — the screen carries
her at exactly scroll speed with velocity untouched, so she rides in
IDLE (or teeter at a ledge, jump/fall in the air). Walking against
the scroll still animates as running, because then she really is.
BRIEF-05 §3's "firm bouncy nudge" wording amended in place to "the
screen CARRIES her" — flagged for design-chat ratification since
BRIEF-05 is closed; treated as presentation polish on a direct human
report, not a lever change.
Verified: 160 idle frames and ZERO run frames across a 1.5s carry,
max |vx| 0, still on-screen, and the steady-state carry distance
equals the scroll distance exactly (45px/45px). Walking left at the
edge still reads 'run' at vx -150. Regressions clean: the anti-crush
slide-through still crosses a yielding car (it never needed the
boost — the carry does it), dash-through and both showcase-gap
crossings unchanged, instruments 58/58 green, no console noise.

## 2026-08-14 — Sedan re-export + the garage's first painted layer (P3)

Sedan re-exported again: all six variants IN SYNC (identical pixel
data, correct body pairs), geometry unchanged at 44×14 with the same
0-6 nose ramp, so no collision, inset or parked-bottom facts move.
Body battery re-run green.
GARAGE P3 landed (960×270, the far wall: Action Blue "EXIT →" glow
and city-night window slots). Checked before trusting it: ink in all
960 columns, and the repeat-x wrap is PIXEL-PERFECT — 0 of 270 rows
differ between column 0 and column 959. That matters more here than
in the coatroom, since the garage's 8544px camera travel wraps p3
about 1.8 times per rush (vs 0.23 in the coatroom, where no layer
even completes one loop).
Verified live under the auto-scroll: the layer loads at depth −8,
tracks at its 0.2 factor (tile 41.6 vs 40.8 expected at scrollX 204),
and the garage stack correctly reports p3 ONLY — p2 and p1 stay
absent without complaint, which is the per-layer drop-in contract.
No console noise.

## 2026-08-14 — HUD NFC tag drawn at HUD scale (the scaling law again)

Human: the 12×12 world nfc-tag "doesn't scale very well in the HUD",
so a dedicated nfc-tag-hud (10×10) was drawn. Wired: the HUD counter
prefers it and renders at SCALE 1; the old path (nfc-tag, or the
generated placeholder) stays as fallback. Source added to the ICONS
export pass as nfc-chip-10x10:nfc-tag-hud.
Worth recording WHY this was already wrong: the counter had been
doing setScale(0.75) on the 12×12 icon — a non-integer squeeze, i.e.
exactly what DESIGN §5.x forbids, sitting in the HUD unnoticed since
BRIEF-04. That makes three applications of the law in as many days
(request chips, this, and the refusal to scale car sprites), and the
first where it caught existing code rather than a proposal.
Verified: the icon renders from nfc-tag-hud at scale 1, 10×10 source
and 10×10 on screen; no console noise.

## 2026-08-14 — Handoff 2026-08-13-b applied

- Sequence check: 2026-08-13-a applied ✓ (5199c95).
- Item 1: S3 ratified — WITH ONE DIVERGENCE FLAGGED AND RESOLVED IN
  THE CODE'S FAVOUR OF THE RULING. What shipped was a speed CAP
  (built from BRIEF-07 §3's reconciliation, "Paper Carpet = swarm
  contact-slow rules"); the ratification describes ACCEL/DECEL
  SCALING, which is BOSS-SPEC's original "slippery stubs / reduced
  traction" reading. Rather than leave the design record describing
  something the code doesn't do, the carpet was rebuilt to match:
  a new Player.traction multiplier scales acceleration AND
  deceleration (slower to start, slower to stop, TOP SPEED
  UNCHANGED — slippery, not slow), consumed each frame so a surface
  must re-assert it. The handoff's parenthetical is exactly right
  that dash immunity comes FREE: a dash sets velocity directly with
  acceleration zeroed, so the explicit dash guard is gone. Reversible
  in one commit if the design chat meant the reverse.
- Item 2: SCATTER CLAMP canonized — displacement obeys the placement-
  validity principle. Tornado destinations are bounded to the arena
  floor, inset from both walls, and pushed clear of the King's own
  footprint, with a far-side fallback if every roll lands under him.
  No item can be thrown where only he can reach it.
- Item 3: LAST GASP SPLIT implemented. The spawn burst stays exempt
  from pacing (the swarm is the spectacle); steal INITIATIONS inside
  the window (bossLastGaspMs 6000) run lastGaspStealCooldownMs (2000)
  instead of the phase clock. Confirmed rather than assumed that the
  "impossible by construction" guarantee holds: every steal passes
  ONE global gate (lastStealAt), so a cooldown value can only space
  chases — it can never permit two at once, at any setting.
- Item 4: ruling entry appended verbatim below.
Verified: carpet start-up crawls (72px/s at 120ms) while top speed
stays 150 and a dash crosses at the full 400 with no guard; scatter
destinations clear of the King and inside the arena; gasp clock 2000
vs the phase's 5000; grab, grace immunity, and the ending unchanged.
No console noise.

2026-08-13 — S3 ratified; BRIEF-07 build COMPLETE
(handoff 2026-08-13-b). Scatter clamp canonized
(displacement obeys placement validity). Last Gasp split:
spawn burst free, steals on a compressed dedicated clock
— the exemption pattern holds even at the climax. The
game's full gameplay surface now exists; rounds are the
remaining distance to Gate 3.

## 2026-08-14 — DEV-only boss skip (playtest tool)

Human asked for a way to skip to the boss fight for playtesting.
Added: press B during Act 1 of The Mass Exodus and the run banks as
it stands, then opens the Boss Door. Two deliberate choices — it
takes the REAL transition path (bank → breath beat → Act 2) rather
than teleporting into the arena, so what gets playtested is the
shipping transition; and whatever losses/score you have at the
moment of the skip are what the boss inherits, so specific states
are settable (skip at once for a clean fight, or take a loss first
to exercise full-shift hanger math).
Gated on import.meta.env.DEV, so the key cannot exist in a built
game. 'B' collides with nothing (R/C results, ESC/P pause, F jitter
capture, Z/J/X/K/SPACE gameplay). Debug shortcuts are now documented
in the README next to the testing notes — the tuning panel and
jitter capture had only ever been discoverable by reading source.
Verified: mid-run state (score 250, 1 loss) banked exactly, Act 2
reached with the King up at phase 0, arena locked; no console noise.
NOTE for the human: the exodus still needs a museum clear to appear
unlocked on the level select — say the word if a dev-only unlock
there would help.

## 2026-08-14 — Garage P2 lands; tile columns matched to the painted rank

Artist updated garage/p3.png, added garage/p2.png, and redrew the
TILESET pillars to resemble p2's columns — deliberately relating the
two ranks rather than differentiating them (the inverse of the
guidance offered when the stack was specced; the artist tested it and
called it).
Checked rather than assumed:
- p3 960×270, ink in all 960 columns, wrap PIXEL-PERFECT (0/270 rows
  differ).
- p2 1280×270 = FOUR full-height pillars, 21 columns wide, at x 0 /
  245 / 740 / 988 — varied spacing (245, 495, 248), which is the
  anti-metronome guidance honoured. Its wrap difference (3 rows) is
  benign: the leftmost pillar sits flush at x=0 with an empty right
  edge, so repeats read pillar-gap-pillar and nothing splits.
- Tileset pillar pair still occupies gids 9/17 as full 16×16 tiles,
  so the skin's dressing role is unaffected by the redraw.
- request-chips was updated too (unmentioned): still a 48×10 strip,
  three frames, and the chip battery re-ran green.
Verified live: the garage stack now reports ['p3','p2'] at depths
−8/−7, each tracking its own factor exactly (p2 90.9/90.9 at scrollX
202; 5/5 when framed at the level start). Screenshot with a painted
pillar mid-frame confirms the two ranks read as related-but-separate
depths, with p3's EXIT signage and city windows behind them.
Harness note: a screenshot path renamed in one patch but logged under
the old name in another had me reading a STALE capture and briefly
suspecting tool caching — the file was simply never overwritten.
Distinct filenames per capture, and trust the numbers over a
familiar-looking image.

## 2026-08-14 — Sodium light pools: the fg layer's first use

The garage tileset arrived with three pool tiles (gid 20 left, 21
middle/hotspot, 22 right), drawn exactly to the inventory §(d) spec:
opaque 16×16, dithered on near-black, warm ramp (27,26,23) →
(92,36,16) → (147,64,15) → (200,90,18) → (240,162,74), with the middle
tile dithering Hotspot (255,217,160) against the dark.

Wiring: the `fg` layer is now captured as `this.fgLayer` in
LevelScene.buildMap and gets `Phaser.BlendModes.ADD` when its skin
declares `fgAdditive: true` (garage does; the coatroom does not).
Additive is the whole reason the pools can be opaque art — the dark
end of the dither contributes nothing, the warm end brightens what is
beneath it. This is the first level in the game to use `fg` at all.

Placement rhythm (agent-side per §(d), proposed not ratified): 24
pools on the walkable ground row every 23 columns (368px — one per
parking module, ~1.5 pools per screen), plus 12 on row-12 deck tops
where the deck is solid under all three tiles. 36 pools, 108 tiles.

Finding from the first in-game look: the pools read as warm light
where they fall on dark or mid-dark pixels — the left/right falloff
tiles dither convincingly orange over the concrete. The MIDDLE tile
clips. Hotspot (255,217,160) added to the light concrete floor
(~150,150,155) saturates all three channels, so the core reads as a
white checkerboard rather than a hot centre. Code-side levers were
tested and rejected as fixes: SCREEN blend and ADD at alpha 0.6 both
land within a shade of ADD, because the floor is already bright enough
that any lightening blows out. The fix belongs in the art (a dimmer
hotspot, or sparser dither in the core), so the blend stays ADD and
the tiles ship as drawn pending the artist's call.

## 2026-08-14 — Lamp flicker (human request, same day)

The optional fg flicker from art/garage-inventory §(d) is in. One alpha
write per frame on the fg layer, so every pool on screen buzzes for the
cost of a single tint — no extra frames, no per-tile work.

Shape: two incommensurate sines, 0.65 × a 4200ms breath + 0.35 × a
700ms ripple. The sum stays in [-1,1], so `fgFlickerMin`/`Max`
(0.78/1.0) are hard bounds and nothing needs clamping; the mismatched
periods keep the pattern from visibly looping. All four values plus an
`fgFlicker` flag are TUNING keys with panel sliders.

Gate: flicker requires BOTH `fgAdditive` and `fgFlicker` on the skin.
Alpha-dimming an OPAQUE fg layer would let the play field bleed through
the art, so the two flags are deliberately separate — a future
non-additive fg (foliage, grating) gets no flicker.

Verified live: alpha swept 0.782→0.997 across 4.6s inside its bounds,
the panel's min/max retargeted the swing mid-run, and the flag pinned
alpha to exactly 1. The dip is currently hard to SEE, because the
clipped white core (previous entry) dominates the pool and the flicker
mostly modulates the falloff. It should read properly once the hotspot
comes down.

Follow-up the same day — the previous entry's verdict was HALF right.
After several art passes the human said the pools still looked bad and
was ready to cut them. The clipping was never really an art problem:
additive light can only brighten what has HEADROOM, and the garage
floor is light grey, so any warm value lands at white however it is
drawn. The room was the problem, not the tiles.

So the fg layer gains a partner: an AMBIENT SCRIM. One screen-fixed
MULTIPLY quad at depth 7.5 — above the play field, below the pools at
depth 8 — dims the room so the additive light has somewhere to go.
`TUNING.fgAmbient` 0.7, panel slider, skins opt in with `fgAmbient`.
UIOverlay is a separate scene rendered after, so the HUD never dims.

Ambient sweep, same tiles, no art changes: at 1.0 the pool core clips
white (today's original finding); at 0.7 it reads as warm orange
dither with the room still fully legible; at 0.55 the pool looks great
but cars and elites start to disappear. 0.6 is therefore a GAMEPLAY
floor, not a taste one — this level's readability is load-bearing at
speed. Shipped at 0.7; the human can dial it live and the level
reverts to its old look at 1.0.

Testing note (cost two failed rounds): Vite serves an edited module at
`/src/config/tuning.js?t=<stamp>`, and a bare dynamic import of the
unstamped path returns a SECOND instance the running scenes never
read. Harness writes to TUNING silently did nothing — including
`godMode` in earlier harnesses this session, which means some of those
runs were not actually in god mode. Resolve the real URL from
`performance.getEntriesByType('resource')` and import that.

Second testing note: `npx prettier --write` on this repo runs with NO
project config (there is no .prettierrc) and reformats to defaults —
it added semicolons throughout two files and turned a 20-line change
into 1800 lines of churn, which was committed before it was noticed.
The formatting was restored and the change re-applied by hand. Do not
run a formatter here; match the surrounding style instead.

## 2026-08-14 — Lamp flicker: human values from play

Panel dump diffed against tuning.js: THREE keys moved, nothing else.

- fgFlickerMin  0.78 → 0.44 (the dip roughly doubles in depth)
- fgFlickerHumMs 4200 → 4600
- fgFlickerBuzzMs 700 → 250 (a 4Hz stutter, not a ripple)

Character change worth naming: the shipped default was a subtle breath
on a healthy lamp. These values read as a FAILING tube — deep, fast
stutter. That reads as the right call for a valet garage at the end of
a long shift, and it also means the flicker survives the ambient dim
instead of being lost in it. Ambient stayed at 0.7, so the sweep
verdict from earlier today is ratified by play, not just by capture.

Verified at the new values: alpha sweeps 0.444→0.993 inside its
bounds, flag still pins to 1, no console noise.

Accessibility note, not a blocker: 250ms puts the ripple at 4Hz, which
touches the 3–5Hz photosensitive band. The mitigating facts are that
the flashing area is small (three 16px tiles per pool), the contrast is
low (warm dither on dimmed concrete), and it never covers the screen.
If a full-screen flash effect is ever added to this level, that
combination should be re-examined rather than assumed safe.

## 2026-08-14 — Garage tiles: pools redrawn (human art pass)

Re-exported from garage-tile.aseprite via export-sprites.sh; a full
re-export reproduces every other asset byte-identically, so only
assets/tiles/garage.png moved. Tile-by-tile diff of the sheet: gids
20, 21 and 22 changed, nothing else — the ground, deck, pillar and
breaker roles are untouched, so the skin table needs no update.

What changed inside them:

- The surround is now TRANSPARENT rather than drawn on black (242/256
  transparent in 20 and 22, 220/256 in 21). Identical under additive —
  transparent and black both contribute nothing — and easier to author.
- gid 21 (core) lost the clipping. It was a 50% checkerboard of
  (255,217,160) — 128 near-white pixels — and is now 36 pixels graded
  across the full sodium ramp, brightest (240,162,74). This is the fix
  for the white-checkerboard finding, and it works.
- gids 20/22 (falloff) went the other way: they now hold 14 pixels
  each of Sodium Ember (27,26,23) ONLY, luma 26. Under additive that
  is +27 red on a dimmed floor — visually nothing.

Consequence: the three-tile composition has collapsed to one effective
tile. Pools read as a single ~16px cone rather than a 48px pool with
spill. Captured in-game at ambient 0.7 and it genuinely looks good —
a focused downlight — so this is committed as-is, not held. But
whether the falloff tiles are meant to be near-empty is a question for
the artist: if the spill was drawn and landed on the transparent index
by accident, the numbers above are the tell. Placement still assumes
3-tile pools (24 ground + 12 deck), which is why the cones are spaced
as they are.

## 2026-08-14 — Garage pools: falloff answered

Third pass on the same three gids, nothing else in the sheet touched.
The previous entry's open question is answered: the falloff WAS meant
to carry light. Gids 20/22 now hold Sodium Mid (92,36,16) and Bright
(147,64,15) instead of Ember alone — brightest luma 83 against the
earlier 26 — so the cone spreads across all three tiles again while
the core keeps its graded, non-clipping ramp. Committed; the 3-tile
placement rhythm is once again the right assumption.

## 2026-08-14 — The wedge: dashing into a car that is leaving the screen

Human report: "As a car begins to scroll offscreen, it remains possible
to dash into it and get stuck until the car is fully scrolled offscreen.
If there is insufficient room to dash through the car, the player should
be pushed to the right until outside the car's collision rect."

Mechanism: dash-through assumes the far side of a car is reachable, and
extend-until-clear (2026-08-09-g) keeps the dash alive until it is. For
a car straddling the trailing edge the far side is OFFSCREEN — the edge
clamp cancels the dash's movement every frame, so the dash extends
forever and Chexy rides inside the car until it scrolls away.

Fix, in the human's terms. `isWedged(car)` is geometric, not a stuck
timer: insufficient room means the car's left side has already passed
the leftmost point Chexy can be carried to. A dash that overlaps such a
car ends immediately and latches `wedgeCar`; `updateWedge` then backs
her out to the RIGHT at `carEjectSpeed` (220, panel slider, above
maxSpeed so holding left can't beat it) until her left clears the car's
right. Position-only, like the edge carry — no velocity injection to
fight her input or her animation state.

Two things this fix got wrong first, both caught by the existing
dash-through suite rather than by inspection:

1. Latching the wedge before testing isPinch stole the anti-crush
   latch. Same resolution, but the crush GUARANTEE stopped recording
   itself. The pinch is now tested first.
2. Scanning for "embedded in a car" as the latch condition dissolved
   solid cars during ordinary play. The edge carry is a position
   teleport, so it shoves her a few pixels into a perfectly solid car
   every frame; the scan read that as a wedge and let her walk through
   a car she was meant to jump. The latch now comes from the dash path
   and nowhere else — a dash is the only thing that puts her genuinely
   inside a car.

Also: the wall guard tests a CHANGE (destination solid, current not)
rather than an absolute. A wedged body is usually clipping the floor
tile the car rests on, and an absolute test reads that as "walled in"
and never moves her.

Verified: escape in ~0.5s with no residual overlap; mid-screen cars
still dash-through with no eject; B1 pinch latch, B2 open-sky solidity,
A1/A2 dash-through and C air-dash all still pass; edge-carry idle
unchanged.

## 2026-08-14 — BRIEF-ART-07 (Bell Desk environment) + belldesk-env.gpl

Both landed in the repo. Step zero (§0) answered with
art/belldesk-inventory.md, measured off assets/maps/belldesk.json at
HEAD: 120×17 = 4 screens, ground rows 15/16 full width, ten platforms
in THREE tiers (row 6 ×2 at 7 wide, row 9 ×4 at 9 wide, row 12 ×4 at
6 wide), counter 9×2 at x55–63, bg1 twelve 1×1 tiles on row 3, bg2 six
11-tall column runs at x10/30/50/70/90/110, fg empty.

Sheet spec: art/aseprite/belldesk-tile.aseprite → assets/tiles/
belldesk.png, 128×64 (8×4 = 32 tiles), role-by-index table in the
inventory. The export pass is wired now (belldesk-tile:belldesk), so
the drop is automatic whenever the source appears — no code session.

Two brief/map disagreements flagged rather than guessed:

1. §1 specifies the desk hero block as "2-high, 4–6 wide"; the map's
   counter is 9×2. Default offered is a 4-tile period repeating across
   the 9 (ABCDABCDA) using the existing block-relative dx; a bespoke
   9-wide run is available as a table change, not a redraw. The artist
   picks BEFORE drawing the desk.
2. §0 says "two mezzanine tiers" and the map has three platform rows.
   Resolved without ambiguity: rows 6 and 9 are the mezzanines, row 12
   is the cart platforms named in §1. Note for the skin: all three
   tiers speak the same role gids, so the skin branches on y — which
   is why the sheet needs both a mezzanine strip and a cart strip.

Also recorded: the return zone is an object rect (x1040–1136), not
tiles, so nothing marks it in the floor today; and the garage's
lighting stack (additive fg + MULTIPLY ambient + flicker) is generic
and available to this level for lamp pools or chandelier spill, with
the garage's lesson attached — pools and ambient are one decision.

Numbering: BRIEF-ART-05 (Museum) is still absent from HEAD and still
owed by the design chat; ART-07 explicitly reserves it. Verified by
`ls BRIEF-ART-0*.md` — 01, 02, 03, 04, 06, 07 present.

## 2026-08-14 — Bell Desk desk: BESPOKE (human ruling)

The §1-vs-map disagreement is settled: the 9×2 counter gets a bespoke
9-wide drawing, not a repeating 4-tile period. Consequences applied:

- Sheet grows to 144×96 — 9 columns × 6 rows, 54 tiles. Nine columns so
  each desk row is one unbroken 144px run the artist draws straight
  across instead of a 9-tile block wrapping an 8-wide sheet.
- The `counter` role gets a nine-slot vocabulary: dx maps 0→8 onto
  indices 28–36 (top) and 37–45 (face), clamped so a wider counter in
  some future map repeats the last column instead of running off the
  sheet.
- The belldesk skin is WRITTEN NOW, ahead of the art. The texture
  doesn't exist, so useSkin is false and the level keeps its
  placeholder bones; the table wakes up when the PNG lands and
  deleting the PNG reverts it. No code session at drop time.

Proven live against a stand-in 54-cell canvas texture, because this is
the first sheet whose geometry disagrees with the map's declared
tileset (the map JSON says 8 columns / 24 tiles): Phaser's
Tileset.setImage recomputes columns and total from the IMAGE, reporting
9 / 54, and every role resolved to the promised index — ground period
1-2-3-4 with fill 8 and marble borders at x54/x64, mezzanine caps
10/13 on rows 6 AND 9, cart caps 19/20/21 on row 12, desk 28/32/36 on
top and 37/45 on the face, sconce 24, no index out of range, no
console noise.

One flaw the numbers exposed before any art existed: bg2 column runs
are 11 tall — ODD — so a 2-tile fade-in/fade-out pair ends the column
on its fade-IN tile exactly where it meets the carpet. Row 14 now takes
a dedicated plinth (index 27), leaving rows 4–13 as five clean pairs.
Better art anyway: columns have plinths.

## 2026-08-16 — Results music (human request)

Longer remixes replaced title.mp3 and coatroom.mp3, garage.mp3 arrived,
and success.mp3 was added with the instruction: play it at the
conclusion of a successful run of ANY level, when the summary screen
shows. A fail track is coming later.

Implementation keeps the drop-in contract. endRun looks up a results
track by OUTCOME — `success` when cleared, `fail` when not — and if a
real file exists, the level loop stops and that track loops under the
summary. With no file the old duck-to-30% happens exactly as before.
So `fail.mp3` needs NO code when it lands, and deleting success.mp3
reverts today's behaviour.

`audio.hasMusic(name)` is new and deliberately distinct from
startMusic's own fallback: level tracks fall back to the generated
chiptune stub, results tracks must not — a stub loop under a summary
screen would be worse than the duck it replaced.

success.mp3 is 38s, a real track rather than a jingle, so it loops like
any other music; the player can sit on the summary.

Verified live: level plays music-coatroom → clearing swaps to
music-success (looping, unducked, results panel up) → teardown/retry
returns to music-coatroom from the top → a FAILED run still ducks
music-coatroom, since no fail.mp3 exists yet. No console noise.

Harness note, second sighting: the stamped-URL rule applies to every
module, not just tuning.js. A bare dynamic import of AudioBus.js
returned a second `audio` singleton whose `.game` was null, so
hasMusic() answered false and every readout was empty — the code was
fine. Resolve the URL the page actually loaded.

Flagged, not touched: `music/_coatroom.mp3` and `music/_title.mp3`
(the pre-remix backups) are untracked but still inside the glob, so
Boot loads ~1.5MB of them at startup and a build would bundle them.
The human's files, so the human's call.

## 2026-08-17 — Handoff 2026-08-14-a applied

- Sequence check: 2026-08-13-b applied ✓ (logged 2026-08-14, this
  file). No handoff between it and this one.
- Item 0 — reference drop verified present before applying. First
  attempt STOPPED and asked: the files were absent (searched
  art/reference/, repo-wide `find -iname`, `git log --all` for the
  paths). The human then dropped them. Committed here:
  belldesk-faena-chandelier.jpg, -desk-angle.jpg, -desk.png,
  -staircase.jpg (FOUR, where the handoff said three) and
  belldesk-gemini-carts.jpeg, -desk.jpeg,
  -elevator-door-stairs.jpeg (THREE, where the handoff said four).
  Names match the convention exactly; only the counts are swapped
  against the handoff's prose, so this was flagged rather than
  treated as a missing file. art/palettes/belldesk-env.gpl replaced
  with v2 (Faena direction), confirmed changed by hash.
- Item 1 — BRIEF-ART-07 amended, exactly the three listed targets:
  the mood paragraph (dusk/steel language and the disputed "only
  level people want to be" line deleted; Faena direction and the
  cove-crown ceiling identity in their place; anchor now Lacquer
  Face #732032 with Gold Leaf Bright #C89A32); a palette table
  carrying the v2 hexes; the parallax table (P4 upper wall + gold
  cove crown full-length with the dusk windows deleted, P3
  chandelier against the brass wall-grid mid-band, P2 mezzanine rail
  + curved-stair hero passage + revolving-door glow, P1
  carts/stanchions/palms). Layer sizes, seam rules, skin convention
  and the step-0 inventory left untouched, as instructed.
  Transcription note: the brief had NO standalone palette table to
  amend, so one was created and populated from belldesk-env.gpl v2
  verbatim (hexes derived from the file's RGB triples, not typed by
  hand). Flagged for correction if a different table was meant.
  NOT amended, because the handoff did not list them: §1's tileset
  bullets (still "deep muted burgundy field", palms as "the only
  green on the sheet") and the four Appendix concept prompts (all
  still describe dusk / steel blue / city silhouettes). Both now
  contradict the ruling in item 1 and are raised with the human.
- Item 2 — composite guard recorded. Walls are crimson, so at the
  FIRST SKIN DROP verify that Alert Red urgency flashes, crimson
  coats, and the carpet border remain distinct at a squint. The
  palette pre-separates them (Carpet Border Red #7A1622 is deep and
  explicitly non-semantic, well away from Alert Red #EA5151); the
  composite check confirms it in situ.
- Item 3 — the required line, verbatim:

"2026-08-14 — Bell Desk art direction changed to the Faena
inspiration (handoff 2026-08-14-a): crimson lacquer + gold cove
crown + leopard carpet; palette v2; dusk windows deleted;
cove-not-skylight ruled as ceiling identity; semantic-red separation
guarded by palette and composite check."

## 2026-08-17 — Untracked backlog committed; `_` means archived

Five commits for the files that had been sitting untracked:
BRIEF-ART-05 + museum-env.gpl (retires the reserved ART-05 number;
its law is a readability INVERSION — the one bright level, actors
saturated-and-darker on pale marble, squint test unchanged); fail.mp3;
the pre-remix Coatroom/Title takes; the Chexy GIF previews and
chexy.old.aseprite; the nfc-beep Audacity project.

fail.mp3 needed no code, as designed: the results lookup is by outcome
name, so the file landing IS the feature. Verified — a failed run now
stops the level loop and plays music-fail rather than ducking.

New convention, forced by committing the archived takes: a LEADING
UNDERSCORE on an audio filename means archived, and the loader skips
those files. Boot loads every file the audio glob returns, so without
the skip the two retired tracks would have been downloaded by every
player and bundled into every build — 1.5MB for takes nothing can
reference. Rename without the underscore to restore one.

Stale doc noted, not touched (it belongs to the human's brief, not to
me): BRIEF-ART-07's numbering note still says "ART-05 remains reserved
for the Museum, still owed by the design chat" — the debt is now paid.
That joins the §1-contradicts-the-Faena-direction and dusk-Appendix
items already awaiting a ruling.

## 2026-08-17 — BRIEF-ART-07 contradictions resolved

The Faena amendment (2026-08-14-a) touched only the three targets the
handoff listed, which left the rest of the brief arguing with itself.
The human asked for the contradictions fixed, so the direction is now
applied consistently:

- §1 lobby floor: "deep muted burgundy field with a quiet geometric
  figure" → LEOPARD, the two-value mottle with rosettes and a wood
  border, named in v2 swatches. The semantic-red guard is sharpened
  rather than dropped: the border's red is Carpet Border Red #7A1622,
  explicitly non-semantic, and #EA5151 appears nowhere in the
  environment (item 2's composite check still confirms it in situ).
- §1 desk: "2-high, 4–6 wide" → 2-high and 9 wide BESPOKE, pointing at
  the inventory's slots (28–36 top, 37–45 face). The brief had never
  caught up with the 2026-08-14 bespoke ruling — a contradiction with
  the shipped skin, not just with the new direction.
- §1 dressing: palms are no longer "the only green on the sheet"
  (malachite arrived with v2), and the column is three tiles, not two
  — the odd-run plinth finding.
- Appendix: all four concept prompts rewritten from dusk/steel-blue to
  crimson lacquer, gold cove crown, brass grid, curved stair. These
  are the highest-risk stale text in the file — run as written they
  would have generated the deleted direction.
- Header numbering note: ART-05's debt is paid, so it now says so.
- §3 step 3 relabelled "cove crown, wall grid, chandelier" (it read
  "sky, silhouettes", and the sky is gone).

Deliberately left: the two remaining mentions of dusk and skylight are
the amendment's own record of what was deleted and demoted, not
surviving direction.

## 2026-08-17 — Handoff 2026-08-14-b applied (item 2 verification deferred)

- Sequence check: 2026-08-14-a applied ✓. Note this handoff was
  received while its drop was not yet in the repo; the first attempt
  STOPPED and asked. The tiles landed during the exchange (14:49) and
  the work below is against them.
- Item 1 — drop 1 ratification recorded, with its ACTUAL scope
  measured off the sheet rather than assumed. `belldesk.png` exports
  reproducibly at 144×96 (9 cols × 54 tiles, as speced) and the level
  boots on `tiles-belldesk`. Drawn: indices 1–8 (leopard carpet
  sequence, brass medallion, worn patch, marble border, sub-floor
  fill) and 28–45 (the full bespoke 9-wide desk, top and face).
  Everything else is still transparent — mezzanine strip, cart
  platform, columns, plinth, sconce, palms. So of item 1's four named
  pieces, CARPET and HERO DESK are in; WALLS and COVE CROWN are not —
  those are parallax P4, and `assets/parallax/belldesk/` does not
  exist yet.
- Item 1, composite guard — run for real, PASSES on everything the
  drop can express, and the palette's pre-separation is confirmed by
  measurement: Alert Red #EA5151 sits at luma 127 against Carpet
  Border Red #7A1622 at 53 (RGB distance 135) and Lacquer Face
  #732032 at 59 (distance 132). At a squint the semantic red is the
  only bright red on screen. Caveat on record: the crimson-WALL half
  of the hazard cannot be tested yet, because the walls are the
  missing P4 — today the field behind play is near-black, which is a
  kinder background than crimson will be. The guard must be re-run
  when P4 lands.
- Item 2 — canon STATED: items are ONE DRAWING across all levels, no
  per-level item variants ever; the skin system dresses environments
  only. Verification DEFERRED, not skipped: the crimson-coat outline
  fix is not in this repo. `assets/sprites/coats.png` is unchanged
  since a9dd53e (2026-08-03), there is no coats source in
  art/aseprite/, and the three shipped coat frames are blue/blue/green
  with no crimson garment at all. Searched the repo, all of git
  history for those paths, and the usual staging spots. Nothing to
  composite, so nothing was forked and nothing was reported as
  verified. The Museum half is doubly deferred — it has no tileset
  and no skin, so its composite could only show placeholder bones.
- Item 3 — mezzanine strips ruled and transcribed into BRIEF-ART-07 §1
  and the inventory: Faena formal, NOT carpet. Marble Light walk top
  carrying the standable edge (the same marble as the desk top),
  lacquer face band, brass drip on the coffered soffit; leopard stays
  floor-only. Recorded alongside it as the reason: "bright marble =
  stand here" is now the level's promise, one cue for standable
  geometry, with cart platforms the deliberate object-not-architecture
  exception. The ruling needed NO code — the skin already routes rows
  6 and 9 to indices 10–14, which are the slots still to be drawn, so
  it landed exactly in time.
- Item 4 — the required line, verbatim:

"2026-08-14 — Bell Desk drop 1 ratified (handoff 2026-08-14-b):
composite guard passed; crimson-coat outline lightened GLOBALLY
(one-drawing-per-item canon stated); mezzanines ruled marble-top
formal, leopard floor-only."

## 2026-08-17 — Handoff 2026-08-14-c applied

- Sequence check: 2026-08-14-b applied ✓ (same session).
- Item 1 — marble border role retired. Mechanism note, because the
  handoff and the codebase disagree about WHERE the placements lived:
  the map never placed a border. belldesk.json's main layer uses only
  role gids 1/2/3/6/7 (ground, middle, counter, leftCap, rightCap) and
  the border was purely skin-side — `x === 54 || x === 64 → sheet
  index 7` inside the belldesk skin's `ground` function. Sheet index 7
  and role gid 7 are different number spaces, which is likely what the
  spec conflated. So the map needed NO edit; deleting the skin branch
  is the whole retirement, and the carpet period now runs straight
  through. Also updated: the inventory (index 7 marked retired and
  reusable, ground row note, order list now "7 tiles" not 8) and
  BRIEF-ART-07 §1's floor line, with "Marble border tiles where carpet
  meets the desk run" deleted as instructed.
- Verified in-game: sheet index 7 appears ZERO times across the main
  layer, and row 15 from x54 to x64 reads 3,4,1,2,6,4,1,2,3,4,1 — the
  4-tile carpet period unbroken beneath the hero desk, with only the
  worn-patch breaker at x58 interrupting it. No console noise.
- Item 2 — grounding note recorded, NOT applied: if the desk ever
  reads un-anchored, the fix is a 1px darker carpet shadow line under
  the desk base, never a floor material change. Logged in the
  inventory's §(c) so the artist sees it beside the desk spec.
- Leftover flagged: sheet index 7 is DRAWN (256 opaque px of marble
  border) but now referenced by nothing. Left in place — the art is
  the human's to clear or repurpose, and the slot is marked spare.
- Item 3 — the required line, verbatim:

"2026-08-14 — Marble border role cut (handoff 2026-08-14-c): orphaned
apron spec retired; desk sits on carpet per references; shadow-line
grounding pre-armed if ever needed."

## 2026-08-17 — Bell Desk: columns cut, potted palms placed

Human rulings, applied together.

COLUMNS CUT. All 66 bg2 placements removed from belldesk.json; the
layer is now empty. Indices 22/23 (the segment pair) and 27 (the
plinth) are free, and the odd-run plinth problem those runs created is
moot. A side benefit: dressing is bg1-only now, so bg1 and bg2 never
needed splitting into separate roles — the prerequisite I had flagged
for palms disappeared with the columns.

PALMS PLACED. The human drew a single 16×32 plant at sheet indices
**9 and 18** rather than the speculative 25/26, because those two sit
one directly above the other on a 9-column sheet and so could be drawn
in their proper orientation — the better choice, and worth remembering
as a sheet-layout lesson: a multi-tile object wants its slots stacked
the way the object is.

Placement (human: "flanking the desk is the appropriate placement"):
bg1 at x53 and x65, fronds row 13, pot row 14 — one plant each side of
the hero desk, which occupies x55–63. bg1 draws behind the main layer,
so they stand on the carpet behind the play plane. Room for two more
pairs at x45–49 and x71–75 if the level ever wants more rhythm.

Verified in-game: both palms resolve (9 above 18, both sides), bg2
reports zero tiles, the sconce line still resolves to 24, and the
carpet still runs unbroken under the desk. No console noise. At 3× the
plant reads as a slender potted palm sitting on the carpet line behind
the desk.

Doc updates: inventory sheet table (9/18 claimed, 22/23/25/26/27 freed,
column note replaced, order list), the bg1/bg2 role rows, and
BRIEF-ART-07 §1's dressing bullet.

## 2026-08-17 — CORRECTION to the -14-b item 2 record

The 2026-08-14-b entry states the shipped coat frames are
"blue/blue/green with no crimson garment at all". That is WRONG, and
the method was the fault: I read it off a single random spawn
(spawnItem picks a frame with Between(0,2)) instead of decoding the
sheet. Decoded properly, coats.png is 72×24 — three frames:

- frame 0 COBALT, body #2E6FD0 / #1E4C96
- frame 1 CRIMSON, body #C22F3A / #8E1F2C
- frame 2 OLIVE, body #55621C / #7A8C2E

So the crimson coat the handoff is about DOES exist and has since
f266092. What does NOT exist is the outline fix: no coat frame carries
an outline at all. Frames 0 and 2 hold four colours each — body,
shade, gold chip, accent — and no perimeter dark; frame 1 holds six,
of which the only warm brown (#3E2B20) is four pixels of detail, not a
rim. The coats read by value contrast against dark fields, per the
readability law, rather than by outline.

Item 2's verification therefore stays deferred, but for the accurate
reason: the crimson coat is present, the lighter warm-brown OUTLINE has
not landed, and there is nothing yet to composite. The conclusion did
not change; the stated basis for it was false and is corrected here.

Pre-armed finding for when that composite does run: frame 1 already
contains 12px of #E91717 and 14px of #C01818 — near-alert-red, bright
and saturated. Against Alert Red #EA5151 the separation is mostly LUMA
(63 vs 127), not hue, so the urgency flash stays distinguishable, but
this is the closest the item set comes to the semantic colour and it is
where the guard should look first.

## 2026-08-17 — Bell Desk item vocabulary: luggage and bags only

Human ruling: the Bell Desk should contain no coats at all — luggage
and bags (backpacks and the like) exclusively.

Measured first: it already does. All 22 item entries in
belldesk-waves.json are itemCategory "luggage", and a census of the
level's OWN schedule (spawnItem hooked, 90s of wave clock) spawned
luggage tier 1 and tier 2 and nothing else. The coats visible in
yesterday's composite screenshots were spawned by my test harness, not
by the game — worth recording, because a harness spawn is easy to
mistake for level content in a screenshot.

What was actually missing was a GUARANTEE. `spawnItem`'s signature
still defaults to `category = 'coat'`, so any wave entry that omitted
itemCategory would silently put a coat in the hotel lobby. Levels now
declare their vocabulary on the map (`itemCategories`, comma-separated)
and it is BINDING: a category from outside the list is corrected to the
level's first and warned about loudly in dev, naming the map, the
offending category and the fix. Belldesk declares "luggage". Maps that
declare nothing stay unrestricted, so the Coatroom, Museum, Garage and
Exodus are untouched — verified: the Coatroom still spawns coats with
coat art and no warning.

Still open, and the real content gap: LUGGAGE HAS NO ART. Every item in
this level renders as the interim tinted rect (teal #006483) in three
tier sizes — item-standard, item-medium, item-heavy — while coats have
had a drawing since f266092. DESIGN §3.2 specifies three weight tiers
for this level and the schedule uses two of them today. A luggage/bag
item spec (silhouettes per tier, collision, palette) is owed by the art
track; BRIEF-ART-03 §1 owns item rules, so it belongs there rather than
in ART-07, which is the environment brief.

## 2026-08-17 — Luggage kit: hold tiers are GROUPS (human ruling)

Ruling, and it reframes the mechanic's fiction: "For the items that
require a hold, rather than a single piece of large luggage, they should
be groups of luggage. Multi-tagging is a real process with Chexology,
and it takes longer than checking a single item."

So the hold is not weight, it is COUNT. Tier 1 = one bag (tap), tier 2 =
a pair (180ms hold = holdTagMs × holdTier2Factor), tier 3 = a trolley
load of three or four (300ms charged hold). The mechanic is unchanged —
only what it depicts — so DESIGN's "weight tier" language and the
`weightTier` / `tier` identifiers in code and wave files STAY. Renaming
them would be churn with no gameplay behind it.

Drawing consequence worth recording: groups grow WIDER, not taller. The
new frames are 16×14 / 24×16 / 32×20 against interim rects of 14×14 /
20×22 / 26×30 — tiers 2 and 3 get shorter and wider, because a group
sits on the floor and a tall monolith was the old "heavy" reading.

art/luggage-kit.md is the kit: sizes, the group semantics, the palette
exclusion table (Chexy orange, semantic reds, paper manila, and — new —
the Bell Desk's own carpet tans and lacquer crimsons, which bags would
otherwise sink into), and the chip's composite position so the drawing
leaves it room.

The sharpest constraint in it comes from the -14-b one-drawing-per-item
canon: luggage appears in the Bell Desk (dark field) AND the finale
(whose scene descends from the Museum and whose readability law is
INVERTED — pale field, darker actors). One drawing must survive both, so
the kit asks for internal contrast — darker shadow plane plus lighter
top plane — rather than overall brightness. No outline: nothing else in
the item set has one.

Wiring shipped ahead of the art, drop-in like everything else:
src/config/itemArt.js holds the tier→(key, w, h) table, BootScene globs
assets/sprites/luggage-*.png and slices each as a strip of same-size
VARIANTS (the spawner picks one at random, as coats do), spawnItem
prefers drawn bags over the interim rect and sets the body to the frame
(collision follows art, untinted — the chip carries the category), and
export-sprites.sh has the three ICONS entries.

Verified both directions with stand-in strips: with the PNGs present all
three tiers use their own strip at bodies 16×14 / 24×16 / 32×20,
untinted, three variants each; with the PNGs deleted every tier falls
back to item-standard / item-medium / item-heavy at the old sizes. The
belldesk vocabulary guard still corrects a forced coat to luggage. Build
clean, no console noise.

## 2026-08-17 — Handoff 2026-08-14-d applied IN PART (item 1 blocked)

- Sequence check: 2026-08-14-c applied ✓ (same session).
- Item 1 — CANNOT BE APPLIED, and this is the third handoff in a row to
  ratify art that is not in the repo. P4 and P3 do not exist:
  `assets/parallax/belldesk/` is absent, `git log --all` shows nothing
  ever committed under that path on any branch, and nothing named
  p4/p3/cove/chandelier is staged in the usual drop spots. There is
  also no drop report of mine whose flags could be resolved — the
  parallax has never been in front of this repo. Recording "P4/P3
  ratified, composite passing" would put a false claim in an
  append-only log, so it is held, not written.
- Item 1's PRINCIPLE is standing canon, though, and is recorded here
  because it governs every future drop: OFF-PALETTE VALUES SNAP to the
  nearest belldesk-env.gpl v2 ramp entry rather than extending the
  palette. Light-source cores MAY join the palette; surfaces MAY NOT.
- Applied that principle to the art that does exist, and it reports a
  real flag on the committed tilesheet. assets/tiles/belldesk.png is
  RGBA (PNG colour type 6, no PLTE) carrying **1820 distinct colours**
  against a 28-entry palette. Of 7906 opaque pixels only 1207 (15.3%)
  are exact palette entries; 4242 sit 9–20 from the nearest ramp entry
  and 1211 sit further than 20 — i.e. genuinely new values, not
  rounding. Per-tile counts confirm the cause is soft shading rather
  than hand-picked shades: 56 colours in the carpet tile, 95 in a desk
  top, 114 in a desk face, 118 in the palm fronds. Nine pixels carry
  partial alpha (anti-aliased edges). For contrast, the garage sheet is
  INDEXED (colour type 3).
  It looks good on screen today — the composites read fine — so this is
  not a "redraw" flag. What it costs is mechanical: the PLTE
  palette-swap pipeline (scripts/palette-variants.mjs, which gives the
  cars six hues for free) cannot touch an RGBA sheet, partial alpha has
  no meaning in an indexed export path, and 84.7% off-palette means the
  v2 ramps are documentation rather than the actual discipline. The fix
  is an Aseprite-side one: work in indexed mode against the .gpl.
- Item 2 — logged and made true. music/belldesk.mp3 was already
  committed (0c24adf), verified playing as the level loop with the
  results tracks still taking over. The outstanding Gemini keeper —
  belldesk-gemini-tiles.jpeg — is committed here. Manifest arithmetic
  differs from the handoff's prose again, so for the record the
  belldesk reference set in HEAD is now SIX Gemini keepers (carts,
  desk, elevator-door-stairs, 01, 02, tiles) and FOUR Faena photos
  (chandelier, desk-angle, desk, staircase).
- Item 3 — HELD, because its text asserts item 1. It will be appended
  verbatim the moment P4/P3 land, or immediately on the human's word if
  the design chat means it as bookkeeping ahead of the drop. The text
  is quoted in the session report so nothing is lost.

## 2026-08-17 — Handoff 2026-08-14-e applied

- Sequence check: 2026-08-14-d applied ✓ (same session, partial — item 1
  held pending the P4/P3 files; that hold is unaffected by this handoff).
- Item 1 — FINALE PARKED by product-owner ruling. Level 5 / boss rounds,
  King art (BRIEF-ART-06) and exodus/boss audio are formally parked in
  favour of polishing Levels 1–4. Rationale on record: L1–4 constitute a
  shippable game and polish compounds there first. Ledger effect,
  applied from the next report onward: the Act-1 round-1 verdict and the
  finale's first-play calibration (meter thresholds 12/15/18, telegraph
  windows, phase intervals) come OFF the "owed by the design chat"
  list. They are deferred, not forgotten, and return when the human
  reopens the finale. The boss-skip debug key (`B`, dev-only) stays
  wired, so reopening costs nothing.
- Item 2 — one SMOKE PLAYTHROUGH of the full shift is slotted as build
  insurance: a hold-together check, explicitly NOT a verdict session, to
  de-risk the never-played-end-to-end BRIEF-07 build before polish-era
  changes pile on top of it. The human schedules it. Any STRUCTURAL
  finding reopens the finale early.
- Item 3 — the polish backlog is the active board, in order, with its
  state at opening measured from HEAD:
    1. Bell Desk P2/P1 — no belldesk parallax exists at all yet (P4/P3
       still owed too, per -14-d's hold)
    2. Garage tiles/parallax — p2 and p3 present; **p1 absent**
       (1600×270, factor 0.7, wraps ~3.7× so it wants a rhythm)
    3. Museum pass (BRIEF-ART-05) — no museum tileset, no museum skin,
       no parallax; the brief and museum-env.gpl are in
    4. Coatroom sconce + tile variety — coatroom has the only COMPLETE
       parallax stack (p1–p4 + glow); the sconce flicker pair is owed
    5. Audio content + SFX pass — six music tracks in (title, coatroom,
       belldesk, garage, success, fail); the ONLY real SFX file is
       tag.mp3, so every other cue is still the generated synth
    6. Small ledger
  Code track wires drops as they land; no new briefs expected this
  phase.
- Item 4 — the required line, verbatim:

"2026-08-14 — Finale parked, polish phase opened (handoff
2026-08-14-e): L1–4 polish is the active board; L5/boss rounds + King
art deferred by product ruling; one smoke playthrough slotted as build
insurance."
