// Parallax drop-in (BRIEF-ART-02 §2/§4 — the agent's wiring pass).
// Same contract as sprites and audio: drop a file in and it wins;
// delete it and the layer simply doesn't exist. Missing layers are
// skipped — a partial stack (P4 alone) is fine.
//
// Files: assets/parallax/<levelId>/p1.png … p4.png (+ optional
// glow.png). Layer table per BRIEF-ART-02 §2, far to near:
//   p4 480×270  scrollFactor 0.05 (venue back wall)
//   p3 960×270  scrollFactor 0.2  (crowd mass; repeat-x; ±1px sway)
//   p2 1280×270 scrollFactor 0.45 (mid architecture; repeat-x)
//   p1 1600×270 scrollFactor 0.7  (near dressing; repeat-x)
// The tile map's own bg2/bg1 layers (depth -4/-3) render IN FRONT of
// the whole painted stack (depths -9..-6).

import { TUNING } from '../config/tuning.js'
import { isTuningPanelOpen, setPanelReadout } from '../debug/tuningPanel.js'

const PARALLAX_URLS = import.meta.glob('../../assets/parallax/*/*.png', {
  eager: true,
  query: '?url',
  import: 'default',
})

export const PARALLAX_LAYERS = [
  { name: 'p4', factor: 0.05, depth: -9 },
  { name: 'p3', factor: 0.2, depth: -8 },
  { name: 'p2', factor: 0.45, depth: -7 },
  { name: 'p1', factor: 0.7, depth: -6 },
]

function urlFor(levelId, name) {
  const suffix = `/assets/parallax/${levelId}/${name}.png`
  for (const [path, url] of Object.entries(PARALLAX_URLS)) {
    if (path.endsWith(suffix)) return url
  }
  return null
}

// Boot: queue every discovered painting (all levels, one pass)
export function preloadParallax(scene) {
  for (const [path, url] of Object.entries(PARALLAX_URLS)) {
    const m = path.match(/\/parallax\/([^/]+)\/([^/]+)\.png$/)
    if (m) scene.load.image(`parallax-${m[1]}-${m[2]}`, url)
  }
}

// Level create: build whatever stack exists for this level
export function createParallax(scene, levelId) {
  const layers = []
  const w = scene.scale.width
  const h = scene.scale.height
  for (const spec of PARALLAX_LAYERS) {
    if (!urlFor(levelId, spec.name)) continue
    const sprite = scene.add
      .tileSprite(0, 0, w, h, `parallax-${levelId}-${spec.name}`)
      .setOrigin(0, 0)
      .setScrollFactor(0)
      .setDepth(spec.depth)
    layers.push({ sprite, ...spec })
  }
  // optional glow overlay (BRIEF-ART-02 §3): additive, alpha-pulsed.
  // TWO SHAPES, chosen by the canvas the artist draws on — no flag:
  //
  //   exactly one screen wide (480) -> a screen-fixed WASH, behind p3 at
  //     depth -8.5. The Coatroom's stage glow: diffuse, sourceless, and
  //     it should not slide when the camera moves.
  //   wider than one screen        -> a P3-ALIGNED overlay: it scrolls at
  //     p3's own factor and sits IN FRONT of p3 (depth -7.5). This is
  //     what a chandelier needs — the light belongs to an object in p3,
  //     so it has to travel with it and bloom over it, not behind it
  //     (ruling 2026-08-24; the old single shape did neither).
  if (urlFor(levelId, 'glow')) {
    const key = `parallax-${levelId}-glow`
    const src = scene.textures.get(key).getSourceImage()
    const tracksP3 = src.width > w
    const p3 = PARALLAX_LAYERS.find((l) => l.name === 'p3')
    const glow = tracksP3
      ? scene.add.tileSprite(0, 0, w, h, key)
      : scene.add.image(0, 0, key)
    glow
      .setOrigin(0, 0)
      .setScrollFactor(0)
      .setDepth(tracksP3 ? -7.5 : -8.5)
      .setBlendMode(1) // ADD
    layers.push({
      sprite: glow,
      name: 'glow',
      factor: tracksP3 ? p3.factor : 0,
      depth: tracksP3 ? -7.5 : -8.5,
      isGlow: true,
      tracksP3,
      pulse: pulseFor(levelId), // null = follow the panel
      levelId,
    })
  }
  return layers
}

// Pulse values live in TUNING so the panel can dial them live — the same
// treatment the fg lamp flicker has. The period is an explicit
// millisecond figure, replacing the old sin(time/400) divisor whose real
// period was 2513ms.
//
// PINNED LEVELS (2026-08-24). The TUNING values are the DEFAULT, not the
// law: a level listed here keeps its own pulse and ignores the sliders.
// The Coatroom was signed off under the original wide swell and should
// not inherit the Bell Desk's narrow one just because the chandelier
// wanted a sustained warmth. A level absent from this table follows the
// panel — which is what makes the sliders useful while dialling a NEW
// level.
const GLOW_PULSE = {
  coatroom: { min: 0.3, max: 1.0, periodMs: 2500 },
}

function pulseFor(levelId) {
  return GLOW_PULSE[levelId] ?? null
}

// per frame: scroll offsets + the §3 autonomous motion (crowd sway on
// p3, glow pulse) — cheap sines, no art needed
export function updateParallax(layers, cam, time) {
  for (const l of layers) {
    if (l.isGlow) {
      const p = l.pulse ?? { min: TUNING.glowMin, max: TUNING.glowMax, periodMs: TUNING.glowPeriodMs }
      const lo = Math.min(p.min, p.max)
      const hi = Math.max(p.min, p.max)
      const mid = (hi + lo) / 2
      const amp = (hi - lo) / 2
      l.sprite.setAlpha(mid + amp * Math.sin((time / p.periodMs) * Math.PI * 2))
      // say so, rather than letting a pinned level look like broken
      // sliders — the same class of bug as the music volume poll
      if (l.pulse && isTuningPanelOpen()) {
        setPanelReadout(
          `glow pulse: PINNED for ${l.levelId} (${lo.toFixed(2)}–${hi.toFixed(2)} @ ${p.periodMs}ms) — sliders ignored here`,
          true,
          3
        )
      }
      // a p3-aligned glow must travel with p3 — including the crowd
      // sway, or the bloom would drift off its own fixture by a pixel
      if (l.tracksP3) l.sprite.tilePositionX = cam.scrollX * l.factor + Math.sin(time / 2400)
      continue
    }
    let x = cam.scrollX * l.factor
    if (l.name === 'p3') x += Math.sin(time / 2400) // crowd sway, ±1px
    l.sprite.tilePositionX = x
  }
}
