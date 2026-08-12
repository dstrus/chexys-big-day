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
  // optional stage-glow overlay (BRIEF-ART-02 §3): additive, alpha-pulsed
  if (urlFor(levelId, 'glow')) {
    const glow = scene.add
      .image(0, 0, `parallax-${levelId}-glow`)
      .setOrigin(0, 0)
      .setScrollFactor(0)
      .setDepth(-8.5)
      .setBlendMode(1) // ADD
    layers.push({ sprite: glow, name: 'glow', factor: 0, depth: -8.5, isGlow: true })
  }
  return layers
}

// stage-glow pulse range (human note 2026-08-12: deeper low end — the
// dip should read as the glow breathing out, not just dimming)
const GLOW_MIN = 0.3
const GLOW_MAX = 1.0

// per frame: scroll offsets + the §3 autonomous motion (crowd sway on
// p3, glow pulse) — cheap sines, no art needed
export function updateParallax(layers, cam, time) {
  for (const l of layers) {
    if (l.isGlow) {
      const mid = (GLOW_MAX + GLOW_MIN) / 2
      const amp = (GLOW_MAX - GLOW_MIN) / 2
      l.sprite.setAlpha(mid + amp * Math.sin(time / 900))
      continue
    }
    let x = cam.scrollX * l.factor
    if (l.name === 'p3') x += Math.sin(time / 2400) // crowd sway, ±1px
    l.sprite.tilePositionX = x
  }
}
