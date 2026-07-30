# CHEXY'S BIG DAY — Game Design Document

**Title:** Chexy's BIG DAY *(from Derek's "Big Day!"
catchphrase; BIGGEST reserved for v2)*
**Status:** v1.0 — APPROVED (Gate 0 passed 2026-07-29). Changes now require a logged amendment in DECISIONS.md.
**Genre:** 32-bit-style pixel-art side-scrolling action game
**Platform:** Browser (HTML5), desktop keyboard only for v1
**Engine:** Phaser 3
**Audience:** Chexology team (internal fun project); developer learning project

---

## 1. Concept

You are **Chexy**, a squat, anthropomorphic squirrel and
Chexology-powered attendant, surviving increasingly chaotic check-in
rushes at venues and hotels. Every level is that venue's biggest day
ever. The villain is **paper**: paper claim tickets are the enemy
faction. Your tool is the NFC tag — tap items to check them in,
because *the customer is their claim ticket.*

A squirrel is thematically on the nose: the natural world's champion
of stashing items and retrieving them later.

Tone: fast, silly, affectionate workplace satire. No death, no
violence against people — the only thing you ever destroy is paper.

## 2. Core Loop

1. Items (coats, luggage, cars, strollers) enter the play area during
   a timed "rush."
2. Player moves, jumps, and **tags** items to check them in.
3. Checked items score points; guests send happy text bubbles.
4. Paper-ticket enemies interfere: block paths, steal untagged items,
   litter the floor with slippery ticket stubs.

   4b. **Rescue:** tagging a ticket enemy that is carrying a
   stolen item stuns it (tunable, default 1500ms) and drops the
   item, which becomes taggable again. The enemy gets a no-steal
   grace on waking (default 1000ms). Rescue interactions are
   ALWAYS instant tap, even for heavy items — the charged hold
   applies only to grounded heavy items. Rescues award no score
   and no clean-streak progress, and do not count against the
   player for adaptive difficulty: rescue is damage prevention,
   not a reward loop. Rescue gets distinct feedback (paper poof
   + dizzy effect) so it reads as its own verb result.

5. Rush ends when the timer expires. Performance graded on items
   returned, guests served, and NFC tags collected.

### 2.1 Fail state

- A stolen or expired item = **1 lost item** (angry guest text bubble).
- 3 lost items ends the run. Friendly retry, no lives system.

### 2.2 Controls (v1)

| Input | Action |
|-------|--------|
| ← / → | Move |
| ↑ or Space | Jump |
| Z or J | Tag (primary action) |
| X or K | Dash (unlocked in Level 2) |
| Esc / P | Pause |

### 2.3 Tagging model (RESOLVED — hybrid)

- **Standard items:** instant tap. Juice it hard: 2–3 frames of
  hitstop, particle burst, punchy SFX. Item spread in level design
  must make positioning matter (no stand-and-mash spots).
- **Heavy items** (weight tier 3, introduced Level 2): charged hold,
  250–350ms (tunable), radial meter on Chexy. While holding, Chexy
  is stationary and vulnerable — paper enemies can interrupt the
  hold, resetting the meter. This is the game's deliberate tension
  beat against the fast tap baseline.
- **Targeting:** generous auto-target radius (tunable, start ~1.5×
  Chexy's width) hitting the nearest valid item; the current target
  gets a subtle highlight/outline so the player always knows what a
  press will do. No precise-overlap requirement.
- All three values (hold duration, interrupt behavior, radius) live
  in `src/config/tuning.js` and get sliders on the debug panel.

### 2.4 Attention & feedback systems

The game tests prioritization, not information-gathering.
Off-screen untagged items are always signaled, in all levels:
- **Edge arrows:** pulsing screen-edge indicators, color-coded
  standard vs. heavy. Arrows encode urgency: pulse rate
  increases and color shifts toward Alert Red (#EA5151) as an
  item nears expiry or a thief approaches it.
- **Stereo audio cues:** item spawns, steals, and losses are
  stereo-panned relative to the player position.
Both systems get on/off toggles when a settings menu exists
(v1 requirement, low priority). Difficulty comes from wave
pressure, never from hiding information.

**Spawn fairness (unconditional, not adaptive):** an item may
only spawn at a point the player can plausibly contest. At
spawn time, validate: estimated player travel time to the
item ≤ nearest enemy's estimated travel time + grace
(straight-line distance / entity speed is sufficient; no
pathfinding required). If the wave file's spawn point fails,
fall back to the next-best listed spawn point for that wave
entry rather than dropping the spawn. Additionally, enemies
ignore items younger than a fresh-item grace period. Losses
must trace to player routing decisions, never to spawn
placement luck. Items neglected after their fresh window are
fair game at any enemy proximity.

## 2.5 Difficulty & Run Length (RESOLVED)

- **Adaptive difficulty with a score trade-off.** Each level has a
  baseline intensity (spawn rate, enemy count, heavy-item mix). If
  the player is struggling (lost items / interrupted holds above a
  threshold), intensity eases down — but a **score multiplier drops
  with it** (e.g., 1.0× at baseline, down to 0.7× at easiest).
  Recovering (a clean streak) ramps intensity and multiplier back
  up. Result: everyone finishes, but the high-score table still
  rewards playing at full heat. The current multiplier is always
  visible on the HUD so the trade is legible, and a small "heating
  up" cue plays when it ramps back — comeback should feel good, not
  punitive. Rescues are neutral: they neither ease intensity nor
  advance the clean-streak recovery.
- Adaptation range is clamped per level (a tunable ±band around
  baseline) so the finale still feels like a finale even on the
  easiest band. All knobs live in `tuning.js`.
- **Run length target: 15–20 minutes** for a full 5-level clear —
  office-break friendly. Per-level rush timers budget roughly:
  L1 2:30, L2 3:00, L3 3:00, L4 3:30, L5 4:00 + boss ~3:00.
  (Initial budget; tune in Phase 3.)

## 3. Levels

Each level adds exactly ONE new mechanic. No exceptions.

### 3.1 Level 1 — The Coatroom (tutorial)
Concert venue coat check, pre-show rush. Coats fly in; tag and rack
them before timers expire. Teaches: move, jump, tag, scoring.
**New mechanic:** none (tutorial).

### 3.2 Level 2 — The Bell Desk
Boutique hotel lobby. Luggage in three weight tiers; heavy bags need
a charged (held) tag per §2.3. **New mechanic:** weight tiers +
dash unlock. (Guest-matching sub-mechanic deferred to v2 — see §8.)

### 3.3 Level 3 — The Valet Garage
Auto-scrolling parking structure. Sprint to retrieve the right car
while ticket swarms fill the air. **New mechanic:** auto-scroll +
vehicle riding.

### 3.4 Level 4 — The Stroller Valet
Museum, chaos mode. Strollers, kid backpacks, sippy cups at high
density. **New mechanic:** item bounce physics (strollers roll).

### 3.5 Level 5 — The Mass Exodus (finale)
Sold-out show lets out; everyone wants their coat NOW. Escalating
waves, then boss fight.

### 3.6 Boss — The Paper Ticket King
Towering "Ticket #45" monster (nod to 45-minute paper-era lines).
Design TBD in a dedicated design session before Phase 3 implements
it. Victory screen shows "99% Item Return Rate."

## 4. Collectibles & Power-ups

- **NFC tags** — coin equivalent, scattered and dropped by enemies.
- **Phone number pickup** — auto-returns one item instantly.
- **Analytics star** — score multiplier for 10 seconds.
- Local high-score table only (no online leaderboard — see §8).

## 5. Graphics Specification (32-bit / SotN-style)

- **Internal resolution:** 480×270, integer-scaled (×2, ×3, ×4).
  Never smooth-scale. Nearest-neighbor only.
- **Palette:** per-asset palettes, 16–32 colors per sprite, no global
  cap. Alpha blending, additive glow, and gradients are allowed and
  encouraged. Official brand hexes live in
  art/palette-brand.md (from Chexology Brand Guidelines). UI/HUD/
  menus key on brand colors; the Chexy sprite keys on the
  mascot-extracted palette in BRIEF-ART-01 §2.
- **Sprite sizes:** Chexy is squat — target 40×40 to 48×48 (wider
  than tall reads better for stubby proportions); run cycle 8–12
  frames. The tail is the personality workhorse: it should have
  secondary motion (drag/overshoot) in every animation. Items and
  minor enemies deliberately simpler (**asymmetric fidelity** —
  spend effort where the player stares: Chexy, boss, backgrounds).
- **Chexy design notes:** squat anthropomorphic squirrel; big
  expressive tail; some Chexology-uniform element (vest, lanyard, or
  cap — TBD in character sheet). Character sheet is part of the
  Phase 2 style-proof gate.
- **Backgrounds:** 4–6 parallax layers with subtle autonomous motion
  (flickering lights, drifting crowd silhouettes).
- **Effects:** particle bursts on tags, additive glow on NFC
  interactions, translucent guest text bubbles.
- **Style-proof gate (Phase 2):** fully render ONE screen (attendant
  idle+run, one item, one enemy, full background stack) and review in
  motion before any other final art is produced. Purchased asset
  packs + palette-swap scripts are an approved fallback.
- **Hitbox vs. sprite (locked):** Chexy's physics body is
  32×32 — the body mass only. The sprite renders on a 48×48
  canvas; the tail (and any hair/ear overhang) is visual-only
  and NEVER collides. Sprite anchor: bottom-center of the
  48×48 canvas aligned to bottom-center of the 32×32 physics
  body, so feet sit on platforms and tail overhang extends
  behind/above. Tag auto-target radius measures from the
  physics body center, not the sprite canvas.
- **Sprite facing convention (locked):** all character sprites
  are drawn LEFT-FACING native (tail on the right side of the
  canvas). Code applies horizontal flip (flipX) for rightward
  movement. Every animation frame for a character uses the
  same native facing.
- **Animation key policy (locked):** the player (Chexy) owns
  the global animation namespace — raw Aseprite tag names
  ('idle', 'run', 'jump', 'fall', 'land', 'tag', 'hold',
  'hit', 'win', 'lose') are global keys via
  createFromAseprite. ALL other animated characters (enemies,
  bosses, NPCs) must register sprite-locally by passing the
  target parameter to createFromAseprite — never globally.
  Their .ase tags may then reuse plain names (an enemy 'idle'
  is fine) with zero collision risk.

## 6. Audio

- Chiptune-plus style (16/32-bit era: richer than NES bleeps).
- Tools: jsfxr for SFX, BeepBox for music. One loop per level + title
  + boss theme.

## 7. Performance Budget

- 60fps sustained on a mid-range laptop at ×2 scale with full
  parallax and particles. Verified at grey-box gate and re-verified
  at every level gate.

## 8. Out of Scope for v1 ("v2 someday" list)

- Online leaderboards (local storage only)
- Cutscenes
- Second playable character
- Procedural generation
- Mobile / touch controls
- Gamepad support
- Guest-matching mechanic (deferred from §3.2 — confirmed v2)
- Sequel title reserved: Chexy's BIGGEST DAY

## 9. Milestone Gates

| Gate | Deliverable | Approval criterion |
|------|-------------|--------------------|
| 0 | DESIGN.md + CLAUDE.md approved | You'd sign it |
| 1 | Grey-box prototype | The core loop is FUN |
| 2 | Coatroom level, full art/audio + style-proof | Sustainable art pipeline proven |
| 3 | All levels + boss playable | Full run start-to-finish |
| 4 | Polish, playtests, deployed to itch.io / GitHub Pages | Shipped link in Slack |

## 10. Open Questions

*None. All questions resolved.*

### Resolved

- ~~Tagging model~~ → **Hybrid**: instant tap standard, charged hold
  for heavy items, generous auto-target radius with target highlight
  (see §2.3).
- ~~Guest-matching~~ → **v2** (see §8).
- ~~Difficulty ramp~~ → **Adaptive with score trade-off**: intensity
  eases for struggling players but the score multiplier drops with
  it; clean play ramps both back up (see §2.5).
- ~~Run length~~ → **15–20 minutes** full clear (see §2.5).

- ~~Character design~~ → **Chexy**, squat anthropomorphic squirrel
  (see §1, §5).
- ~~Title~~ → **Chexy's BIG DAY**.
- Do not reference the decade-old former company name anywhere in
  the game, docs, or code.
- ~~Chexy's uniform element~~ → **None required on the gameplay
  sprite.** The canon chest badge appears in larger art (title,
  results, portraits) but may be omitted at 48×48
  (see BRIEF-ART-01 §1).
