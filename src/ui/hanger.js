// Golden Hanger glyph (placeholder art) shared by the HUD row (s=1),
// the results ceremony (s=2), and the level-select bests.
export function drawHanger(g, x, y, s, color, alpha) {
  g.lineStyle(Math.max(1, Math.round(s)), color, alpha)
  g.lineBetween(x + 6 * s, y, x + 6 * s, y + 3 * s) // hook
  g.strokeTriangle(x, y + 10 * s, x + 12 * s, y + 10 * s, x + 6 * s, y + 3 * s)
}
