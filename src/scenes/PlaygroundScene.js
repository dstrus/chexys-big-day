import Phaser from 'phaser'
import { TUNING } from '../config/tuning.js'

// Grey-box rush level: ~3 screens wide (BRIEF-01).
export const WORLD_WIDTH = 1440
export const WORLD_HEIGHT = 270

export default class PlaygroundScene extends Phaser.Scene {
  constructor() {
    super('Playground')
  }

  create() {
    this.physics.world.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT)

    this.platforms = this.physics.add.staticGroup()
    this.buildLevel()

    this.player = this.physics.add.sprite(60, 190, 'chexy')
    this.player.setCollideWorldBounds(true)
    this.physics.add.collider(this.player, this.platforms)

    this.cameras.main.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT)
    this.cameras.main.startFollow(this.player, true, 0.15, 0.15)
  }

  buildLevel() {
    const slab = (x, y, w, h) => {
      const p = this.platforms.create(x + w / 2, y + h / 2, 'platform')
      p.setDisplaySize(w, h).refreshBody()
      return p
    }
    slab(0, 254, WORLD_WIDTH, 16) // ground
    slab(180, 196, 90, 10)
    slab(360, 150, 90, 10)
    slab(620, 180, 110, 10)
    slab(820, 130, 90, 10)
    slab(1000, 190, 100, 10)
    slab(1210, 150, 110, 10)
  }

  update() {
    // gravity is read live so the tuning panel affects it immediately
    this.physics.world.gravity.y = TUNING.gravity
  }
}
