# DECISIONS.md — The Biggest Day (append-only)

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
