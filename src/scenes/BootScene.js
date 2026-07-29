import Phaser from 'phaser'

// Grey-box only: every "sprite" is a generated colored rectangle texture.
// No art assets in this phase (BRIEF-01).
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
    make('item-standard', 14, 14, 0x59c2e8)
    make('item-heavy', 26, 30, 0x9b6ee8)
    make('ticket', 18, 12, 0xf2ecd8) // paper claim ticket enemy
    make('pixel', 2, 2, 0xffffff)
    make('platform', 8, 8, 0x4a4a5a)

    g.destroy()
    this.scene.start('Title')
  }
}
