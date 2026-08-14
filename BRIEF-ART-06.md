# BRIEF-ART-06 — The Paper Ticket King (three bodies)

**For:** Art track — the game's largest drawing project.
**Read first:** BOSS-SPEC (as amended by BRIEF-07 — rip
grammar, tier-weighted meter), BRIEF-07 Act 2, BRIEF-ART-03
§0/§2 (the paper family rules).
**Canonical reference:** art/reference/paper-ticket-king.png
(intact) and paper-ticket-king-phase2.png (torn). A third
reference (Ragged) does not exist yet — OpenArt prompt in the
appendix; generate before drawing state 3.

## 0. Ground rules

- **Palette:** the enemy paper family (actors.gpl slice:
  paper white/cream/manila/shadow + both raffle reds) plus a
  small king-only extension — request paper-king.gpl from
  the design chat (crown deep-reds, tear-edge dark, gold
  glint for the crown, ~16 total). The King must read as
  KIN to the swarm (same paper) and as ROYALTY over it
  (the reds and the crown are his alone; minions carry red
  only as accents).
- **Left-facing native**, standard flip convention. He
  faces the floor Chexy works.
- **No non-integer scaling, ever** (canon): each body state
  is DRAWN at its size, using the larger state as a
  low-opacity reference layer — never scaled down.
- **Three files** (canvas per state):
  king-intact.aseprite 128×128, king-torn.aseprite 104×104,
  king-ragged.aseprite 80×80. Sprite-local registration
  (target param) — his tags never touch the global
  namespace.
- Layer discipline pays here more than anywhere: crown /
  face / chest-ticket / arms / legs as separate layers.
  States 2–3 are REDUCTIONS of state 1's pose language, not
  new characters — same silhouette logic, less mass, more
  rage.

## 1. The three bodies (identity per phase)

| State | Canvas | Crown | Chest | Attitude |
|-------|--------|-------|-------|----------|
| Intact (Bureaucrat) | 128 | 5 spools | whole ticket, 0045 legible | slow, wide, smug |
| Torn (Middle Manager) | 104 | 3 spools | torn at first perforation (match phase2 ref) | faster, fraying |
| Ragged (Desperate Clerk) | 80 | 1 spool | only the 0045 stub | frantic, hunched, all elbows |

0045 must survive legibly at ALL THREE sizes — it is the
one text exception in the game and the punchline of the
ending. Budget pixels for it first at 80px, then design the
stub around what fits.

## 2. Animation tables (per state, per BRIEF-07's kit)

All three states:
| Tag | Frames | Notes |
|-----|--------|-------|
| idle | 2–3 | breathing menace; paper edges rustle 1px |
| rip_tele | 2 | claw draws back + hangs — THE counter
window; must read as "tap me now" at a squint. Budget the
80ms windup tax: the hang frame is the long one |
| rip | 2 | claw snaps to the rack; chip-grab is code-side |
| clawstun | 2 | claw recoils, shakes — counter feedback |
| spew | 3 | mouth opens, stubs erupt (minions are code
spawns; draw the gape + burst suggestion) |
| stagger | 2 | phase-transition reel (plays under the
body-swap + particle burst) |

Ragged only adds:
| lunge_tele / lunge | 2 + 2 | the Grab-Chexy — telegraphed
crouch then spring; grace rules make the tele honest |

Frame math: 13–14 per state ×3 (minus lunge on two states)
≈ 36–40 drawings — but states 2–3 reuse pose language at
reduced mass, so honest effort ≈ state 1 full + two 60%
passes. At demonstrated pace: 4–6 sessions. This is the
project's summit; everything after is downhill.

## 3. Static pieces (code animates these)

- Crown as a separate piece per state size (falls at death
  with the oversized clatter).
- The 0045 stub piece (~24×32): flutters down last, gets
  stamped. The ending's hero prop — spend love here.
- HUD chest-ticket meter template (~64×20): the claim check
  with perforation lines; code masks the tear per meter
  fraction and weights the tear-step size per BRIEF-07
  (heavy returns tear visibly bigger).
- Fly-off/confetti/carpet all reuse the shipped 'poof' stub
  particle — nothing new.

## 4. Order

1. paper-king.gpl + state-1 idle key frame → drop into the
   S3 build over the rect King (the style-proof gate,
   boss edition — judge at arena distance before drawing
   the other 35 frames).
2. State 1 complete → S3 rounds run against a real
   Bureaucrat.
3. Ragged reference (appendix prompt) → states 2–3.
4. Static pieces last (the stub before the crown — the
   ending needs it first).

## Appendix — Ragged reference prompt (fresh generation,
feed BOTH existing references as style anchors if the tool
allows)

> The same paper ticket monster king as in these images, in
> its final desperate state — much smaller and scrawnier,
> hunched over, most of its paper body torn away leaving a
> skeletal crumpled frame, its giant chest claim-check
> reduced to just the small torn stub with the number 0045,
> crown down to a single rolled ticket spool, furious
> exhausted expression, all sharp elbows and rage, same flat
> cartoon style, aged paper white and manila with deep red
> accents, full body, plain white background, no readable
> text except 0045.
