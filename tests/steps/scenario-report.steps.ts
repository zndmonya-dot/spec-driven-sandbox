// specs/platform/scenario-report.feature のステップ。仕様の言葉をコードの言葉に訳すだけにする。
import { Given, Then, When } from "quickpickle";
import { expect } from "vitest";
import { buildScenarioTable, type ScenarioResult, type ScenarioTable } from "../../src/report";

type ReportWorld = {
  results?: ScenarioResult[];
  table?: ScenarioTable;
};

const record = (world: ReportWorld, feature: string, scenario: string, passed: boolean) => {
  world.results = [...(world.results ?? []), { feature, scenario, passed }];
};

Given(
  "機能 {string} のシナリオ {string} が合格した",
  (world: ReportWorld, feature: string, scenario: string) => record(world, feature, scenario, true),
);

Given(
  "機能 {string} のシナリオ {string} が不合格だった",
  (world: ReportWorld, feature: string, scenario: string) =>
    record(world, feature, scenario, false),
);

When("対応表を作る", (world: ReportWorld) => {
  world.table = buildScenarioTable(world.results ?? []);
});

Then(
  "表に 機能 {string}、シナリオ {string}、結果 {string} の行がある",
  (world: ReportWorld, feature: string, scenario: string, result: string) => {
    expect(world.table?.rows).toContainEqual({ feature, scenario, result });
  },
);

Then("合計は {string} になる", (world: ReportWorld, total: string) => {
  expect(world.table?.total).toBe(total);
});
