#!/usr/bin/env node
// Palette-swap variants for indexed PNGs (BRIEF-ART-04 §1: "draw once
// per tier, swap script"). Rewrites ONLY the PLTE chunk — pixel indices
// are untouched, so this can never disturb the drawing itself, and it
// needs no image library.
//
//   node scripts/palette-variants.mjs assets/sprites/car-sedan.png
//
// Writes assets/sprites/car-sedan-<hue>.png for every garment hue in the
// table below, swapping the drawn body pair (base + shade) for that
// hue's pair. The source pair is whichever garment pair the PNG's own
// palette uses for the body — declared by SOURCE_HUE (the artist draws
// in cobalt per art/garage-inventory.md §(c)).
import { readFileSync, writeFileSync } from 'node:fs'
import { crc32 } from 'node:zlib'
import { basename, dirname, join } from 'node:path'

// actors.gpl garment family — [base, shade] as [r,g,b] pairs
const HUES = {
  crimson: [[194, 47, 58], [142, 31, 44]],
  cobalt: [[46, 111, 208], [30, 76, 150]],
  olive: [[122, 140, 46], [85, 98, 28]],
  mustard: [[217, 166, 43], [163, 120, 26]],
  burgundy: [[131, 50, 63], [92, 31, 43]],
  winterteal: [[63, 160, 140], [43, 114, 99]],
}
const SOURCE_HUE = 'cobalt'

const src = process.argv[2]
if (!src) {
  console.error('usage: palette-variants.mjs <indexed.png>')
  process.exit(1)
}

const png = readFileSync(src)
if (png.readUInt32BE(0) !== 0x89504e47) throw new Error(`${src}: not a PNG`)

// walk chunks: find PLTE (and confirm the file is palette-indexed)
let pos = 8
let plteAt = -1
let plteLen = 0
let colorType = -1
while (pos < png.length) {
  const len = png.readUInt32BE(pos)
  const type = png.toString('ascii', pos + 4, pos + 8)
  if (type === 'IHDR') colorType = png[pos + 8 + 9]
  if (type === 'PLTE') {
    plteAt = pos + 8
    plteLen = len
  }
  pos += 12 + len
}
if (colorType !== 3) {
  throw new Error(`${src}: color type ${colorType} — export as INDEXED for palette swaps`)
}
if (plteAt < 0) throw new Error(`${src}: no PLTE chunk`)

// locate the drawn body pair inside the palette
const [srcBase, srcShade] = HUES[SOURCE_HUE]
const findIndex = ([r, g, b]) => {
  for (let i = 0; i < plteLen / 3; i++) {
    const o = plteAt + i * 3
    if (png[o] === r && png[o + 1] === g && png[o + 2] === b) return i
  }
  return -1
}
const baseIdx = findIndex(srcBase)
const shadeIdx = findIndex(srcShade)
if (baseIdx < 0 || shadeIdx < 0) {
  throw new Error(
    `${src}: the ${SOURCE_HUE} body pair (${srcBase} / ${srcShade}) is not in this palette — ` +
      `draw the body with those exact values (art/garage-inventory.md §(c))`
  )
}

const dir = dirname(src)
const stem = basename(src, '.png')
let written = 0
for (const [hue, [base, shade]] of Object.entries(HUES)) {
  const out = Buffer.from(png) // copy; only 6 palette bytes will differ
  for (const [idx, rgb] of [
    [baseIdx, base],
    [shadeIdx, shade],
  ]) {
    const o = plteAt + idx * 3
    out[o] = rgb[0]
    out[o + 1] = rgb[1]
    out[o + 2] = rgb[2]
  }
  // PLTE changed: re-CRC that chunk (length/type unchanged)
  const chunk = out.subarray(plteAt - 4, plteAt + plteLen) // type + data
  out.writeUInt32BE(crc32(chunk) >>> 0, plteAt + plteLen)
  const path = join(dir, `${stem}-${hue}.png`)
  writeFileSync(path, out)
  written++
}
console.log(
  `${basename(src)}: wrote ${written} palette variants ` +
    `(body indices ${baseIdx}/${shadeIdx} → ${Object.keys(HUES).join(', ')})`
)
