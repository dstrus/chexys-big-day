# BRIEF-06 — Level 4: The Stroller Valet (Phase 3, code track)

**For:** Claude Code (one session core + waves; round system
per garage precedent if needed)
**Prereq:** none open. **Read first:** DESIGN §2.3–§2.5, §3.4;
the garage instrument lineage (tension band, deadline); this
brief logs its design session via the accompanying handoff.

**Theme:** museum lobby, family day, chaos mode. Mood: Accent
Teal Green #386E6F, gallery light, marble values. Rush 3:30.
`dashAllowed: true`. Music hook music/museum.<ext>.

## 1. The one new mechanic: ROLLING ITEMS (bounded novelty)

Three item classes, only one of which moves — the mix is the
design:
- **Strollers (the movers, ~40% of field):** roll horizontally
  from spawn at strollerSpeed (tunable, default 45 — HARD RULE:
  ≤ 0.3× player speed, the carrierSpeedFactor logic applied to
  movers; fairness math stays valid because interception
  arithmetic barely shifts at this ratio). Rebound off walls
  and solid verticals; roll off platform edges and continue
  below (placement-validity gate resolves any landing).
  Perpetual until tagged. **Tagging a stroller BRAKES it** —
  checked in, parked, static (taming the chaos is literally
  the verb). Weight: standard tap.
- **Kid backpacks (~35%):** spawn with an energetic bounce,
  settle within ~1s (restitution material). Static thereafter.
  Standard tap.
- **Sippy cups (~25%):** tiny, high-restitution comedy
  bouncers, settle ~1.5s. Standard tap, small score. The
  museum's confetti.

## 2. Rulings baked in (veto before pasting the handoff)

- **Mover tap grace:** a tap acquired at press-time LANDS even
  if the rolling target drifts out of radius during the 80ms
  windup — the press was the commitment; punishing 80ms of
  drift on a mover would make the whiff rule feel like a lie.
  (-b's clean-miss rule covers only targets that become
  INVALID — stolen/removed; drift is not invalidity.)
- **Target lock on movers:** enemy locks track the moving
  object (locks are object refs already); loiter orbits
  follow the mover. A thief grabs a rolling stroller in
  place; carrier rules unchanged from there.
- **Spawn validation** runs at spawn position as ever; the
  ≤0.3× speed cap is what keeps the guarantee honest over a
  mover's drift (note this ON the tunable).
- **Endangerment ranking:** unchanged classes; movement is not
  danger. Arrows track movers (they already track carriers —
  same plumbing).
- **No feet-reach rule here** (garage-scoped); the museum is
  ground-plus-mezzanine like the Bell Desk.

## 3. Level & waves

- Map ~4 screens, museum lobby: marble floor run, two exhibit
  mezzanines, wide open mid (movers need runway to be movers),
  return alcove center. Deliberate wall geometry so stroller
  rebounds create readable back-and-forth lanes, not pinball.
- Wave arc: (1) backpacks + cups only — the bounce-and-settle
  comedy teaches itself; (2) first strollers, sparse, wide
  lanes; (3) chaos mode — density up, movers crossing static
  piles, thieves targeting the strollers you keep NOT getting
  to; (4) finale: max density + the BIG DAY bait (a stroller
  convoy spawning far side).
- Density is the identity: this level runs the highest item
  count in the game — perf note below.

## 4. Acceptance

- Full rush start-to-results; tension band + fairness
  instruments green (movers validated at spawn, cap noted).
- Staged: tap a stroller mid-roll (brakes, chips, scores);
  windup-drift tap lands per §2; thief steals a mover
  (lock-follow, grab-in-place, carrier normal); stroller
  rolls off a deck and remains valid below.
- 60fps ×2 AT PEAK DENSITY on human hardware — this level is
  the perf ceiling test. If it drops, the lever is field
  count, not physics.
- Interim art: tinted rects (stroller = wide, backpack = mid,
  cup = tiny). BRIEF-ART-05 follows post-round-stability.
- Human punch-list rounds per garage precedent; close-out
  criteria: three clean consecutive rushes, per -i's pattern.

Out of scope: slopes (flat rolls only, v2), stroller-riding
(no), guest-matching (v2 forever), new enemy types.
