import Phaser from 'phaser'
import coatroomMap from '../../assets/maps/coatroom.json'
import { audio } from '../systems/AudioBus.js'

// Placeholder art only: every "sprite" is a generated texture. Maps are
// real Tiled JSON (assets/maps/), imported through Vite and injected
// into the tilemap cache here.
// Art-track handshake (BRIEF-02 Chunk 4). Sprite source priority:
//   1. Aseprite atlas export  (assets/sprites/chexy.png + chexy.json)
//   2. static style-proof frame (assets/sprites/chexy-idle.png)
//   3. grey-box rect
// Vite globs return an empty object when a file is absent, so dropping
// exports in (or deleting them) needs zero code changes and never
// breaks the build. Frame-tag conventions: assets/sprites/README.md.
const ATLAS_PNG = import.meta.glob('../../assets/sprites/chexy.png', {
  eager: true,
  query: '?url',
  import: 'default',
})
const ATLAS_JSON = import.meta.glob('../../assets/sprites/chexy.json', {
  eager: true,
  import: 'default',
})

// Phaser's createFromAseprite looks frames up by numeric index, but GUI
// exports default to filename keys ("chexy 0.aseprite") and json-hash.
// Normalize any export shape to index-named json-array — order and
// per-frame durations pass through untouched (the .ase file is the
// single source of truth for animation timing; never redefine timing
// in code or tuning.js).
function normalizeAsepriteAtlas(data) {
  const frames = Array.isArray(data.frames) ? data.frames : Object.values(data.frames)
  const rewrites = !Array.isArray(data.frames) || frames.some((f, i) => f.filename !== String(i))
  if (rewrites) {
    // fallback only — a correct export needs no rewriting (handoff 2026-07-30-a)
    console.warn(
      'Aseprite atlas frame keys were normalized at load. Export with ' +
        "--filename-format '{frame}' (scripts/export-sprites.sh does this) " +
        'so frame keys are numeric.'
    )
  }
  return { ...data, frames: frames.map((f, i) => ({ ...f, filename: String(i) })) }
}
const IDLE_PNG = import.meta.glob('../../assets/sprites/chexy-idle.png', {
  eager: true,
  query: '?url',
  import: 'default',
})

export default class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot')
  }

  preload() {
    audio.preload(this) // queue any dropped-in audio files
    const atlasPng = Object.values(ATLAS_PNG)[0]
    const atlasJson = Object.values(ATLAS_JSON)[0]
    if (atlasPng && atlasJson) {
      const normalized = normalizeAsepriteAtlas(atlasJson)
      const blobUrl = URL.createObjectURL(
        new Blob([JSON.stringify(normalized)], { type: 'application/json' })
      )
      this.load.aseprite('chexy-atlas', atlasPng, blobUrl)
    } else {
      const idle = Object.values(IDLE_PNG)[0]
      if (idle) this.load.image('chexy-idle', idle)
    }
  }

  create() {
    audio.init(this.game)
    if (this.textures.exists('chexy-atlas')) {
      // one anim per Aseprite frame tag (idle, run, jump, ...)
      this.anims.createFromAseprite('chexy-atlas')
    }
    const g = this.add.graphics()
    const make = (key, w, h, color) => {
      g.clear()
      g.fillStyle(color, 1)
      g.fillRect(0, 0, w, h)
      g.generateTexture(key, w, h)
    }

    make('chexy', 44, 44, 0xd98e32) // squat squirrel stand-in
    // items are white so category tints (ChexApp tag colors) read true
    make('item-standard', 14, 14, 0xffffff)
    make('item-heavy', 26, 30, 0xffffff)
    make('ticket', 18, 12, 0xf2ecd8) // paper claim ticket enemy
    make('pixel', 2, 2, 0xffffff)
    // tag chip: neutral 8x8 template, runtime-tinted per category
    // (handoff 2026-08-01-b) — dark border survives tinting so the chip
    // reads even against a same-colored item
    g.clear()
    g.fillStyle(0x181818, 1)
    g.fillRect(0, 0, 8, 8)
    g.fillStyle(0xffffff, 1)
    g.fillRect(1, 1, 6, 6)
    g.generateTexture('tag-chip', 8, 8)

    // 8-tile placeholder tileset strip matching the maps' embedded
    // tileset (name 'placeholder', 16x16, one row of 8)
    const TILE_COLORS = [
      0x4a4a5a, // 1 ground
      0x5f5f73, // 2 rack platform
      0x6b4a32, // 3 counter wood
      0x2e2e3e, // 4 bg dressing near
      0x26263a, // 5 bg dressing far
      0x7a3c3c, // 6 accent red
      0x3c5a7a, // 7 accent blue
      0x445c44, // 8 accent green
    ]
    g.clear()
    TILE_COLORS.forEach((color, i) => {
      g.fillStyle(color, 1)
      g.fillRect(i * 16, 0, 16, 16)
    })
    g.generateTexture('tiles', 128, 16)
    g.destroy()

    this.cache.tilemap.add('coatroom', {
      format: Phaser.Tilemaps.Formats.TILED_JSON,
      data: coatroomMap,
    })

    this.scene.start('Title')
  }
}
