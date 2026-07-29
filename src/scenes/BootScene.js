import Phaser from 'phaser'
import coatroomMap from '../../assets/maps/coatroom.json'

// Placeholder art only: every "sprite" is a generated texture. Maps are
// real Tiled JSON (assets/maps/), imported through Vite and injected
// into the tilemap cache here.
export default class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot')
  }

  create() {
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
