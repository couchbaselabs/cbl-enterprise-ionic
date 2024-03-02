import legacy from '@vitejs/plugin-legacy'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer';
import gzipPlugin from 'rollup-plugin-gzip';
import brotliPlugin from 'rollup-plugin-brotli';
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    legacy(),
    gzipPlugin(),
    brotliPlugin(),
    visualizer({ open: true, gzipSize: true, brotliSize: true }),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  }
})
