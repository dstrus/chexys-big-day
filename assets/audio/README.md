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

## Music — one looping track per level

Drop `assets/audio/music/<levelId>.mp3` (e.g. `coatroom.mp3`) and it
loops for that level; without one, a generated 4-bar chiptune stub
plays. Music ducks to 30% under the results screen and restores on
retry.

## Volumes

`masterVolume` / `sfxVolume` / `musicVolume` live in
`src/config/tuning.js` with live sliders on the debug panel (backtick).
