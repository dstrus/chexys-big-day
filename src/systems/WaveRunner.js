// Plays back a wave schedule (assets/waves/*.json — schema in that
// directory's README). Entry times form a fixed timeline; adaptive
// intensity (DESIGN.md §2.5) modulates counts and within-entry spawn
// intervals inside the clamped band. Field caps (maxItemsOnField) are
// enforced by the scene's spawn callback, not here.
export default class WaveRunner {
  constructor(scene, schedule, { spawnItem, spawnEnemy }) {
    this.scene = scene
    this.entries = [...schedule.entries].sort((a, b) => a.time - b.time)
    this.spawnItem = spawnItem
    this.spawnEnemy = spawnEnemy
    this.elapsed = 0
    this.cursor = 0
  }

  update(deltaMs, intensity) {
    this.elapsed += deltaMs / 1000
    while (this.cursor < this.entries.length && this.entries[this.cursor].time <= this.elapsed) {
      this.fire(this.entries[this.cursor], intensity)
      this.cursor += 1
    }
  }

  fire(entry, intensity) {
    const count = Math.max(1, Math.round((entry.count ?? 1) * intensity))
    const intervalMs = ((entry.interval ?? 0) * 1000) / intensity
    for (let i = 0; i < count; i++) {
      const spawn =
        entry.type === 'enemy'
          ? () => this.spawnEnemy()
          : () =>
              this.spawnItem(
                entry.spawnPoint ?? 'any',
                entry.itemCategory ?? 'coat',
                entry.weightTier ?? 1
              )
      if (i === 0) spawn()
      else this.scene.time.delayedCall(i * intervalMs, spawn)
    }
  }
}
