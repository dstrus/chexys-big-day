# BRIEF-03 — Level 2: The Bell Desk (Phase 3, code track)

**For:** Claude Code (one session for the level; the dash-unlock
beat may spill into a second)
**Prerequisite:** BRIEF-02 complete (Gate 2 code half). The Tiled
pipeline, wave system, bubbles, audio bus, and results flow are
assumed. If any are missing, STOP and ask.
**Read first:** CLAUDE.md, DESIGN.md §2.3 (hold-tag), §2.4
(attention systems), §2.5 (difficulty), §3.2, DECISIONS.md
(dash: KEEP, handoff 2026-07-29-h).

**Theme:** boutique hotel lobby, evening check-in surge. Mood
anchor: Accent Steel Blue #2D5378 (art/palette-brand.md) — warm
lamps against cool dusk lobby. Rush timer: 3:00.

## The one new mechanic (two-part, one idea)

**Weight tiers + dash.** These ship together because they form
one push-pull: dash gets you to the heavy bag faster; the hold
still roots you when you arrive. Mobility feeds commitment.

### Weight tiers (DESIGN.md §3.2, §2.3)
- Tier 1 (garment bags, small cases): standard instant tap.
- Tier 2 (roller bags): hold-tag, SHORT duration (~60% of
  holdTagMs — new tuning value holdTier2Factor).
- Tier 3 (trunks, golf bags): hold-tag, full holdTagMs.
- Item category colors: luggage = Tag Teal #006483 base, with
  tier badges (1/2/3 dots). Heavy items use the heavy-variant
  edge arrows already built in §2.4.

### Dash (unlock beat)
- Dash unlocks AT LEVEL START via a 10-second scripted beat:
  the bell captain (text bubble, no sprite needed) gifts "the
  Bell Desk hustle" — a one-bubble tutorial: "Double-tap ← or →
  (or X/K) to dash!" First dash triggers a Success Green
  confirmation bubble. No modal, no pause; the rush starts
  immediately after.
- Dash spec: burst per tuning.js (dashSpeed, dashDurationMs,
  new dashCooldownMs default 900). Brief afterimage effect
  (2–3 ghost frames of the current sprite, additive blend,
  per DESIGN.md §5 effects language).
- **Dash × hold interaction (DESIGN.md amendment included
  below): dash is LOCKED OUT during an active hold.** The
  hold's stationary vulnerability is the mechanic's point;
  dash must not become an escape hatch. Implement as a
  tunable flag (dashCancelsHold, default false) so playtests
  can trial the opposite without a code change.
- Dash passes THROUGH ticket enemies (no contact) but does
  not pass through walls. Dash does not tag anything.

## Wave design intent (coatroom-waves.json sibling:
bellddesk-waves.json — agent drafts, human tunes)

Deliberately create dash-then-commit moments:
- Opening 30s: tier 1 only, dash tutorial beat, generous spacing
  (teach dash as a traversal joy first).
- 0:30–1:30: tier 2 enters at the FAR ends of the level from the
  player's likely position (spawn-point choice, not teleporting)
  so dash is the natural answer; ticket enemies light.
- 1:30–2:30: tier 3 trunks appear near enemy spawn clusters —
  the core dilemma: dash in, commit to a full hold while
  tickets converge, or clear cheap items first. Rescue
  opportunities spike here.
- Final 30s: mixed swarm, adaptive band widest, multiplier
  bait: two tier-3 spawns far apart with just enough time to
  hold both if dashes are chained cleanly.

## Level layout (belldesk.json — agent drafts blockout)

- ~4 screens wide, lobby motif: front desk run, luggage cart
  platforms (moving? NO — static for v1, motion is v2), a
  mezzanine level reachable by jump for tier-1 garment bags,
  ground floor for heavy items (heavy stays low — holds happen
  in enemy traffic, by design).
- Return zone: the bell cart near the desk, center-level (so
  every delivery crosses traffic).

## Amendments to apply (fold into this session)

1. DESIGN.md §3.2: append "Dash is locked out during an active
   hold (tunable dashCancelsHold, default false). Dash unlocks
   via a 10s scripted beat at Bell Desk start; it persists for
   all subsequent levels."
2. DESIGN.md §2.2 controls table: change dash row note from
   "(unlocked in Level 2)" to "(unlocks at Bell Desk start;
   double-tap direction or X/K)".
3. Log both in DECISIONS.md per protocol.

## Acceptance

- Full Bell Desk rush playable start to results, driven by its
  own map + wave JSONs, 60fps at ×2 (DESIGN.md §7).
- Dash feel: verify afterimage, cooldown, hold lockout, enemy
  pass-through, no wall clip.
- Tier 2/3 holds read distinctly (meter speed difference
  visible).
- Level select shows Bell Desk unlocked after Coatroom clear.
- Human plays and files a punch list before this brief closes;
  the punch list is part of the brief, not a follow-up favor.

Out of scope, per guardrails: guest-matching (v2), moving
platforms, bell captain sprite, new enemy types.
