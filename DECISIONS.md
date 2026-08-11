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
