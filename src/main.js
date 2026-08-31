import Phaser from 'phaser'
import { TUNING } from './config/tuning.js'
import { initDeviceInput, isTouchDevice, padReport } from './systems/deviceInput.js'
import BootScene from './scenes/BootScene.js'
import TitleScene from './scenes/TitleScene.js'
import LevelSelectScene from './scenes/LevelSelectScene.js'
import LevelScene from './scenes/LevelScene.js'
import GarageScene from './scenes/GarageScene.js'
import MuseumScene from './scenes/MuseumScene.js'
import ExodusScene from './scenes/ExodusScene.js'
import UIOverlayScene from './scenes/UIOverlayScene.js'
import BriefingScene from './scenes/BriefingScene.js'
import TouchScene from './scenes/TouchScene.js'
import { LEVELS } from './config/levels.js'
import { BRIEFINGS } from './config/briefings.js'
import { unlockAllLevels, resetBriefings } from './systems/progress.js'
import { initTuningPanel } from './debug/tuningPanel.js'

export const GAME_WIDTH = 480
export const GAME_HEIGHT = 270

// Largest zoom that fits the window.
//
// DESIGN §5 locks integer scaling, and on desktop that still holds
// absolutely. TOUCH DEVICES are the amended exception (2026-08-30): no
// phone fits ×2 (480×270 needs 960×540, and even an iPhone landscape is
// 844×390), so integer-only would leave the game a small island in the
// middle of the screen with dead margins on every side. Fractional zoom
// there is the honest trade — uneven pixel sizes on a display nobody is
// pixel-peeping, in exchange for a game that fills the phone.
function bestZoom() {
  const fit = Math.min(window.innerWidth / GAME_WIDTH, window.innerHeight / GAME_HEIGHT)
  if (isTouchDevice()) return Math.max(0.5, fit)
  return Math.max(1, Math.floor(fit))
}

const game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game',
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  pixelArt: true,
  roundPixels: true,
  backgroundColor: '#101018',
  // controller support (DESIGN §2.2, amended 2026-08-28). Phaser's
  // gamepad plugin is opt-in; systems/gamepad.js owns everything above
  // this flag. No new dependency — this is engine-native.
  input: { gamepad: true },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: TUNING.gravity },
      // Step physics once per rendered frame. The default fixed 60Hz
      // accumulator beats against the display clock — during drift
      // episodes some rendered frames get 0 steps and others 2, which
      // reads as intermittent jitter/ghosting on ANY refresh rate.
      fixedStep: false,
    },
  },
  fps: {
    // clamp hitch deltas to 25ms so a single variable physics step can
    // never move a terminal-velocity fall further than TILE_BIAS (16px)
    // — thin platforms stay tunnel-proof
    min: 40,
  },
  scale: {
    mode: Phaser.Scale.NONE,
    zoom: bestZoom(),
  },
  scene: [BootScene, TitleScene, LevelSelectScene, LevelScene, GarageScene, MuseumScene, ExodusScene, UIOverlayScene, BriefingScene, TouchScene],
})

// resize AND orientationchange: a phone rotated in play changes both
// dimensions at once and only fires resize on some browsers
const rezoom = () => game.scale.setZoom(bestZoom())
window.addEventListener('resize', rezoom)
window.addEventListener('orientationchange', () => setTimeout(rezoom, 100))

initDeviceInput(game)

// On-screen controls, only where there is a touchscreen to need them.
// Launched last so it draws above every other scene, and never stopped —
// it swaps its own layout between menus and play.
if (isTouchDevice()) game.events.once('ready', () => game.scene.start('Touch'))

// dev-only handles for debugging/verification tooling
if (import.meta.env.DEV) {
  window.__game = game
  // Console helpers, because the two things a developer needs most from
  // localStorage — every level open, and a briefing shown again — are
  // otherwise a page of hand-written JSON.
  window.__dev = {
    // What the connected controllers actually report — id, mapping,
    // which button indices are down, and every axis. Hold a direction
    // and call this: if the d-pad shows up as an axis rather than
    // buttons 12-15, that is the pad's mapping, not a binding bug.
    pad: () => padReport(),
    // open every level (progression-driven: this records the clear each
    // one requires, with a score of 0 so it reads as a dev unlock)
    unlockAll() {
      const ids = unlockAllLevels(LEVELS.map((l) => l.id))
      console.info(`unlocked: ${ids.join(', ')} — reload or return to Shift Select`)
      return ids
    },
    // show every briefing again on its next visit
    resetBriefings() {
      resetBriefings()
      console.info('briefings reset — each level will explain itself again')
    },
    // preview any briefing RIGHT NOW, from any scene, without entering
    // its level: the fastest loop while editing the copy
    briefing(levelId) {
      const known = Object.keys(BRIEFINGS)
      if (!known.includes(levelId)) {
        console.warn(`no briefing for "${levelId}". Try: ${known.join(', ')}`)
        return
      }
      if (game.scene.isActive('Briefing')) game.scene.stop('Briefing')
      // launch, not start: an overlay over whatever is on screen. The
      // scene itself pauses what is underneath (no levelKey = preview).
      game.scene.getScenes(true)[0]?.scene.launch('Briefing', { levelId })
      return levelId
    },
    progress: () => JSON.parse(localStorage.getItem('chexys-big-day-progress-v1') || '{}'),
    wipe() {
      localStorage.removeItem('chexys-big-day-progress-v1')
      console.info('progress wiped — reload for a first-time player')
    },
  }
}

initTuningPanel()
