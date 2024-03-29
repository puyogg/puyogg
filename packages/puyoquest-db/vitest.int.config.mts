import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['./src/**/*.int.spec.ts'],
    watch: false,
    globalSetup: ['./src/test-utils/global-setup.ts'],
    setupFiles: ['./src/test-utils/test-setup.ts'],
  },
});
