import { defineConfig } from 'vite'

// base './' so the built dist/ works from a subpath (GitHub Pages, itch.io)
export default defineConfig({
  base: './',
})
