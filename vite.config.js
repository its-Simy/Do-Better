import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '127.0.0.1',
    port: 5173,
    // The API is a separate FastAPI process on :8000. Proxying /api through the
    // dev server keeps frontend requests same-origin, so the browser never runs
    // a CORS check against the backend.
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  // Pin PostCSS to this project so Vite doesn't walk up and pick up an
  // unrelated postcss config from a parent directory.
  css: { postcss: {} },
});
