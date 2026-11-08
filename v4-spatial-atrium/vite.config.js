import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Normalize Windows drive-letter casing (C:\ vs c:\) to prevent `/@fs/` HMR cache mismatch
const ROOT_DIR = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: ROOT_DIR,
  plugins: [react()],
  server: {
    port: 5188,
    strictPort: true,
    host: true,
    watch: {
      usePolling: true,
      interval: 400,
    },
  },
  preview: {
    port: 5188,
    strictPort: true,
    host: true,
  },
  build: {
    target: 'es2020',
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks: {
          'three-core': ['three'],
          'r3f-stack': ['@react-three/fiber', '@react-three/drei'],
        },
      },
    },
  },
});
