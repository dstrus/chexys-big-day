import Phaser from 'phaser'
import { GAME_WIDTH } from '../main.js'
import { LEVELS } from '../config/levels.js'
import { levelBest } from '../systems/progress.js'
import { createHanger } from '../ui/hanger.js'
import { audio } from '../systems/AudioBus.js'

const ROW_X = 96
const ROW_Y0 = 76
const ROW_H = 32

// Level select (BRIEF-02 Chunk 6): Title → here → level → results →
// back here. Locked slots stay visible as "?" so the shape of the whole
// game reads from day one.
export default class LevelSelectScene extends Phaser.Scene {
  constructor() {
    super('LevelSelect')
  }

  create() {
    audio.stopMusic()

    this.add
      .text(GAME_WIDTH / 2, 36, 'SELECT YOUR SHIFT', {
        fontFamily: 'monospace',
        fontSize: '14px',
        fontStyle: 'bold',
        color: '#f2ecd8',
      })
      .setOrigin(0.5)

    this.rowTexts = LEVELS.map((lvl, i) => {
      const y = ROW_Y0 + i * ROW_H
      const label = `${i + 1}  ${lvl.unlocked ? lvl.name : '???'}`
      const row = this.add
        .text(ROW_X, y, label, {
          fontFamily: 'monospace',
          fontSize: '11px',
          color: '#98a2b3',
        })
        .setOrigin(0, 0.5)
      if (lvl.unlocked) {
        const best = levelBest(lvl.id)
        if (best.bestScore > 0) {
          this.add
            .text(GAME_WIDTH - 148, y, `BEST ${best.bestScore}`, {
              fontFamily: 'monospace',
              fontSize: '10px',
              color: '#667085',
            })
            .setOrigin(0, 0.5)
        }
        // best hangers earned (0-3 icons), max across runs
        for (let h = 0; h < 3; h++) {
          createHanger(this, GAME_WIDTH - 64 + h * 17, y - 6, 1).setState(
            h < best.bestHangers ? 'golden' : 'tarnished'
          )
        }
      }
      return row
    })

    this.marker = this.add
      .text(ROW_X - 18, ROW_Y0, '▶', { fontFamily: 'monospace', fontSize: '11px', color: '#fe701e' })
      .setOrigin(0, 0.5)

    this.add
      .text(GAME_WIDTH / 2, 244, 'ARROWS SELECT · ENTER START · ESC TITLE', {
        fontFamily: 'monospace',
        fontSize: '9px',
        color: '#667085',
      })
      .setOrigin(0.5)

    this.idx = 0
    this.keys = this.input.keyboard.addKeys('UP,DOWN,W,S,ENTER,Z,SPACE,ESC')
    this.refresh()
  }

  refresh() {
    this.marker.setY(ROW_Y0 + this.idx * ROW_H)
    this.rowTexts.forEach((row, i) =>
      row.setColor(i === this.idx ? '#f2ecd8' : LEVELS[i].unlocked ? '#98a2b3' : '#475467')
    )
  }

  update() {
    const JustDown = Phaser.Input.Keyboard.JustDown
    if (JustDown(this.keys.UP) || JustDown(this.keys.W)) {
      this.idx = (this.idx + LEVELS.length - 1) % LEVELS.length
      audio.play('uiSelect')
      this.refresh()
    }
    if (JustDown(this.keys.DOWN) || JustDown(this.keys.S)) {
      this.idx = (this.idx + 1) % LEVELS.length
      audio.play('uiSelect')
      this.refresh()
    }
    if (JustDown(this.keys.ENTER) || JustDown(this.keys.Z) || JustDown(this.keys.SPACE)) {
      const lvl = LEVELS[this.idx]
      if (lvl.unlocked) {
        audio.play('uiSelect')
        this.scene.launch('UIOverlay')
        this.scene.start('Level', { mapKey: lvl.mapKey })
      } else {
        audio.play('interrupt') // locked
      }
    }
    if (JustDown(this.keys.ESC)) {
      this.scene.start('Title')
    }
  }
}
