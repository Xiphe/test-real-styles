/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'happy-dom',
    testTimeout: 15000,
    exclude: [
      '**/coverage/**',
      '**/dist/**',
      '**/node_modules/**',
      '**/.{idea,git,cache,output,temp}/**',
    ],
  },
});
