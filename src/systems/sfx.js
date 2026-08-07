// Placeholder jsfxr-style SFX, synthesized with the Web Audio API so the
// grey-box ships zero audio assets and zero dependencies. Play through
// systems/AudioBus.js — it prefers dropped-in files and falls back here.
// playSfx(name, pan) pans -1 (hard left) .. 1 (hard right) so world events
// off to the side of the player read directionally in stereo.

import { TUNING } from '../config/tuning.js'

let ctx = null

// Must be called from a user gesture (browsers block audio before one).
export function unlockAudio() {
  if (!ctx) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext
    if (AudioCtx) ctx = new AudioCtx()
  }
  if (ctx && ctx.state === 'suspended') ctx.resume()
}

export function getAudioContext() {
  return ctx
}

function sfxGain() {
  const v = TUNING.masterVolume * TUNING.sfxVolume
  return Math.max(0, Math.min(1, v))
}

function tone({ type = 'square', from = 880, to = from, dur = 0.08, vol = 0.14, delay = 0, pan = 0 }) {
  if (!ctx) return
  const t0 = ctx.currentTime + delay
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(from, t0)
  osc.frequency.exponentialRampToValueAtTime(Math.max(1, to), t0 + dur)
  const v = Math.max(0.001, vol * sfxGain())
  gain.gain.setValueAtTime(v, t0)
  gain.gain.exponentialRampToValueAtTime(0.001, t0 + dur)
  osc.connect(gain)
  if (ctx.createStereoPanner && pan !== 0) {
    const panner = ctx.createStereoPanner()
    panner.pan.setValueAtTime(Math.max(-1, Math.min(1, pan)), t0)
    gain.connect(panner)
    panner.connect(ctx.destination)
  } else {
    gain.connect(ctx.destination)
  }
  osc.start(t0)
  osc.stop(t0 + dur + 0.02)
}

const SFX = {
  // punchy tap-tag blip
  tag: (pan) => {
    tone({ from: 700, to: 1400, dur: 0.06, pan })
    tone({ type: 'triangle', from: 1400, to: 2100, dur: 0.05, delay: 0.03, vol: 0.09, pan })
  },
  holdStart: (pan) => tone({ type: 'triangle', from: 220, to: 330, dur: 0.1, vol: 0.08, pan }),
  heavyTag: (pan) => {
    tone({ from: 330, to: 660, dur: 0.09, pan })
    tone({ from: 660, to: 1320, dur: 0.12, delay: 0.06, pan })
  },
  interrupt: (pan) => tone({ type: 'sawtooth', from: 420, to: 120, dur: 0.14, vol: 0.11, pan }),
  steal: (pan) => tone({ type: 'square', from: 240, to: 90, dur: 0.18, vol: 0.11, pan }),
  // nasal taunt for the gloat beat — the carrier showing off its catch
  gloat: (pan) => {
    tone({ type: 'square', from: 240, to: 90, dur: 0.14, vol: 0.11, pan })
    tone({ type: 'square', from: 620, to: 520, dur: 0.09, delay: 0.12, vol: 0.09, pan })
    tone({ type: 'square', from: 520, to: 760, dur: 0.12, delay: 0.22, vol: 0.09, pan })
  },
  lose: (pan) => {
    tone({ type: 'square', from: 200, to: 100, dur: 0.15, vol: 0.12, pan })
    tone({ type: 'square', from: 100, to: 60, dur: 0.2, delay: 0.12, vol: 0.12, pan })
  },
  // soft directional cue when a new item drops in
  spawn: (pan) => tone({ type: 'triangle', from: 480, to: 640, dur: 0.09, vol: 0.06, pan }),
  // paper crumple: tagging a carrying ticket stuns it and frees the item
  stun: (pan) => {
    tone({ type: 'sawtooth', from: 900, to: 200, dur: 0.08, vol: 0.12, pan })
    tone({ type: 'square', from: 500, to: 700, dur: 0.07, delay: 0.06, vol: 0.1, pan })
  },
  // bright ding for each Golden Hanger filling on the results screen
  chime: (pan) => {
    tone({ type: 'triangle', from: 880, to: 1320, dur: 0.12, vol: 0.12, pan })
    tone({ type: 'triangle', from: 1760, dur: 0.08, delay: 0.05, vol: 0.06, pan })
  },
  // rubber-stamp slam for the BIG DAY! celebration
  stamp: (pan) => {
    tone({ type: 'square', from: 130, to: 60, dur: 0.12, vol: 0.16, pan })
    tone({ type: 'sawtooth', from: 90, to: 45, dur: 0.16, delay: 0.03, vol: 0.1, pan })
  },
  heatUp: (pan) => {
    tone({ from: 523, dur: 0.06, vol: 0.08, pan })
    tone({ from: 659, dur: 0.06, delay: 0.06, vol: 0.08, pan })
    tone({ from: 784, dur: 0.09, delay: 0.12, vol: 0.08, pan })
  },
  runFail: (pan) => {
    tone({ type: 'sawtooth', from: 300, to: 150, dur: 0.25, vol: 0.11, pan })
    tone({ type: 'sawtooth', from: 150, to: 75, dur: 0.35, delay: 0.2, vol: 0.11, pan })
  },
  runClear: (pan) => {
    tone({ from: 523, dur: 0.08, vol: 0.1, pan })
    tone({ from: 659, dur: 0.08, delay: 0.08, vol: 0.1, pan })
    tone({ from: 784, dur: 0.08, delay: 0.16, vol: 0.1, pan })
    tone({ from: 1047, dur: 0.18, delay: 0.24, vol: 0.1, pan })
  },
  // adaptive intensity easing off — the multiplier dipped
  multiplierDown: (pan) => {
    tone({ from: 659, to: 620, dur: 0.07, vol: 0.07, pan })
    tone({ from: 523, to: 490, dur: 0.1, delay: 0.07, vol: 0.07, pan })
  },
  // the rush begins
  rushStart: (pan) => {
    tone({ from: 392, dur: 0.07, vol: 0.1, pan })
    tone({ from: 523, dur: 0.07, delay: 0.07, vol: 0.1, pan })
    tone({ from: 659, dur: 0.07, delay: 0.14, vol: 0.1, pan })
    tone({ from: 784, dur: 0.16, delay: 0.21, vol: 0.11, pan })
  },
  uiSelect: (pan) => tone({ type: 'triangle', from: 880, to: 1100, dur: 0.05, vol: 0.09, pan }),
  // collectibles (BRIEF-04 §4; placeholder synths)
  tagPickup: (pan) => tone({ type: 'triangle', from: 1200, to: 1800, dur: 0.05, vol: 0.08, pan }),
  cardPickup: (pan) => {
    tone({ type: 'triangle', from: 700, to: 1050, dur: 0.07, vol: 0.09, pan })
    tone({ type: 'triangle', from: 1050, to: 1400, dur: 0.07, delay: 0.06, vol: 0.08, pan })
  },
  cardReturn: (pan) => {
    tone({ from: 784, dur: 0.06, vol: 0.08, pan })
    tone({ from: 1047, dur: 0.1, delay: 0.06, vol: 0.08, pan })
  },
  // pickup fanfare for the Insights Report
  insightPickup: (pan) => {
    tone({ from: 523, dur: 0.06, vol: 0.09, pan })
    tone({ from: 659, dur: 0.06, delay: 0.05, vol: 0.09, pan })
    tone({ from: 784, dur: 0.06, delay: 0.1, vol: 0.09, pan })
    tone({ from: 1047, dur: 0.14, delay: 0.15, vol: 0.1, pan })
  },
  insightEnd: (pan) => tone({ from: 784, to: 523, dur: 0.12, vol: 0.07, pan }),
}

// unknown events must be LOUD in dev (handoff 2026-08-07-c) — a silent
// no-op here hides absence bugs; same tripwire philosophy as the
// jitter probe and the de-embed gate. Once per name per session.
const warnedEvents = new Set()

export function playSfx(name, pan = 0) {
  const fx = SFX[name]
  if (fx) {
    fx(pan)
    return
  }
  if (!warnedEvents.has(name)) {
    warnedEvents.add(name)
    console.warn(
      `No audio for event "${name}" — no file in assets/audio/ and no ` +
        'synth placeholder in systems/sfx.js.'
    )
  }
}

// Generated 4-bar chiptune stub — the music placeholder until a real
// loop lands in assets/audio/music/. Returns { setVolume, stop }.
export function startMusicStub() {
  unlockAudio()
  if (!ctx) return null

  const bus = ctx.createGain()
  bus.gain.value = 0.5
  bus.connect(ctx.destination)

  const BPM = 118
  const beat = 60 / BPM
  const bar = beat * 4
  const BASS = [36, 43, 45, 41] // C2 G2 A2 F2 — one root per bar
  const MELODY = [
    [60, 63, 67, 63, 60, 63, 67, 70],
    [59, 62, 67, 62, 59, 62, 67, 62],
    [57, 60, 64, 60, 57, 60, 64, 69],
    [57, 60, 65, 60, 57, 60, 65, 60],
  ]
  const freq = (n) => 440 * Math.pow(2, (n - 69) / 12)
  const note = (type, midi, t, dur, vol) => {
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    o.type = type
    o.frequency.setValueAtTime(freq(midi), t)
    g.gain.setValueAtTime(vol, t)
    g.gain.exponentialRampToValueAtTime(0.001, t + dur)
    o.connect(g)
    g.connect(bus)
    o.start(t)
    o.stop(t + dur + 0.02)
  }

  let running = true
  let timer = null
  let barIndex = 0
  let nextBarTime = ctx.currentTime + 0.1
  const scheduleBar = () => {
    if (!running) return
    const t0 = nextBarTime
    const b = barIndex % 4
    for (let i = 0; i < 8; i++) {
      const t = t0 + i * (beat / 2)
      if (i % 2 === 0) note('square', BASS[b], t, beat * 0.45, 0.055)
      note('triangle', MELODY[b][i], t, beat * 0.4, 0.045)
    }
    barIndex += 1
    nextBarTime = t0 + bar
    timer = setTimeout(scheduleBar, (nextBarTime - ctx.currentTime - 0.25) * 1000)
  }
  scheduleBar()

  return {
    setVolume(v) {
      bus.gain.setTargetAtTime(Math.max(0.0001, v * 0.9), ctx.currentTime, 0.1)
    },
    stop() {
      running = false
      clearTimeout(timer)
      bus.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.05)
      setTimeout(() => bus.disconnect(), 500)
    },
  }
}
