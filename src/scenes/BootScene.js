import Phaser from 'phaser'
import coatroomMap from '../../assets/maps/coatroom.json'
import belldeskMap from '../../assets/maps/belldesk.json'
import garageMap from '../../assets/maps/garage.json'
import museumMap from '../../assets/maps/museum.json'
import exodusMap from '../../assets/maps/exodus.json'
import { audio } from '../systems/AudioBus.js'
import { preloadParallax } from '../systems/parallax.js'

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
// real tileset art (BRIEF-ART-02): drop-in like sprites/audio — present
// wins, absent falls back to the generated placeholder strip
const TILES_PNG = import.meta.glob('../../assets/tiles/coatroom.png', {
  eager: true,
  query: '?url',
  import: 'default',
})
// alternate coatroom sheet (experiment, 2026-08-13): a DIFFERENT role
// layout — 4 repeating floor tiles + platform left/middle×2/right. Its
// skin table lives in LevelScene; drop the file to switch looks, delete
// it to fall back to the original sheet.
const TILES2_PNG = import.meta.glob('../../assets/tiles/coatroom2.png', {
  eager: true,
  query: '?url',
  import: 'default',
})
// coat item sprites (BRIEF-ART-03 §1): 3-frame 24x24 strip; garment
// colors baked in per the -b ruling (the tag chip carries category)
const COATS_PNG = import.meta.glob('../../assets/sprites/coats.png', {
  eager: true,
  query: '?url',
  import: 'default',
})
// garage cars (BRIEF-ART-04 §1): one drawing per silhouette tier plus
// its palette-swap variants (car-sedan.png, car-sedan-crimson.png, …).
// Each loads under its own file stem; the drawn size IS the collision
// rect (ruling 2026-08-13), so no frame slicing here.
const CAR_PNGS = import.meta.glob('../../assets/sprites/car-*.png', {
  eager: true,
  query: '?url',
  import: 'default',
})
// enemy V1 "Stub" atlas (BRIEF-ART-03 §2). Its anims register
// SPRITE-LOCALLY per the 2026-07-30-a namespace policy — the enemy's
// tag names (move/grab/carry/stun) never touch the global namespace.
const ENEMY_PNG = import.meta.glob('../../assets/sprites/enemy-stub.png', {
  eager: true,
  query: '?url',
  import: 'default',
})
const ENEMY_JSON = import.meta.glob('../../assets/sprites/enemy-stub.json', {
  eager: true,
  import: 'default',
})
// Golden Hanger icon strip (BRIEF-ART-03 §3): golden/tarnished/broken
const HANGER_PNG = import.meta.glob('../../assets/sprites/hanger.png', {
  eager: true,
  query: '?url',
  import: 'default',
})
// collectible icons (BRIEF-04, art per BRIEF-ART-03 §3): 12×12 strips —
// nfc-tag (2-frame glint), contact-card (vCard), insight-report
// (digital screen, never paper). Same drop-in contract; placeholders
// generate below until they land.
const COLLECTIBLE_PNGS = import.meta.glob(
  ['../../assets/sprites/nfc-tag.png', '../../assets/sprites/contact-card.png', '../../assets/sprites/insight-report.png'],
  { eager: true, query: '?url', import: 'default' }
)
// stub particle (BRIEF-ART-03 §2, "highest-reuse asset"): rescue poof
// now, boss confetti later. The export is untagged, so the anim is
// built from the atlas under a namespaced fx key with the .ase
// durations read from the JSON (timing stays authoritative).
const PARTICLE_PNG = import.meta.glob('../../assets/sprites/particle.png', {
  eager: true,
  query: '?url',
  import: 'default',
})
const PARTICLE_JSON = import.meta.glob('../../assets/sprites/particle.json', {
  eager: true,
  import: 'default',
})

export default class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot')
  }

  preload() {
    audio.preload(this) // queue any dropped-in audio files
    preloadParallax(this) // queue any dropped-in parallax paintings
    const tilesUrl = Object.values(TILES_PNG)[0]
    if (tilesUrl) this.load.image('tiles', tilesUrl)
    const tiles2Url = Object.values(TILES2_PNG)[0]
    if (tiles2Url) this.load.image('tiles2', tiles2Url)
    const coatsUrl = Object.values(COATS_PNG)[0]
    if (coatsUrl) this.load.spritesheet('coats', coatsUrl, { frameWidth: 24, frameHeight: 24 })
    for (const [path, url] of Object.entries(CAR_PNGS)) {
      this.load.image(path.split('/').pop().replace('.png', ''), url)
    }
    const hangerUrl = Object.values(HANGER_PNG)[0]
    if (hangerUrl) this.load.spritesheet('hanger', hangerUrl, { frameWidth: 12, frameHeight: 12 })
    for (const [path, url] of Object.entries(COLLECTIBLE_PNGS)) {
      const key = path.split('/').pop().replace('.png', '')
      this.load.spritesheet(key, url, { frameWidth: 12, frameHeight: 12 })
    }
    const particlePng = Object.values(PARTICLE_PNG)[0]
    const particleJson = Object.values(PARTICLE_JSON)[0]
    if (particlePng && particleJson) {
      const normalized = normalizeAsepriteAtlas(particleJson)
      const blobUrl = URL.createObjectURL(
        new Blob([JSON.stringify(normalized)], { type: 'application/json' })
      )
      this.load.aseprite('particle-atlas', particlePng, blobUrl)
    }
    const enemyPng = Object.values(ENEMY_PNG)[0]
    const enemyJson = Object.values(ENEMY_JSON)[0]
    if (enemyPng && enemyJson) {
      const normalized = normalizeAsepriteAtlas(enemyJson)
      const blobUrl = URL.createObjectURL(
        new Blob([JSON.stringify(normalized)], { type: 'application/json' })
      )
      this.load.aseprite('enemy-atlas', enemyPng, blobUrl)
    }
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
    if (this.textures.exists('particle-atlas')) {
      const pData = Object.values(PARTICLE_JSON)[0]
      const all = Array.isArray(pData.frames) ? pData.frames : Object.values(pData.frames)
      // use the 'poof' tag's range when present (future fx can share the
      // file under their own tags); whole file if untagged
      const tag = (pData.meta.frameTags ?? []).find((t) => t.name === 'poof')
      const from = tag ? tag.from : 0
      const to = tag ? tag.to : all.length - 1
      const frames = all.slice(from, to + 1)
      this.anims.create({
        key: 'fx-stub-poof', // fx- prefix: never collides with character tags
        frames: frames.map((f, i) => ({
          key: 'particle-atlas',
          frame: String(from + i),
          duration: f.duration,
        })),
        duration: frames.reduce((sum, f) => sum + f.duration, 0),
      })
    }
    const g = this.add.graphics()
    const make = (key, w, h, color) => {
      g.clear()
      g.fillStyle(color, 1)
      g.fillRect(0, 0, w, h)
      g.generateTexture(key, w, h)
    }

    make('chexy', 44, 44, 0xd98e32) // squat squirrel stand-in
    // items are white so category tints (ChexApp tag colors) read true;
    // three sizes = the weight-tier silhouettes (BRIEF-03 interim
    // convention: small garment bag / medium roller / large trunk)
    make('item-standard', 14, 14, 0xffffff)
    make('item-medium', 20, 22, 0xffffff)
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

    // muted-speaker indicator (handoff 2026-08-07-d): tinted Gray 500 at
    // partial alpha by whichever scene shows it
    g.clear()
    g.fillStyle(0xffffff, 1)
    g.fillRect(0, 3, 3, 4) // speaker body
    g.fillTriangle(3, 5, 7, 1, 7, 9) // cone
    g.lineStyle(1, 0xffffff, 1)
    g.lineBetween(0, 9, 9, 0) // the slash
    g.strokePath()
    g.generateTexture('mute-icon', 10, 10)

    // collectible placeholders (BRIEF-04): orange diamond / white card /
    // yellow diamond, 12×12, until the real icons drop in
    const diamond = (key, color) => {
      g.clear()
      g.fillStyle(color, 1)
      g.fillTriangle(6, 0, 12, 6, 0, 6)
      g.fillTriangle(0, 6, 12, 6, 6, 12)
      g.generateTexture(key, 12, 12)
    }
    diamond('collectible-nfcTag', 0xfe701e) // Chexology Orange
    diamond('collectible-insightReport', 0xffe123) // Warning Yellow
    g.clear()
    g.fillStyle(0xffffff, 1)
    g.fillRect(1, 2, 10, 8) // white card
    g.generateTexture('collectible-contactCard', 12, 12)

    // placeholder tileset strip — only generated when no real tileset
    // art was dropped in (name 'placeholder', 16x16, roles per
    // assets/maps/README.md)
    if (!this.textures.exists('tiles')) this.generatePlaceholderTiles(g)
    g.destroy()

    this.cache.tilemap.add('coatroom', {
      format: Phaser.Tilemaps.Formats.TILED_JSON,
      data: coatroomMap,
    })
    this.cache.tilemap.add('belldesk', {
      format: Phaser.Tilemaps.Formats.TILED_JSON,
      data: belldeskMap,
    })
    this.cache.tilemap.add('garage', {
      format: Phaser.Tilemaps.Formats.TILED_JSON,
      data: garageMap,
    })
    this.cache.tilemap.add('museum', {
      format: Phaser.Tilemaps.Formats.TILED_JSON,
      data: museumMap,
    })
    this.cache.tilemap.add('exodus', {
      format: Phaser.Tilemaps.Formats.TILED_JSON,
      data: exodusMap,
    })

    this.scene.start('Title')
  }

  generatePlaceholderTiles(g) {
    const TILE_COLORS = [
      0x4a4a5a, // 1 ground
      0x5f5f73, // 2 rack platform MIDDLE
      0x6b4a32, // 3 counter wood
      0x2e2e3e, // 4 bg dressing near
      0x26263a, // 5 bg dressing far
      0x71718c, // 6 rack platform LEFT CAP
      0x71718c, // 7 rack platform RIGHT CAP
      0x445c44, // 8 spare
    ]
    g.clear()
    TILE_COLORS.forEach((color, i) => {
      g.fillStyle(color, 1)
      g.fillRect(i * 16, 0, 16, 16)
    })
    g.generateTexture('tiles', 128, 16)
  }
}
