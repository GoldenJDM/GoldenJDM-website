import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    include: ['tests/**/*.test.js'],
    coverage: {
      provider: 'v8',
      include: ['en/js/**/*.js', 'fa/js/**/*.js'],
      reporter: ['text', 'html'],
    },
  },
});
