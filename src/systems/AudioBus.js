import { playSfx, startMusicStub } from './sfx.js'
import { TUNING } from '../config/tuning.js'

// Central audio layer (BRIEF-02 Chunk 5). A named event resolves to:
//   1. a file dropped in assets/audio/<event>.(wav|mp3|ogg) — wins
//   2. the generated jsfxr-style synth placeholder (systems/sfx.js)
// Missing files are silently skipped (the synth covers every event), so
// pulling any audio file can never crash — the same drop-in contract as
// sprites. Event names + music conventions: assets/audio/README.md.

const AUDIO_URLS = import.meta.glob('../../assets/audio/*', {
  eager: true,
  query: '?url',
  import: 'default',
})
const MUSIC_URLS = import.meta.glob('../../assets/audio/music/*', {
  eager: true,
  query: '?url',
  import: 'default',
})

const AUDIO_EXT = /\.(wav|mp3|ogg)$/
// finer-grained game events fall back to a canonical file name
// (BRIEF-02's event list) when no exact-name file exists
const CANONICAL = {
  heavyTag: 'holdComplete',
  interrupt: 'holdInterrupt',
  lose: 'itemLost',
  heatUp: 'multiplierUp',
  runClear: 'rushEnd',
  runFail: 'rushEnd',
}

function fileMap(globbed) {
  const map = {}
  for (const [path, url] of Object.entries(globbed)) {
    const base = path.split('/').pop()
    if (!AUDIO_EXT.test(base)) continue
    map[base.replace(AUDIO_EXT, '')] = url
  }
  return map
}

const clamp01 = (v) => Math.max(0, Math.min(1, v))

class AudioBus {
  constructor() {
    this.files = fileMap(AUDIO_URLS)
    this.music = fileMap(MUSIC_URLS)
    this.game = null
    this.musicSound = null // file-based music (Phaser sound)
    this.stub = null // generated chiptune loop
    this.currentLevelId = null
    this.ducked = false
  }

  // Boot.preload: queue every discovered audio file
  preload(scene) {
    for (const [name, url] of Object.entries(this.files)) scene.load.audio(`audio-${name}`, url)
    for (const [name, url] of Object.entries(this.music)) scene.load.audio(`music-${name}`, url)
  }

  init(game) {
    this.game = game
  }

  play(name, pan = 0) {
    const fileKey = this.files[name] ? name : this.files[CANONICAL[name]] ? CANONICAL[name] : null
    if (fileKey && this.game?.cache.audio.exists(`audio-${fileKey}`)) {
      const snd = this.game.sound.add(`audio-${fileKey}`)
      if (typeof snd.setPan === 'function') snd.setPan(Math.max(-1, Math.min(1, pan)))
      snd.once('complete', () => snd.destroy())
      snd.play({ volume: clamp01(TUNING.masterVolume * TUNING.sfxVolume) })
      return
    }
    playSfx(name, pan) // generated placeholder
  }

  // ---- music: one looping track hook per level ----

  startMusic(levelId) {
    if (this.currentLevelId === levelId && (this.musicSound?.isPlaying || this.stub)) {
      this.restoreMusic() // retry of the same level: just un-duck
      return
    }
    this.stopMusic()
    this.currentLevelId = levelId
    if (this.music[levelId] && this.game?.cache.audio.exists(`music-${levelId}`)) {
      this.musicSound = this.game.sound.add(`music-${levelId}`, { loop: true })
      this.musicSound.play()
    } else {
      this.stub = startMusicStub()
    }
    this.refreshVolumes()
  }

  duckMusic() {
    this.ducked = true
    this.refreshVolumes()
  }

  restoreMusic() {
    this.ducked = false
    this.refreshVolumes()
  }

  stopMusic() {
    this.musicSound?.stop()
    this.musicSound?.destroy()
    this.musicSound = null
    this.stub?.stop()
    this.stub = null
    this.currentLevelId = null
    // stop returns the bus to menu state: a results-screen duck must
    // never leak into the next level's music (found during the -e
    // mid-rush-teardown verification — cross-level starts began ducked)
    this.ducked = false
  }

  // cheap; polled from UIOverlay.update so volume sliders apply live
  refreshVolumes() {
    const v = clamp01(TUNING.masterVolume * TUNING.musicVolume) * (this.ducked ? 0.3 : 1)
    if (this.musicSound) this.musicSound.setVolume(v)
    if (this.stub) this.stub.setVolume(v)
  }
}

export const audio = new AudioBus()
