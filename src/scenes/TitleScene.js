import Phaser from 'phaser'
import { GAME_WIDTH, GAME_HEIGHT } from '../main.js'
import { unlockAudio } from '../systems/sfx.js'
import { audio } from '../systems/AudioBus.js'

export default class TitleScene extends Phaser.Scene {
  constructor() {
    super('Title')
  }

  create() {
    this.add
      .text(GAME_WIDTH / 2, 92, "Chexy's BIG DAY", {
        fontFamily: 'monospace',
        fontSize: '28px',
        fontStyle: 'bold',
        color: '#f2ecd8',
      })
      .setOrigin(0.5)

    this.add
      .text(GAME_WIDTH / 2, 128, 'a Chexology rush', {
        fontFamily: 'monospace',
        fontSize: '10px',
        color: '#59c2e8',
      })
      .setOrigin(0.5)

    const prompt = this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT - 70, 'PRESS ANY KEY', {
        fontFamily: 'monospace',
        fontSize: '12px',
        color: '#ffffff',
      })
      .setOrigin(0.5)

    this.tweens.add({
      targets: prompt,
      alpha: 0.25,
      duration: 600,
      yoyo: true,
      repeat: -1,
    })

    this.input.keyboard.once('keydown', () => {
      unlockAudio() // first user gesture — safe to create the AudioContext
      audio.play('uiSelect')
      this.scene.start('LevelSelect')
    })
  }
}
