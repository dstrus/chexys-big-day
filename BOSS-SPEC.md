# BOSS-SPEC — The Paper Ticket King (Level 5 finale)

**Status:** Design spec, ratified in design session 2026-07-30.
Implementation brief (BRIEF-05 or later) will reference this doc.
**Canonical reference art:** art/reference/paper-ticket-king.png
(intact) and paper-ticket-king-phase2.png (torn). Palette:
paper white/cream/manila body, deep red crown/claws/accents —
red family from chexy-sprite.gpl (#C01818/#A80018); ChexApp tag
colors remain reserved for items.

## Core concept (LOCKED)

Chexy has no attack verb and never gets one. The King is not
damaged by tagging — he is damaged by **the line moving without
him**. Damage = successful item returns during the Mass Exodus
rush. Steals are his recovery. The tag remains what it has been
all game: claiming items and stunning thieves (defense/rescue,
never offense). Lose condition unchanged: 3 lost items. The King
never attacks Chexy's "health" — the job is the only threat,
as always.

Fiction: every fast, paperless, happy return makes him less
relevant, and his relevance IS his body.

## Health & phases

Health = a **Return Meter** styled as his chest claim check on
the HUD, tearing along perforations as thresholds hit. Steals
regress the meter (partial refill, tunable stealRefund, default
0.5 returns' worth — recovery pressure without stalemate risk).

Thresholds are return counts (tunable per phase): suggest
10 / 12 / 14 returns for phases 1→2→3, final phase ends at +14.

**Shrinking body (LOCKED, per session):** discrete size states
per phase + continuous paper fly-off particles.

| Phase | Body state | Size (approx) | Crown | Chest ticket |
|-------|-----------|---------------|-------|--------------|
| 1 | Intact King | 128×128 | 5 spools | whole |
| 2 | Torn King | 104×104 | 3 spools | torn at first perforation (matches phase2 ref art) |
| 3 | Ragged King | 80×80 | 1 spool | only the 0045 stub remains |
| Death | Collapse | — | crown falls, oversized, clatters | stub flutters down last |

- Phase transitions: burst of ticket-stub particles (large),
  body swaps to next state with a 1s stagger animation. Paper
  particles bleed off continuously at a rate proportional to
  meter progress within the phase (code-side emitter, reuses
  stub sprites).
- Hitbox shrinks with body state (interactions below).
- Speed/aggression scale UP as size scales down (tunable
  multipliers per phase). Small = desperate = fast.

## His kit (attacks target THE JOB, not Chexy's health)

Phase 1 — The Bureaucrat (slow, wide, deliberate):
- **Claw Snatch:** telegraphed swipe at a racked/checked item;
  on connect, the item is stolen (meter regress + it can become
  a true loss if his carrier minion exits). COUNTER: tap-tag the
  claw during the telegraph to stun it (rescue rules apply — no
  score, no streak).
- **Stub Spew:** mouth vomits 3–5 ticket-stub minions (standard
  thief behavior, existing AI).
- **Paper Carpet:** litters a floor zone with slippery stubs
  (reduced traction zone, tunable slipFactor; dash crosses it
  clean — dash finally gets its finale moment).

Phase 2 — The Middle Manager (adds, faster):
- All phase 1, faster telegraphs.
- **Ticket Tornado:** brief swirl that scatters 2–3 UNCHECKED
  items to random positions (re-routing pressure, no loss).
- Stub Spew count up (5–7).

Phase 3 — The Desperate Clerk (small, fast, frantic):
- All previous, fastest telegraphs, moves erratically.
- **Grab Chexy:** telegraphed lunge; on connect, mash-any-key
  stun (~1.5s, tunable) — lost TIME, not lost items. His only
  direct interaction with Chexy, and it still only threatens
  the job.
- **Last Gasp:** at 90% of final threshold, one scripted
  all-out wave (max spawn burst) before the end.

## Arena (Mass Exodus final section)

- Single wide screen (no scroll during boss) — the venue
  lobby, exits at both edges, item racks flanking, return zone
  center. King occupies upper-center, descends to floor level
  in phase 3 (small enough to walk the floor — spatial
  escalation: he invades YOUR space as he shrinks).
- Guests keep flowing (the exodus continues). Wave file drives
  guest/item flow per phase; his attacks modulate it.

## Ending (scripted, short)

Final return lands → last perforation gives → crown falls with
an oversized clatter → body collapses into a confetti burst of
dead stubs (particle system reuse) → the 0045 stub flutters
down, lands, and a rubber stamp slams: the results screen leads
with ITEM RETURN RATE. "Death to the paper ticket."

## Art deliverables (asymmetric-fidelity budget: SPEND here)

1. Three body states (128/104/80), each: idle 2–3f, snatch
   telegraph+swipe 4f, spew 3f, stagger 2f. Phase 3 adds lunge
   3f. (~30–35 frames total across states, but states 2–3 are
   partial redraws of state 1 — realistic effort well under
   idle-cycle per-frame cost since poses repeat across sizes.)
2. Ticket-stub particle sprite (2–3 tiny frames) — shared by
   fly-off, phase bursts, carpet, and death confetti. Highest
   reuse-per-pixel asset in the game.
3. Crown-fall + stamp are code-animated from static pieces.
Registration: sprite-local anims (target param) per the
2026-07-30-a policy — his tags never touch Chexy's global
namespace.

## Tuning surface (tuning.js additions)

bossReturnThresholds[], stealRefund, slipFactor,
bossSpeedByPhase[], grabMashMs, spewCountByPhase[],
flyoffRateByPhase[], telegraphMsByPhase[].

## Explicitly out of scope

No Chexy attack verb, no boss health bar UI beyond the ticket
meter, no arena hazards unrelated to paper, no phase 4.
