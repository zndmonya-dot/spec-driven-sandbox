import { quickpickle } from "quickpickle";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [quickpickle()],
  test: {
    include: ["specs/**/*.feature", "src/**/*.test.ts"],
    reporters: ["default", "./scripts/scenario-reporter.ts"],
    setupFiles: [
      "tests/steps/inventory.steps.ts",
      "tests/steps/low-stock.steps.ts",
      "tests/steps/dependency-rules.steps.ts",
      "tests/steps/scenario-report.steps.ts",
    ],
  },
});
