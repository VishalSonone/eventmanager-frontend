// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://eventmanager-backend-1-5121.onrender.com', // Spring Boot backend
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
