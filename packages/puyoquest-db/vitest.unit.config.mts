import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['./src/**/*.unit.spec.ts'],
    watch: false,
  },
});
