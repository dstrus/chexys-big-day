import { defineConfig } from 'vite'

// base './' so the built dist/ works from a subpath (GitHub Pages, itch.io)
export default defineConfig({
  base: './',
  // Bind 0.0.0.0 so `npm run dev` is reachable from a phone on the same
  // network — the only way to playtest the touch controls, since an
  // emulated handset says nothing about thumbs (2026-08-30). Note this
  // exposes the dev server to the whole LAN; it affects dev only, never
  // the built dist/.
  server: { host: true },
})
