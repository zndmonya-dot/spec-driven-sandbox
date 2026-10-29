import { defineConfig } from "vitest/config";
import { quickpickle } from "quickpickle";

export default defineConfig({
  plugins: [quickpickle()],
  test: {
    include: ["specs/**/*.feature", "src/**/*.test.ts"],
    setupFiles: ["tests/steps/inventory.steps.ts"],
  },
});
