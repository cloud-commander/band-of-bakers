import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    // Test environment
    environment: "jsdom",
    globals: true,

    // Setup file
    setupFiles: ["./src/tests/setup.ts"],

    // Include patterns
    include: ["**/__tests__/**/*.{test,spec}.{ts,tsx}"],

    // Exclude patterns
    exclude: [
      "node_modules",
      "dist",
      ".next",
      "coverage",
      "**/*.config.{ts,js}",
    ],

    // Coverage configuration
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        "src/tests/",
        "**/*.d.ts",
        "**/*.config.*",
        "**/mockData",
        "dist/",
        ".next/",
        "src/lib/mocks/**", // Mock data not tested
        "scripts/**", // Seed scripts not tested
      ],
      // Coverage thresholds - Phase 9 targets
      thresholds: {
        lines: 60, // Start at 60%, increase to 80% by Phase 10
        functions: 60,
        branches: 50,
        statements: 60,
      },
    },

    // Test timeout
    testTimeout: 10000,
  },

  // Path resolution (match tsconfig.json paths)
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
