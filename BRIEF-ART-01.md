# BRIEF-ART-01 — Chexy Character Sheet & Sprite Translation

**For:** Art track (human in Aseprite + agent support tasks)
**Read first:** CLAUDE.md, DESIGN.md §5 (graphics spec)
**Canonical reference:** `art/reference/Chexy.png` (official mascot
illustration — copy the uploaded file here). This is the source of
truth for Chexy's design. The job is TRANSLATION to 32-bit pixel
art, not reinvention.

## 1. Canon analysis (what must survive translation)

Identity-critical features, in priority order:
1. **The tail** — near body-sized, curls in a spiral over the head/
   back. Chexy's single most recognizable shape.
2. **Huge eyes** with visible eyelashes (2–3 px lash marks read
   fine at sprite scale).
3. **Massive cream muzzle** with two buck teeth + small smile.
4. **Tufted ears** with dark interior/tips.
5. **Hair swoop** tuft between the ears.
6. **Cream belly** against orange body; dark brown hands and feet.
7. **Chest badge** — the Chexology pin logo on a white circle.

### Uniform question (DESIGN.md §10) — RESOLVED
No uniform element required on the in-game sprite. The chest badge
is canon and should appear in **larger art** (title screen, results
screen, any 3/4-front UI portraits) but may be dropped from the
48×48 gameplay sprite — at that scale it's 3–4 px competing with
the cream belly, and identity is carried by tail/eyes/muzzle. This
also removes the mirror-flip asymmetry concern entirely.

## 2. Canonical palette (extracted from reference)

Build `art/palette-chexy.md` from these measured dominants; snap to
a clean ramp of ~14–18 colors:

| Role | Hex (measured) |
|------|----------------|
| Body orange (dominant) | `#F06018` |
| Orange shadow ramp | `#D84818` → `#C04818` → `#A83018` |
| Deep shadow / maroon line color | `#780018` → `#600018` → `#480018` |
| Near-black outline & eyes | `#180000` (use instead of pure black) |
| Cream (muzzle/belly/tail stripe) | `#F0F0D8` |
| Cream shadow | `#F0D8C0` |
| Hair tuft / golden accent | `#F0C078` |
| Pink accents (inner ear, tongue, blush) | `#F06060` |
| Red accents (badge dot, deep tail) | `#A80018`, `#C01818` |
| Hands/feet dark brown | sample from reference (~`#4A2010`) |

Rule: the reference's airbrushed gradients become **flat planes +
one shadow step + selective 1px maroon accents**. No dithered
gradients on the character (background layers may dither).

## 3. Sprite spec

- **Canvas:** 48×48. Body mass ~26–30px tall (squat!), tail uses
  the remaining canvas behind/above. Wider-than-tall reads right.
- **Primary view: SIDE PROFILE** (side-scroller). This drawing
  does not exist in canon and is the sheet's core deliverable:
  - Muzzle becomes a short cream snout; one big eye + lashes.
  - Tail trails BEHIND the body, spiral curl above the back — it
    must never cover the face at rest.
  - Feet read as two dark ovals; hands visible in action poses.
- **Turnaround:** side (primary), 3/4 front (for UI/results
  screens — badge appears here), back (for the hold-tag pose if we
  face away — TBD). Mirror-flip for left-facing is fully clean now
  (no badge on the gameplay sprite = no asymmetry).
- **Silhouette test:** every pose must be identifiable filled
  solid black. If the tail spiral isn't legible in silhouette,
  the pose fails.

## 4. Animation set (v1)

Tail rule (DESIGN.md §5): secondary motion in EVERY animation —
the tail drags, overshoots, and settles 1–2 frames behind the body.

| Anim | Frames | Notes |
|------|--------|-------|
| Idle | 4–6 | Breathing bounce; tail sway; occasional blink |
| Run | 8–10 | Squat scamper — more squirrel bound than human jog |
| Jump rise / fall | 2 + 2 | Tail streams below on rise, flares on fall |
| Land | 2 | Squash frame; tail whips forward and settles |
| Tap-tag | 3–4 | Quick paw jab; syncs with hitstop frame |
| Hold-tag | 4 loop | Two-paw press channel pose; reads clearly as "committed/stationary" |
| Hit / stumble | 2–3 | Comic wobble, no pain — tone rule (§1 DESIGN.md) |
| Win pose | 4–6 | Results screen; acorn-style tag toss optional |
| Lose slump | 2–3 | Ears droop, tail droops — sad but cute |

Dash anim deferred (mechanic ships disabled in grey-box).

## 5. Deliverables & order

1. `art/palette-chexy.md` + Aseprite palette file (agent task:
   script to snap measured hexes into a ramp file).
2. **Side-profile idle key frame at final 48×48 scale.** Do this
   FIRST and screenshot it in the grey-box over placeholder
   platforms — this is the cheapest possible style test.
3. Turnaround sheet (side / 3-4 front / back).
4. Idle + run cycles → drop into game (agent task: sprite-sheet
   packing + Phaser atlas import glue).
5. Remaining animation set.

Step 2's in-game screenshot is the entry ticket to the Phase 2
**style-proof gate** (DESIGN.md §5): if 48×48 Chexy doesn't read
as canon Chexy in motion, we adjust scale/detail budget BEFORE
producing the rest of the set.

## 6. Agent vs. human split (per project plan)

- **Human (Aseprite):** all final pixel art. Judgment calls on
  simplification live with you.
- **Agent tasks:** palette ramp file + swap scripts, sprite-sheet
  packer, Phaser atlas loader, an HTML "flipbook" previewer that
  hot-reloads a PNG strip so you can check animation timing
  without launching the game, mockup/iteration feedback.
