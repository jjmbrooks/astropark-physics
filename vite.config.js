import { defineConfig } from 'vite';

// Project Pages: https://jjmbrooks.github.io/astropark-physics/
// base MUST stay '/astropark-physics/' so assets resolve on GitHub Pages.
// For a custom domain or user/org site later, change this and update docs/05-DECISIONES.md.
export default defineConfig({
  base: '/astropark-physics/',
});
