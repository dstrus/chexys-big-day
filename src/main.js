import Phaser from 'phaser'
import { TUNING } from './config/tuning.js'
import BootScene from './scenes/BootScene.js'
import TitleScene from './scenes/TitleScene.js'
import LevelSelectScene from './scenes/LevelSelectScene.js'
import LevelScene from './scenes/LevelScene.js'
import UIOverlayScene from './scenes/UIOverlayScene.js'
import { initTuningPanel } from './debug/tuningPanel.js'

export const GAME_WIDTH = 480
export const GAME_HEIGHT = 270

// Largest whole-number zoom that fits the window — integer scaling only,
// never fractional (DESIGN.md §5).
function integerZoom() {
  return Math.max(
    1,
    Math.min(
      Math.floor(window.innerWidth / GAME_WIDTH),
      Math.floor(window.innerHeight / GAME_HEIGHT)
    )
  )
}

const game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game',
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  pixelArt: true,
  roundPixels: true,
  backgroundColor: '#101018',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: TUNING.gravity },
    },
  },
  scale: {
    mode: Phaser.Scale.NONE,
    zoom: integerZoom(),
  },
  scene: [BootScene, TitleScene, LevelSelectScene, LevelScene, UIOverlayScene],
})

window.addEventListener('resize', () => game.scale.setZoom(integerZoom()))

// dev-only handle for debugging/verification tooling
if (import.meta.env.DEV) window.__game = game

initTuningPanel()
