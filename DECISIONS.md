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
