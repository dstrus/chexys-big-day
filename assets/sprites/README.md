# assets/sprites/ — art-track handshake

Drop files here and the game upgrades itself; delete them and it falls
back. **Zero code changes either way.** Priority:

1. `chexy.png` + `chexy.json` — Aseprite atlas export (animated)
2. `chexy-idle.png` — static 48×48 style-proof frame
3. *(nothing)* — grey-box placeholder rect

## Exporting from Aseprite

Save the source as `art/aseprite/chexy.aseprite` (the app's default
extension; `.ase` also works — but not both), then:

```
./scripts/export-sprites.sh
```

(wraps `aseprite -b --sheet ... --data ... --format json-array
--sheet-type packed --list-tags --filename-format '{frame}'`; set
`ASEPRITE=/path/to/aseprite` if the CLI isn't on PATH).

GUI exports (File → Export Sprite Sheet) also work — the game
normalizes frame keys at load. Just make sure **Meta: Tags** is
checked so `frameTags` land in the JSON, and export PNG + JSON to
the names above. Frame durations come from the .ase file either
way — timing is never redefined in code.

## Frame-tag conventions (BRIEF-02 Chunk 4)

Tag names in the Aseprite file become animation keys. The game's
state machine uses:

`idle` `run` `jump` `fall` `land` `dash` `tap` `hold` `hit` `teeter`
`win` `lose`

- `idle` / `run` / `jump` / `fall` / `hold` loop; `land` / `tap` /
  `hit` play once; `win` / `lose` loop on the results screen.
- `tap` is the check-in one-shot (fires on instant taps AND hold
  completions) — renamed 2026-08-04 from the reserved `tag` key,
  which was never drawn.
- `teeter` loops in place of `idle` when Chexy is grounded,
  stationary, and overhanging a platform edge (supported fraction
  below teeterSupportFraction); Chexy faces the drop. Replaces
  ONLY idle — pure visual, zero mechanics (handoff 2026-08-05-b).
- `dash` plays once and HOLDS its final frame for the rest of the
  dash (2 frames: launch pose, then the held flight pose).
- Tags may land incrementally — any missing tag falls back to `idle`,
  so an idle-only export already animates in-game.
- Frame durations set in Aseprite are respected (createFromAseprite).

## Sprite rules (locked — DESIGN.md §5)

- 48×48 canvas; body mass inside a 32×32 region anchored
  bottom-center (= the physics hitbox). Tail/ears/hair overhang is
  visual-only and never collides.
- Native facing is LEFT for every frame; the game flips for
  rightward movement. Default spawn facing is right.

## Previewing animation timing

Open `tools/flipbook.html` in a browser (straight from file://, no
build step) to scrub tags and test fps before exporting to the game.
