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

## Debug shortcuts (dev server only)

Gated on `import.meta.env.DEV`, so none of these exist in a built
game.

| Key | Where | Does |
|-----|-------|------|
| `` ` `` | anywhere | tuning panel: live sliders, flags, readouts |
| `B` | The Mass Exodus, Act 1 | **skip to the boss** — banks the run as it stands and opens the Boss Door, taking the real transition path |
| `F` | in a level | jitter capture: logs 60 frames of movement deltas |
| `I` | in a level | re-open the level's **briefing** — the once-only screen that explains a new mechanic. Shown automatically on a level's first visit; this key is the only way to see it again without clearing progress. |
| `H` | in a level | **clean freeze for screenshots** — halts the level with no dim, no menu and no music change, and holds the HUD's own tweens and timers so a guest bubble can't expire out of the shot. `H` again to resume; `Esc` cannot, because the level scene is paused and never sees it. |
| `M` | anywhere | mute toggle (ships; not debug) |

## Testing notes

- Seed `briefingsShown` or a level never becomes ACTIVE. A level that
  introduces a mechanic shows a briefing on its first visit, and that
  briefing PAUSES the level — so `scene.isActive('Garage')` is false and
  any harness waiting on it times out. Seed
  `{"briefingsShown":{"coatroom":true,"belldesk":true,"garage":true,"museum":true,"exodus":true}}`
  alongside the other progress keys.
- Reach TUNING through the URL the page actually loaded. Vite stamps
  edited modules (`/src/config/tuning.js?t=<ts>`), and a bare dynamic
  import of the unstamped path hands back a second instance the running
  scenes never read — writes to it are silently ignored, `godMode`
  included. Resolve the stamped URL from
  `performance.getEntriesByType('resource')` and import that.
- Seed progression explicitly; fresh-profile defaults are a test
  hazard, not a baseline. Headless/staged test profiles must
  explicitly seed progression state (unlocks, settings) rather than
  inherit fresh-profile defaults — a silently locked ability
  (dashUnlocked) invalidated two rounds of gap verification before
  this rule existed (handoff 2026-08-09-f). Seed via localStorage
  key `chexys-big-day-progress-v1`, e.g. `{"dashUnlocked":true}`.
