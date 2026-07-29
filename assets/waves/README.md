# assets/waves/ — wave schedule files

Each level's `waveFile` map property names a JSON file here; register
new files in `src/config/waveRegistry.js` (ESM import, Vite-bundled).
`WaveRunner` (src/systems/WaveRunner.js) plays the schedule back —
**editing the JSON changes the level with no code changes.**

## Schema

```json
{
  "entries": [
    { "time": 9.5, "type": "items", "spawnPoint": "any",
      "itemCategory": "coat", "weightTier": 1,
      "count": 3, "interval": 0.35 },
    { "time": 10, "type": "enemy", "count": 1, "interval": 0.6 }
  ]
}
```

| Field | Meaning |
|-------|---------|
| `time` | Seconds from rush start. The timeline is fixed; sort not required but keep files readable. |
| `type` | `"items"` (default) or `"enemy"` |
| `spawnPoint` | A named point from the map's `spawns` layer, or `"any"` for a random one |
| `itemCategory` | Key in `src/config/itemCategories.js` — drives the ChexApp tag color tint |
| `weightTier` | `1` = standard (instant tap), `3` = heavy (charged hold). Coatroom uses tier 1 only — weight tiers debut in Level 2 (DESIGN.md §3.2). |
| `count` | Spawns fired by this entry |
| `interval` | Seconds between spawns within the entry |

## Adaptive modulation (DESIGN.md §2.5)

Entry `time`s never move. Within an entry, adaptive intensity scales
`count` (rounded, min 1) and divides `interval`, inside the clamped
band. Item spawns also respect `TUNING.maxItemsOnField` — over-cap
spawns are skipped, which is the schedule's pressure-release valve.
