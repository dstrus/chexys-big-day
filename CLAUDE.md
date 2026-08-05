# CLAUDE.md — Chexy's BIG DAY (Chexology retro game)

Project constitution. Every agent session must follow this file.
When this file conflicts with a prompt, STOP and ask the human.

## What this project is

**Chexy's BIG DAY** — a 32-bit-style pixel-art side-scrolling
browser game for the Chexology team. The player character is
**Chexy**, a squat anthropomorphic squirrel. Requirements live in
DESIGN.md — it is the contract.

## Branding rules (locked)

- The game is "Chexy's BIG DAY" (this casing everywhere).
  Never retitle in code, UI, or docs without an explicit
  handoff. "Chexy's BIGGEST DAY" is reserved for a possible
  sequel and must not appear in v1.
- The company is "Chexology" — never use its legacy pre-rebrand
  name anywhere (code, comments, assets, or copy), even in jokes.
If a task is ambiguous, check DESIGN.md first, then ask; never guess
on gameplay or art-spec questions.

## Tech stack (locked)

- **Engine:** Phaser 3 (latest stable), JavaScript ES modules.
  No TypeScript migration, no framework swaps, no build-tool churn.
- **Build:** Vite. `npm run dev` for local, `npm run build` for dist.
- **Levels:** Tiled JSON maps in `assets/maps/`, loaded natively.
- **Deploy target:** static hosting (GitHub Pages / itch.io).

## Rendering rules (locked — see DESIGN.md §5)

- Internal resolution 480×270. Integer scaling only.
- `pixelArt: true` in Phaser config; nearest-neighbor everywhere.
- 60fps on mid-range laptop is an acceptance criterion for every
  task that touches rendering. If a change drops frames, flag it.

## Code conventions

- Small scenes: one Phaser Scene per level plus Boot, Title, UI.
- Tunable gameplay values (gravity, speeds, timers) live in
  `src/config/tuning.js` — never hardcoded in scene logic. The
  debug tuning panel reads/writes this file's values.
- No new runtime dependencies without asking. Phaser + Vite is
  the whole stack.
- Every task ends with the game running (`npm run dev` boots, no
  console errors) before it is considered done.

## Scope guardrails (hard NO without explicit human approval)

- Online leaderboards / any backend / any network calls
- Cutscenes, dialogue systems
- Second playable character
- Procedural generation
- Mobile/touch controls, gamepad support
- New levels or mechanics not in DESIGN.md §3

If the human asks for one of these in a prompt, point at this list
and confirm they want to amend it first.

## Workflow rules

- Small, verifiable tasks. One feature per session where possible.
- Commit after every accepted task with a descriptive message.
- Log gate decisions and spec changes in DECISIONS.md (append-only).
- Placeholder art is always acceptable to keep the code track
  unblocked; never block a gameplay task waiting on final sprites.
- Reference-art disposition (handoff 2026-08-04-c): OpenArt
  keepers that informed shipped frames get committed to
  art/reference/ (provenance convention, same as the King
  concepts); scratch/rejected generations are deleted, never
  left untracked in root.

## Handoff protocol (chat → repo)

Design thinking happens in external chat sessions. Decisions arrive
in one of two forms:

- **HANDOFF blocks** — numbered, literal instructions pasted into a
  session, identified as "HANDOFF <date>-<letter>".
- **Replaced doc files** — a full DESIGN.md / brief dropped into the
  repo, announced as "updated externally".

Rules for both:
- Apply LITERALLY. This is transcription, not design. Do not
  reinterpret, improve, or expand scope.
- Log every handoff in DECISIONS.md (append-only) with its ID and a
  one-line summary per numbered item.
- Commit as "Apply handoff <ID>" (or "Sync <file> from design
  session <date>").
- If a handoff contradicts DESIGN.md, the handoff wins: update
  DESIGN.md to match and note the amendment in DECISIONS.md.
- For replaced doc files: read the new version, summarize what
  changed, and flag any existing code the change invalidates
  before doing anything else.
- If a handoff item is ambiguous or impossible, STOP and ask the
  human — never guess on a transcription task.
- **Sequence check:** handoff IDs are sequential per day
  (-a, -b, -c...). Before applying any handoff, scan
  DECISIONS.md for the immediately preceding ID. If it is
  missing, STOP and tell the human which handoff appears to
  have been skipped before proceeding.
- **Referenced-artifact check:** when any repo document
  references another repo artifact (briefs, specs, palette
  files, maps), verify the referenced file exists in HEAD
  before reporting on it or building against it. If a
  reference dangles, search git history and common
  locations BEFORE flagging it as missing — report "absent
  from HEAD" only after an actual search, and include the
  search performed. (Added after BRIEF-03 was flagged
  missing while committed since 2026-07-30.)
