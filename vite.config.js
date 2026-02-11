import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const rootDir = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        index: resolve(rootDir, 'index.html'),
        bit: resolve(rootDir, 'pages/bit.html'),
        qubit: resolve(rootDir, 'pages/qubit.html'),
        gatesClassic: resolve(rootDir, 'pages/gates-classic.html'),
        gatesQuantum: resolve(rootDir, 'pages/gates-quantum.html'),
        supremacy: resolve(rootDir, 'pages/supremacy.html'),
        deutschJozsa: resolve(rootDir, 'pages/deutsch-jozsa.html'),
        willow: resolve(rootDir, 'pages/willow.html'),
        faq: resolve(rootDir, 'pages/faq.html'),
        sources: resolve(rootDir, 'pages/sources.html'),
      },
    },
  },
});
