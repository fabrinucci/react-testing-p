import { defineConfig } from 'vite';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/setupTest.ts'],
    coverage: {
      exclude: [
        '**/*.config.ts',
        '**/*.config.js',
        '**/*.types.ts',
        '**/*.d.ts',
        '**/types',
        '**/App.tsx',
        '**/main.tsx',
        '**/getAuth.ts',
        '**/getUsers.ts',
      ],
      thresholds: {
        functions: 80,
      },
    },
  },
});
