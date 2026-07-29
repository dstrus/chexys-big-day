# BRIEF-01 — Repo scaffold + grey-box prototype

**For:** Claude Code session 1
**Read first:** CLAUDE.md, then DESIGN.md (§2 core loop, §2.3
tagging, §2.5 difficulty, §5 rendering, §7 performance).
**Goal:** A playable grey-box of the core loop. Colored rectangles
only — NO art assets, NO sprites, NO tilesets in this session.

## Deliverables

1. **Project scaffold**
   - Phaser 3 (latest stable) + Vite, JS ES modules.
   - `npm run dev` serves locally; `npm run build` outputs static
     dist/ suitable for GitHub Pages / itch.io.
   - Phaser config: 480×270 internal resolution, `pixelArt: true`,
     integer zoom to fit window (never fractional scale).
   - Scenes: Boot, Title (placeholder text + "press any key"),
     Playground (the grey-box level), UIOverlay.

2. **Player (Chexy placeholder: 44×44 colored rect)**
   - Move left/right (arrows), jump (Up/Space), tag (Z/J),
     dash stub (X/K — implemented but disabled via tuning flag).
   - Platformer feel baseline: acceleration/deceleration (not
     instant velocity), variable jump height (release to cut),
     coyote time, jump input buffering. All values from
     `src/config/tuning.js`.

3. **Tagging system (DESIGN.md §2.3)**
   - Standard items (small rects): instant tap. On tag: 2–3 frames
     hitstop, simple particle burst, placeholder SFX (jsfxr-style
     generated blip is fine).
   - Heavy items (larger rects): hold-to-tag with radial meter over
     the player; interrupted if the player is hit or moves; hold
     duration from tuning.js.
   - Auto-target: nearest valid item within radius (tuning.js);
     current target gets a visible outline.

4. **One grey-box rush**
   - Scrolling level ~3 screens wide, a few platforms.
   - Items spawn on a simple wave schedule over a 2:30 timer.
   - One enemy type: "ticket" rect that drifts toward untagged
     items and steals one on contact (item exits = 1 lost item).
   - 3 lost items ends the run: simple results screen (items
     returned, tags collected, score, retry key).
   - Score + basic multiplier hook: implement the adaptive
     intensity/multiplier skeleton from DESIGN.md §2.5 (spawn-rate
     eases on losses, multiplier drops, both recover on a clean
     streak, values clamped and tunable). HUD shows timer, lost
     items, score, current multiplier.

5. **Debug tuning panel** (critical deliverable — the human tunes
   feel with this, not through code round-trips)
   - Toggle with backtick (`).
   - Live sliders bound to tuning.js values: gravity, move accel,
     max speed, jump velocity, jump cut multiplier, coyote ms,
     buffer ms, hold-tag duration, target radius, adaptive band,
     multiplier floor.
   - "Copy values" button that dumps current settings as JSON to
     clipboard so the human can paste final numbers back.

6. **Housekeeping**
   - Commit at each numbered deliverable, descriptive messages.
   - End state: `npm run dev` boots clean, no console errors,
     60fps with the panel open (check with browser FPS meter).

## Acceptance (human will verify by playing)

- Can complete and fail the rush; retry works.
- Tap-tag feels punchy; hold-tag reads clearly and interrupts.
- Every listed tuning value adjusts live from the panel.
- No art, no scope beyond this brief. If something in here
  contradicts CLAUDE.md or DESIGN.md, stop and ask.
