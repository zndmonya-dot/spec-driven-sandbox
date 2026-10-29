// テストの結果から対応表を作り、CI の Summary（GITHUB_STEP_SUMMARY）に書き足す。
// CI の外（GITHUB_STEP_SUMMARY がないとき）では何もしない。
import { appendFileSync } from "node:fs";
import type { Reporter, TestModule } from "vitest/node";
import { buildScenarioTable, type ScenarioResult, toMarkdown } from "../src/report";

// QuickPickle は名前の頭に「機能: 」「シナリオ: 」などを付けるので外す。
const strip = (name: string): string =>
  name.replace(/^(機能|シナリオアウトライン|シナリオ|Feature|Scenario Outline|Scenario): /, "");

// シナリオアウトラインは例の行ごとに同じ名前になるので「（例 n）」を付けて見分ける。
const numberExamples = (results: ScenarioResult[]): ScenarioResult[] => {
  const key = (r: ScenarioResult) => `${r.feature}\u0000${r.scenario}`;
  const total = new Map<string, number>();
  for (const r of results) total.set(key(r), (total.get(key(r)) ?? 0) + 1);
  const seen = new Map<string, number>();
  return results.map((r) => {
    if ((total.get(key(r)) ?? 0) < 2) return r;
    const n = (seen.get(key(r)) ?? 0) + 1;
    seen.set(key(r), n);
    return { ...r, scenario: `${r.scenario}（例 ${n}）` };
  });
};

const collect = (modules: ReadonlyArray<TestModule>): ScenarioResult[] =>
  numberExamples(
    modules
      .filter((m) => m.moduleId.endsWith(".feature"))
      .flatMap((m) =>
        [...m.children.allTests()].map((t) => ({
          feature: strip(t.parent.type === "suite" ? t.parent.name : m.moduleId),
          scenario: strip(t.name),
          passed: t.result().state === "passed",
        })),
      ),
  );

export default class ScenarioReporter implements Reporter {
  onTestRunEnd(modules: ReadonlyArray<TestModule>) {
    const summary = process.env.GITHUB_STEP_SUMMARY;
    if (!summary) return;
    appendFileSync(summary, toMarkdown(buildScenarioTable(collect(modules))));
  }
}
