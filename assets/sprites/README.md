# assets/sprites/ — art-track handshake

Drop files here and the game upgrades itself; delete them and it falls
back. **Zero code changes either way.** Priority:

1. `chexy.png` + `chexy.json` — Aseprite atlas export (animated)
2. `chexy-idle.png` — static 48×48 style-proof frame
3. *(nothing)* — grey-box placeholder rect

## Exporting from Aseprite

Save the source as `art/aseprite/chexy.ase`, then:

```
./scripts/export-sprites.sh
```

(wraps `aseprite -b --sheet ... --data ... --format json-array
--sheet-type packed --list-tags --filename-format '{frame}'`; set
`ASEPRITE=/path/to/aseprite` if the CLI isn't on PATH). The
`{frame}` filename format is required — Phaser's createFromAseprite
looks frames up by numeric index.

## Frame-tag conventions (BRIEF-02 Chunk 4)

Tag names in the Aseprite file become animation keys. The game's
state machine uses:

`idle` `run` `jump` `fall` `land` `tag` `hold` `hit` `win` `lose`

- `idle` / `run` / `jump` / `fall` / `hold` loop; `land` / `tag` /
  `hit` play once; `win` / `lose` loop on the results screen.
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
