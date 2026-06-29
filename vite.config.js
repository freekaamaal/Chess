import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Dev server is exposed on all interfaces so the app can be opened from a
// tablet on the same network (handy for letting your daughter try it live).
export default defineConfig({
  plugins: [react()],
  server: { host: true, port: 5173 },
})
