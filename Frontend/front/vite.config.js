// vite.config.js

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path'; // <-- 1. Import the path module

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // 2. Map the @components alias to the correct folder path
      '@components': path.resolve(__dirname, 'src/componets'), 
      // Note: Use 'src/componets' to match the folder name you showed in the image,
      // even though it is spelled unconventionally (missing the 'n').
    },
  },
});