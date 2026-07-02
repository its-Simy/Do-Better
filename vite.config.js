import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '127.0.0.1',
    port: 5173,
  },
  // Pin PostCSS to this project so Vite doesn't walk up and pick up an
  // unrelated postcss config from a parent directory.
  css: { postcss: {} },
});
