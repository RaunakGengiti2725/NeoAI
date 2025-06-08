import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  root: '.',
  publicDir: 'public',
  server: {
    proxy: {
      '/analyze-voice': 'http://localhost:5000',
      '/analyze-face': 'http://localhost:5000',
      '/analyze-text': 'http://localhost:5000',
      '/evaluate-risk': 'http://localhost:5000'
    }
  }
});
