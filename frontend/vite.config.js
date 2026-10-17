import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// The preview environment exposes a single port (the Vite dev server),
// so all API and realtime traffic is proxied to the Express backend.
const backend = process.env.BACKEND_URL || 'http://localhost:3001';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: ['.monkeycode-ai.live'],
    proxy: {
      '/api': {
        target: backend,
        changeOrigin: true
      },
      '/socket.io': {
        target: backend,
        changeOrigin: true,
        ws: true
      }
    }
  }
});
