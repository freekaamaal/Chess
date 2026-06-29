import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Dev server is exposed on all interfaces so the app can be opened from a
// tablet on the same network (handy for letting your daughter try it live).
//
// For the production build we set base to '/Chess/' so it works when served
// from GitHub Pages at https://<user>.github.io/Chess/. Local dev stays at '/'.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/Chess/' : '/',
  plugins: [react()],
  server: { host: true, port: 5173 },
}))
