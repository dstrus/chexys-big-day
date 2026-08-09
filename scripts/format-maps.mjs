#!/usr/bin/env node
// Normalize assets/maps/*.json for humans and git.
//
// Tiled and the game both accept any valid JSON, but these maps are
// frequently generated (Python/Node one-offs) or hand-tweaked, and
// minified JSON is unreadable and produces useless diffs. This rewrites
// each map with:
//   - 2-space indented structure
//   - tile-layer `data` emitted ONE MAP ROW PER LINE, so the array on
//     screen has the same shape as the level (hand-editable, and a
//     one-tile change is a one-line diff)
// Idempotent: run it after generating or after Tiled saves.
//
//   node scripts/format-maps.mjs [file...]     (default: assets/maps/*.json)

import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join, dirname, basename } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const mapsDir = join(root, 'assets', 'maps')

const files = process.argv.slice(2).length
  ? process.argv.slice(2)
  : readdirSync(mapsDir)
      .filter((f) => f.endsWith('.json'))
      .map((f) => join(mapsDir, f))

for (const file of files) {
  const map = JSON.parse(readFileSync(file, 'utf8'))

  // stash tile-layer data behind tokens so JSON.stringify can lay out
  // the structure, then substitute row-wrapped arrays back in
  const stashed = []
  for (const layer of map.layers ?? []) {
    if (layer.type === 'tilelayer' && Array.isArray(layer.data)) {
      stashed.push({ data: layer.data, width: layer.width ?? map.width })
      layer.data = `@@DATA_${stashed.length - 1}@@`
    }
  }

  let out = JSON.stringify(map, null, 2)

  out = out.replace(/^(\s*)"data": "@@DATA_(\d+)@@"/gm, (_, pad, idx) => {
    const { data, width } = stashed[Number(idx)]
    const cell = String(Math.max(...data, 0)).length
    const rows = []
    for (let r = 0; r * width < data.length; r++) {
      rows.push(
        pad + '  ' + data.slice(r * width, (r + 1) * width).map((v) => String(v).padStart(cell)).join(', ')
      )
    }
    return `${pad}"data": [\n${rows.join(',\n')}\n${pad}]`
  })

  writeFileSync(file, out + '\n')
  const rows = map.height ?? '?'
  console.log(`formatted ${basename(file)} (${map.width}x${rows})`)
}
