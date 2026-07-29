import Phaser from 'phaser'

// HUD + results overlay. Runs in parallel with Playground and never
// restarts; it reacts to game-wide events emitted by the run.
export default class UIOverlayScene extends Phaser.Scene {
  constructor() {
    super('UIOverlay')
  }

  create() {
    // HUD lands with the grey-box rush deliverable
  }
}
