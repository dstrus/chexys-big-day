import Phaser from 'phaser'
import { GAME_WIDTH, GAME_HEIGHT } from '../main.js'
import { unlockAudio } from '../systems/sfx.js'
import { audio } from '../systems/AudioBus.js'
import { deviceJustDown } from '../systems/deviceInput.js'

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

    // menu-space track (handoff 2026-08-07-d): starts here (deferred to
    // the first gesture by the autoplay lock) and continues through
    // Shift Select without restarting
    audio.startMusic('title')

    this.muteIcon = this.add
      .image(GAME_WIDTH - 10, GAME_HEIGHT - 9, 'mute-icon')
      .setTint(0x667085)
      .setAlpha(0.7)
      .setDepth(40)
      .setVisible(audio.muted)

    this.started = false
    this.start = () => {
      if (this.started) return
      this.started = true
      unlockAudio() // first user gesture — safe to create the AudioContext
      audio.play('uiSelect')
      this.scene.start('LevelSelect')
    }
    this.input.keyboard.once('keydown', this.start)
  }

  update() {
    this.muteIcon.setVisible(audio.muted)
    // "PRESS ANY KEY" means any BUTTON too (2026-08-28). Note the audio
    // caveat: a gamepad press is not a browser user-gesture, so starting
    // from the pad leaves the AudioContext locked until a key or click.
    // unlockAudio() is still called — it is a no-op until then.
    if (deviceJustDown('any')) this.start()
  }
}
