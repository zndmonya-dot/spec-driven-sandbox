// specs/platform/dependency-rules.feature のステップ。仕様の言葉を dependency-cruiser の呼び出しに訳す。
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { dirname, join, posix, relative, resolve } from "node:path";
import { cruise } from "dependency-cruiser";
import { Given, Then, When } from "quickpickle";
import { expect } from "vitest";

const config = createRequire(import.meta.url)(resolve(".dependency-cruiser.cjs"));

type Violation = { rule: { name: string } };
type RulesWorld = {
  files?: Map<string, string[]>;
  violations?: string[];
};

function ruleComment(name: string): string {
  return config.forbidden.find((r: { name: string }) => r.name === name)?.comment ?? name;
}

async function check(baseDir: string, roots: string[]): Promise<string[]> {
  const result = await cruise(roots, {
    baseDir,
    validate: true,
    ruleSet: { forbidden: config.forbidden },
    ...config.options,
  });
  if (typeof result.output === "string") throw new Error(result.output);
  return (result.output.summary.violations as Violation[]).map((v) => ruleComment(v.rule.name));
}

Given("{string} が {string} を使っている", (world: RulesWorld, from: string, to: string) => {
  world.files ??= new Map();
  world.files.set(from, [...(world.files.get(from) ?? []), to]);
  if (!world.files.has(to)) world.files.set(to, []);
});

When("依存ルールを確かめる", async (world: RulesWorld) => {
  const dir = mkdtempSync(join(tmpdir(), "deps-"));
  for (const [file, imports] of world.files ?? []) {
    const lines = imports.map((to) => {
      const spec = posix.relative(posix.dirname(file), to).replace(/\.ts$/, "");
      return `import "${spec.startsWith(".") ? spec : `./${spec}`}";`;
    });
    mkdirSync(join(dir, dirname(file)), { recursive: true });
    writeFileSync(join(dir, file), `${lines.join("\n")}\nexport {};\n`);
  }
  const roots = [...new Set([...(world.files?.keys() ?? [])].map((f) => f.split("/")[0] ?? f))];
  world.violations = await check(dir, roots);
});

When("このリポジトリの依存ルールを確かめる", async (world: RulesWorld) => {
  world.violations = await check(relative(".", process.cwd()) || ".", ["src", "tests", "scripts"]);
});

Then("{string} の違反で不合格になる", (world: RulesWorld, name: string) => {
  expect(world.violations).toContain(name);
});

Then("合格になる", (world: RulesWorld) => {
  expect(world.violations).toEqual([]);
});
