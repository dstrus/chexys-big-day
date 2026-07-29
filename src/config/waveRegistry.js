import coatroomWaves from '../../assets/waves/coatroom-waves.json'

// waveFile map property → schedule data. ESM imports so Vite bundles
// the JSON (and hot-reloads the level when a wave file is edited).
const REGISTRY = {
  'coatroom-waves.json': coatroomWaves,
}

export function getWaveSchedule(file) {
  const schedule = REGISTRY[file]
  if (!schedule) {
    throw new Error(`Unknown waveFile "${file}" — register it in src/config/waveRegistry.js`)
  }
  return schedule
}
