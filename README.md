# Chexy's BIG DAY

A 32-bit-style pixel-art side-scrolling browser game for the
Chexology team. Chexy the squirrel checks items back in across five
increasingly chaotic shifts. Requirements live in DESIGN.md; project
rules live in CLAUDE.md.

## Running

```sh
npm install
npm run dev     # local dev server (Vite)
npm run build   # static dist/ for GitHub Pages / itch.io
```

Phaser 3 + Vite, JavaScript ES modules. Node 22 (see .tool-versions).

## Testing notes

- Seed progression explicitly; fresh-profile defaults are a test
  hazard, not a baseline. Headless/staged test profiles must
  explicitly seed progression state (unlocks, settings) rather than
  inherit fresh-profile defaults — a silently locked ability
  (dashUnlocked) invalidated two rounds of gap verification before
  this rule existed (handoff 2026-08-09-f). Seed via localStorage
  key `chexys-big-day-progress-v1`, e.g. `{"dashUnlocked":true}`.
