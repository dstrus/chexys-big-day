# BRIEF-05 — Level 3: The Valet Garage (Phase 3, code track)

**For:** Claude Code (expect two sessions: scroll/request core,
then blockout + waves; split at the marked seam)
**Prerequisite:** none open — BRIEF-03/-04 closed with sign-off.
**Read first:** CLAUDE.md, DESIGN.md §2.3–§2.5, §3.3;
DECISIONS.md (garage design session 2026-08-09); the fairness
stack lineage (-c/-d/-e/-f, loiter, grace).

**Theme:** multi-tier parking structure, night shift. Mood:
concrete grays + Action Blue signage glow + warm sodium lamps.
Rush length = scroll length (see §5). `dashAllowed: true` (first
map to declare it per the -c convention).

## 1. Core loop — the request queue (auto-scroll)

The level scrolls RIGHT at constant speed (scrollSpeed, map
property; constant for v1 — the wave file MAY vary it per
section later, knob built now, shipped flat). Guests text for
their cars: requests appear on a HUD queue (car-silhouette chip
in the car's body color — garment-hue family, never ChexApp tag
colors). Requested cars are parked ahead among unrequested
dressing cars. Chexy reaches and tags them; a tagged car pulls
out and drives off (paperless — no carrying, no backtracking).

- **Request lead time (fairness, translated from -c):** a
  request may only be issued if lead time ≥ max-effort
  scroll-relative traversal from Chexy's worst plausible
  position to the car, + grace (requestGraceMs). Enforced by
  the wave loader with a debug green/red readout per request
  (same philosophy as the (c) inequality). Every miss must be
  a declined route, never an ambush.
- **Miss = loss:** a REQUESTED, untagged car crossing the
  trailing edge is 1 lost item (angry bubble; hangers/Game
  Over unchanged). DESIGN §2.1 amendment below. Unrequested
  cars scroll out freely; tagging one is worth small bonus
  score (dressing with upside).
- Arrows (§2.4) point at requested cars; urgency rises as a
  car nears the trailing edge, consistent with the shared
  endangerment ranking (a nearly-lost car ranks as carried-
  class for arrow weight; see §4).

## 2. Enemies — swarms obstruct, elites untag

- **Swarms** (existing Stub/Strip behavior sets, no steal
  logic active): drift in flock patterns across the path,
  interrupt holds on contact (grace rules -e apply), slow
  nothing permanently, take nothing. Pure §2.4 obstruction.
- **Elite stubs (new variant behavior, reuses V1 art +
  raffle-red accent tint until V3 art exists):** target
  TAGGED cars, rip the chip off (car reverts to requested-
  unmet, subject to scroll like any miss), and carry the chip
  visibly overhead, fleeing WITH the scroll direction (never
  instantly off the trailing edge — interception guarantee in
  the new frame; carrierSpeedFactor applies). Stun the
  carrier (instant tap per §2-4b): the chip flies back and
  auto-reapplies. Elite grabs respect target lock, loiter,
  and stealCooldownMs semantics (untag events are this
  level's "steal initiations").
- Rescue-stun tag drops, endangerment ranking, and one-press-
  one-action all apply unchanged.

## 3. Cars — geometry, platforms, hold tiers

- Cars are the level's platform vocabulary: roofs are
  standable (2–3 structure tiers + car-roof routes). Parked
  cars use the placement-validity gate like any item.
- **Standard cars:** instant tap (windup applies as ever).
- **Luxury cars (hold-tier, SPARINGLY — 2–3 requests per
  rush):** tier-3 full hold. Placed with EXTRA lead time
  (luxuryLeadFactor, default 1.5×) because holding while the
  world scrolls spends position — this is the level's
  signature tension, priced fairly.
- **Trailing edge:** pushes, never harms — a firm bouncy
  nudge keeping Chexy on-screen (comedy, not punishment). If
  the push reaches Chexy mid-hold: QUIET RESET, no struggle
  penalty (the scroll is nobody's fault; -d arrival-overlap
  logic's sibling). Edge push cannot interrupt the tap root
  (160ms is too short to matter; verify no jitter at the
  seam).

## 4. Systems integration checklist

- Endangerment ranking gains scroll awareness IN THIS LEVEL
  ONLY: distance-to-trailing-edge joins the ranking inputs
  (a nearly-scrolled-out requested car ranks top-class).
  Contact Card in the garage saves the most-endangered
  request (may re-tag an untagged car or pre-tag an unreached
  one — both legal; the guard is it never wastes on
  unrequested dressing).
- Collectibles: tags placed on roof routes (dash showcase),
  1–2 cards, 0–1 insight, via the standard layers/waves.
- Adaptive difficulty modulates request density and elite
  frequency within the clamped band; scrollSpeed is NOT an
  adaptive lever (constant per ruling).
- Music hook: garage.<ext> drop-in as ever.

## 5. Blockout & waves (SESSION SEAM — second session starts
here)

- Map: ~8–10 screens long, 2–3 tiers, car-roof routes with
  at least one flat-air-dash showcase gap. Rush duration =
  map length / scrollSpeed; target 3:00–3:30.
- Wave arc: (1) 0:00–0:45 tutorialization — sparse standard
  requests, generous lead, swarms only; (2) 0:45–1:45
  density up, first luxury request, elites introduced ONE at
  a time; (3) 1:45–2:45 the working rush — overlapping
  requests across tiers, elite pressure on your tagged
  backlog; (4) final stretch — request cluster + one luxury
  with exactly-sufficient lead as the multiplier bait.
- Interim art: cars as tinted rects with silhouette tiers
  (sedan/SUV/luxury lengths), per the accepted convention.
  BRIEF-ART-04 (garage env + car sprites + elite V3) follows
  separately.

## 6. Amendments to apply (fold into session 1)

1. DESIGN §2.1: loss line gains the garage channel — "A
   stolen item, or (auto-scroll levels) a requested car that
   scrolls out untagged = 1 lost item."
2. DESIGN §3.3: replace the one-line spec with the request-
   queue loop summary (this brief §1–§3 condensed).
3. §2.4: note the scroll-aware ranking input as level-scoped.
4. Log the full garage design session rulings in DECISIONS.md
   citing 2026-08-09 (loss model, hybrid enemies, platforms-
   only riding, edge push, sparse hold cars, constant scroll).

## Acceptance

- Full rush start-to-results at constant scroll, 60fps ×2.
- Request readout green for every wave entry; forced-miss
  test (deliberately ignore a request) produces exactly one
  loss at the edge, correct bubble, hanger tarnish.
- Elite loop end-to-end: untag → chase → stun → chip flies
  back → car re-tagged; fleeing elite never exits the
  trailing edge with a chip while interceptable.
- Hold-at-edge quiet reset verified; edge push feel-checked
  by the human.
- Human punch-list play session closes the brief, as ever.

Out of scope: variable scroll (knob exists, stays flat),
riding setpieces (v2), car V3/elite art (BRIEF-ART-04), new
music (drop-in when composed).
