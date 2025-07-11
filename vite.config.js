import { defineConfig } from 'vite';

export default defineConfig(({ command }) => ({
  base: command === 'dev' ? '/' : '/editeur-carto/',
}));