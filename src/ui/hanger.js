// Golden Hanger icon (BRIEF-ART-03 §3): the real 12×12 three-state
// spritesheet (golden / tarnished / broken) when assets/sprites/
// hanger.png exists; the placeholder glyph otherwise. One API for the
// HUD row (scale 1), results ceremony (scale 2), and level select.
const FRAME = { golden: 0, tarnished: 1, broken: 2 }

export function createHanger(scene, x, y, scale = 1) {
  if (scene.textures.exists('hanger')) {
    const img = scene.add.image(x, y, 'hanger', 0).setOrigin(0, 0).setScale(scale)
    return {
      obj: img,
      setState(state) {
        img.setFrame(FRAME[state] ?? 0)
        return this
      },
      setPosition(nx, ny) {
        img.setPosition(nx, ny)
        return this
      },
      setVisible(v) {
        img.setVisible(v)
        return this
      },
    }
  }

  // placeholder glyph fallback (pre-art grey-box look)
  const g = scene.add.graphics()
  let pos = { x, y }
  let cur = 'golden'
  const draw = () => {
    g.clear()
    const s = scale
    const color = cur === 'golden' ? 0xf3b024 : 0x59595b
    const alpha = cur === 'golden' ? 1 : cur === 'tarnished' ? 0.6 : 0.7
    g.lineStyle(Math.max(1, Math.round(s)), color, alpha)
    g.lineBetween(pos.x + 6 * s, pos.y, pos.x + 6 * s, pos.y + 3 * s)
    g.strokeTriangle(pos.x, pos.y + 10 * s, pos.x + 12 * s, pos.y + 10 * s, pos.x + 6 * s, pos.y + 3 * s)
    if (cur === 'broken') {
      g.lineStyle(1, 0xea5151, 0.9)
      g.lineBetween(pos.x + 2 * s, pos.y + 11 * s, pos.x + 10 * s, pos.y + 1 * s)
    }
  }
  draw()
  return {
    obj: g,
    setState(state) {
      cur = state
      draw()
      return this
    },
    setPosition(nx, ny) {
      pos = { x: nx, y: ny }
      draw()
      return this
    },
    setVisible(v) {
      g.setVisible(v)
      return this
    },
  }
}
