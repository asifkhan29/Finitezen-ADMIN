import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import tsconfigPaths from 'vite-tsconfig-paths'; // 1. Import this

export default defineConfig({
  plugins: [
    react(), 
    tailwindcss(),
    tsconfigPaths() // 2. Add this as a plugin
  ],
});