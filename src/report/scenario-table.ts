// 対応表：仕様の各シナリオと、そのテスト結果を並べた表。

export type ScenarioResult = {
  feature: string;
  scenario: string;
  passed: boolean;
};

export type ScenarioRow = {
  feature: string;
  scenario: string;
  result: "合格" | "不合格";
};

export type ScenarioTable = {
  rows: ScenarioRow[];
  total: string;
};

export const buildScenarioTable = (results: readonly ScenarioResult[]): ScenarioTable => {
  const rows = results.map(
    (r): ScenarioRow => ({
      feature: r.feature,
      scenario: r.scenario,
      result: r.passed ? "合格" : "不合格",
    }),
  );
  const passed = rows.filter((r) => r.result === "合格").length;
  return { rows, total: `合格 ${passed} 件 / 不合格 ${rows.length - passed} 件` };
};

// 表の文字に "|" があると列がずれるので逃がす。
const cell = (text: string): string => text.replaceAll("|", "\\|");

export const toMarkdown = (table: ScenarioTable): string =>
  [
    "## 対応表",
    "",
    "| 機能 | シナリオ | 結果 |",
    "| --- | --- | --- |",
    ...table.rows.map((r) => `| ${cell(r.feature)} | ${cell(r.scenario)} | ${r.result} |`),
    "",
    `合計: ${table.total}`,
    "",
  ].join("\n");
