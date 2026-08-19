# assets/audio/ — sound drop-in (BRIEF-02 Chunk 5)

Same contract as sprites: **drop a file in and it wins; delete it and
the generated placeholder returns. Zero code changes, never crashes.**
Formats: `.wav`, `.mp3`, `.ogg`. Every event has a jsfxr-style synth
placeholder, so missing files are simply skipped.

## SFX — name a file after an event

Canonical event names (BRIEF-02):

`tag` `holdStart` `holdComplete` `holdInterrupt` `itemLost`
`multiplierUp` `multiplierDown` `rushStart` `rushEnd` `uiSelect`

Finer-grained game events resolve to their own file name first, then
fall back to a canonical name:

| Game event | Falls back to |
|------------|---------------|
| `heavyTag` | `holdComplete` |
| `interrupt` | `holdInterrupt` |
| `lose` | `itemLost` |
| `heatUp` | `multiplierUp` |
| `runClear`, `runFail` | `rushEnd` |
| `spawn`, `steal`, `gloat`, `stun`, `chime`, `stamp` | *(own name only)* |

Example: `assets/audio/tag.wav` replaces the tap-tag blip everywhere;
`assets/audio/runClear.wav` gives the win jingle its own sound while
`runFail` still falls back to `rushEnd.wav` (or the synth).

## Variant pools ([VAR] events)

`tag-1.mp3`, `tag-2.mp3`, `tag-3.mp3` form a POOL for the event `tag`:
play() picks at random and never repeats the previous pick. Any count
works, extensions may be mixed, and a bare `tag.mp3` alongside a pool
loses to the pool. Aliases pool too, so `tap-1.mp3` … also serves `tag`.
See SFX-MANIFEST.md for which events want variants and
SFX-RECONCILE.md for the manifest-to-code name map.

## Music — one looping track per level

Drop `assets/audio/music/<levelId>.mp3` (e.g. `coatroom.mp3`) and it
loops for that level; without one, a generated 4-bar chiptune stub
plays.

### Archived tracks

A leading underscore means ARCHIVED: `music/_coatroom.mp3` is a
superseded take kept for reference. The loader skips `_`-prefixed
files entirely, so they are neither downloaded at boot nor bundled
into a build. Rename without the underscore to bring one back.

### Results screen: two reserved names

`music/success.mp3` and `music/fail.mp3` are not levels — they are the
summary screen's own tracks, one per outcome. When the file for an
outcome exists, the level loop STOPS and that track loops under the
summary; when it doesn't, the level loop simply ducks to 30% as it
always did. Both behaviours are drop-in: adding the file switches the
level over, deleting it reverts to the duck. Leaving the summary
(retry or exit) stops the results track, and a retry starts the level's
own music from the top.

Unlike level tracks these never fall back to the chiptune stub — a
generated loop under a summary screen would be worse than the duck.

## Volumes

`masterVolume` / `sfxVolume` / `musicVolume` live in
`src/config/tuning.js` with live sliders on the debug panel (backtick).
