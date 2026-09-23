import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

// Project Pages: https://jjmbrooks.github.io/astropark-physics/
// base MUST stay '/astropark-physics/' so assets resolve on GitHub Pages.
export default defineConfig({
  base: '/astropark-physics/',
  plugins: [tailwindcss()],
});
