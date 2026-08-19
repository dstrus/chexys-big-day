# SFX reconciliation — manifest vs. code

The agent task SFX-MANIFEST.md sets before production, run 2026-08-19
against HEAD. Method: every `audio.play(...)` argument in `src/`
(including the ternary and table-driven call sites — a naive grep for
string literals misses `cleared ? 'runClear' : 'runFail'` and the
collectible table's `def.sfx`), against the manifest's event names and
`src/systems/sfx.js`'s synth voices.

**Counts:** 21 events are actually called in code. The manifest names 32
(plus 11 parked with the finale). One real SFX file exists: `tag.mp3`.

## 1. Name mismatches — the money section

These are the same sound under two names. A file delivered under the
manifest name USED TO be ignored; as of 2026-08-19 the bus carries these
as aliases, so either name plays. **Prefer the code name** — it wins
when both exist, and it's what the warning messages print.

| Manifest name | Code event | Notes |
|---|---|---|
| `tap` | **`tag`** | the most-heard sound in the game, and `tag.mp3` already ships |
| `rescueStun` | **`stun`** | |
| `stealGrab` | **`gloat`** | |
| `bigDayStamp` | **`stamp`** | |
| `hangerChime` | **`chime`** | code plays one `chime` per hanger, so the manifest's "3 ascending tones" needs either three files (`chime-1/2/3` as a pool is NOT right — a pool randomises; ascending order needs three distinct events) or a code change. **Flagged for a ruling.** |

Already bridged before today, no action: `holdComplete`→`heavyTag`,
`holdInterrupt`→`interrupt`, `itemLost`→`lose`,
`multiplierUp`→`heatUp`, `rushEnd`→`runClear`/`runFail`.

## 2. In the manifest, but nothing in code plays it

Producing these is safe but they will be SILENT until a call site is
added — each is a small code task, listed so the cost is visible.

`tap whiff` · `dash` · `land` · `uiConfirm` · `uiBack` · `muteToggle` ·
`requestFired` · `driveOff` · `safeAtEdge` · `eliteRip` · `chipRestore` ·
`edgePush` · `swarmSlowContact` · `strollerBrake`

Two of these need a design answer, not just a call site:

- **`edgePush`** — the manifest wants a "rubbery boing-nudge, comic". But
  the trailing-edge push was re-ruled on 2026-08-14 to a silent
  POSITION CARRY, precisely because the old bouncy nudge read wrong
  (Chexy now rides in idle). A comic boing would re-assert the reading
  that ruling removed. Recommend cutting it, or repurposing it as the
  sound of Chexy being *squeezed* against a car.
- **`safeAtEdge`** — the garage's bank already plays `cardReturn`. Either
  the manifest's dedicated two-note click-rise replaces that, or this
  entry is redundant.

## 3. In code, but absent from the manifest

- **`spawn`** — plays on every item and car arrival. Not in the
  manifest at all, and it is a high-frequency sound. Needs an entry.
- **`runClear` / `runFail`** — the results-screen stings. Both currently
  fall back to `rushEnd`, so a win and a loss sound identical. The
  manifest lists only `rushEnd`. With `success.mp3`/`fail.mp3` now
  playing under the summary, a distinct sting may be redundant — but
  that is a call, not an oversight.
- **`steal`** — a synth voice exists and nothing calls it; the code uses
  `gloat` for that beat. Dead voice, safe to ignore or delete.

## 4. [VAR] variant pools — CONFIRMED AND IMPLEMENTED

The manifest asks that this be settled before production because it
changes export counts. It is:

**Name variants `event-1`, `event-2`, `event-3` …** (e.g. `tag-1.mp3`,
`tag-2.mp3`, `tag-3.mp3`). The bus groups them into a pool for `tag`,
picks at random on each play, and **never repeats the previous pick**.

- Any count works; 3–4 as the manifest suggests.
- A pool and a bare single may coexist — **the pool wins**, in either
  glob order.
- Aliases pool too: `tap-1.mp3` … would serve the `tag` event.
- Extensions may be mixed within a pool.

So the three [VAR] events — `tag` (manifest `tap`), `stun` (manifest
`rescueStun`), `tagPickup` — are 3–4 files each rather than one.

## 5. Everything else lines up

Called in code, named in the manifest, synth-voiced today, ready to be
replaced by a file with no code change: `holdStart`, `multiplierDown`,
`rushStart`, `uiSelect`, `tagPickup`, `cardPickup`, `cardReturn`,
`insightPickup`, `insightEnd`, plus the five bridged names in §1.

Session 4 (11 events) stays parked with the finale per handoff
2026-08-14-e; nothing in it was reconciled.
