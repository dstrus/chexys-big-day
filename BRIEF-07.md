# BRIEF-07 — Level 5: The Mass Exodus + The Paper Ticket King

**For:** Claude Code (three sessions at the marked seams:
Act-1 rush; boss core/phases; boss kit/polish)
**Read first:** BOSS-SPEC (as amended below — the amendments
WIN where they conflict), DESIGN §2–§3.5, the instrument
lineage, DECISIONS (exodus design session, handoff
2026-08-11-a). `dashAllowed: true`. Music hooks:
music/exodus.<ext> (act 1), music/boss.<ext> (act 2) —
composer note: act-2 wants a layered loop (intensity per
phase) if composed with that in mind.

**Fiction flip (level-wide):** the show is OVER — every tag
RETURNS an item to its departing guest. Same verb, same
mechanics; bubbles, results copy, and scoring language flip
to hand-backs. "The line is moving, and it's killing him."

## ACT 1 — The Exodus Rush (~4:00)

The medley finale: every item class and mechanic from Levels
1–4, escalating. Coats (standard), luggage tiers 2–3 (holds),
rolling strollers (brake-on-tag; the ≤0.3× rail; hand-placed
runway lanes). Thieves at full grammar: loiter, target lock,
sanctuary-less (no scroll — static arena rules), grace,
steal cooldown per map property.
- Waves escalate through four phases to a deliberately hot
  finale; ALL THREE INSTRUMENTS price the schedule (fairness
  floor, tension band, travel budget — the exodus is the
  travel budget's showcase: the crowd surges are zoned
  fronts, finally spent, migrating across the venue with
  opposite-end simultaneity ONLY as the pre-checkpoint
  climax, priced green).
- Map: the venue lobby at scale — wide single-screen-tall
  layout ~5 screens, mezzanine + rack zones, hand-owned
  after generator proposal (museum precedent).

### The checkpoint (ruled): the Boss Door
- Act 1 ends at the rush timer; a short breath beat (the
  lobby empties, paper starts swirling), then Act 2 in the
  same run.
- **Boss retry restores the checkpoint state:** act-1 loss
  count and score are banked at the door; failing Act 2
  restarts Act 2 with exactly that loss count and score.
  Act 1 is never replayed within a run.
- Hangers & BIG DAY: awarded at victory for the FULL SHIFT
  (total losses across both acts). Abandon-from-pause
  records nothing, as ever (-04-e).

## ACT 2 — The Paper Ticket King (~3:00 target)

Per BOSS-SPEC with these amendments (supersessions explicit):

1. **Claw = giant elite (rip grammar; supersedes bespoke
   snatch):** the claw telegraphs, then RIPS the chip off a
   returned (racked) item — the return un-counts, the item
   is re-taggable, the claw carries the chip until stunned
   (counter-tap the claw during telegraph OR stun the
   carried-chip flight per elite rules; either restores).
   No new loss channel: the King undoes WORK, never creates
   losses. Minions (Stub Spew) steal UNTAGGED items under
   the standard thief stack — division of labor: the claw
   attacks your completed work, the swarm your incomplete.
2. **Tier-weighted meter (supersedes flat 10/12/14):** the
   Return Meter advances in weighted points mirroring the
   score rules — standard 1.0, tier-2 1.5, tier-3 2.0,
   strollers 1.0. Phase thresholds in points: 12 / 15 / 18
   (first calibration; tunable array stands). Rips regress
   the meter by exactly the ripped item's weight; restores
   re-add it (symmetric — stealRefund 0.5 is DELETED). The
   chest-ticket tear renders meter fraction as ever; heavy
   returns visibly tear bigger (weight made legible).
3. Kit reconciliations (already ruled, now binding): Grab-
   Chexy respects post-interrupt grace; telegraphs budget
   the ~80ms windup tax; Paper Carpet = swarm contact-slow
   rules with dash immunity; Ticket Tornado scatters route
   through the placement-validity gate; minion spawns
   respect a per-phase steal cooldown override
   (bossStealCooldownMs[]).
4. Shrink bodies, fly-off, crown spools, phase kit tables,
   arena (single wide screen, King upper-center descending
   in phase 3), and the 0045 collapse ending: UNCHANGED
   from BOSS-SPEC. Interim art: scaled tinted-rect King
   with a drawn-on meter is acceptable for rounds; the
   three-body art set (BRIEF-ART-06) is the parallel art
   dependency and the game's largest remaining drawing.
5. **State-machine watchdogs (the -03-b promise lands
   here):** the King's phase/body transitions are the
   game's first event-driven state machines — every
   transition gets a timeout watchdog with a console warn.
   State exits belong to timers and logic; animations
   follow. Rounds per garage precedent; close-out per -i.

## Acceptance (per session seam)

- S1: Act-1 rush start-to-door, instruments green, medley
  verified (a hold, a brake, and a rescue in one rush).
- S2: full two-act run; checkpoint semantics staged (fail
  boss at 1 banked loss → retry restores exactly; victory
  hangers = full-shift losses); meter arithmetic staged
  (tier-3 return +2.0, its rip −2.0, restore +2.0).
- S3: full kit live, watchdogs armed, phase tables tuned,
  ending sequence plays (collapse → stub → stamp → results
  leads with ITEM RETURN RATE).
- Human rounds close it, as ever.
