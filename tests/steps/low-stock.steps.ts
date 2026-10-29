// specs/inventory/low-stock.feature のステップ。仕様の言葉をコードの言葉に訳すだけにする。
import { Given, Then, When } from "quickpickle";
import { expect } from "vitest";
import {
  emptyInventory,
  emptyReorderPoints,
  lowStock,
  type ReorderPoints,
  setReorderPoint,
} from "../../src/inventory";
import type { InventoryWorld } from "./inventory.steps";

type LowStockWorld = InventoryWorld & {
  reorderPoints?: ReorderPoints;
  list?: string[];
};

Given(
  "商品 {string} の発注点は {int} 個である",
  (world: LowStockWorld, sku: string, reorderPoint: number) => {
    world.reorderPoints = setReorderPoint(
      world.reorderPoints ?? emptyReorderPoints(),
      sku,
      reorderPoint,
    );
  },
);

When("在庫が少ない商品を一覧する", (world: LowStockWorld) => {
  world.list = lowStock(
    world.inventory ?? emptyInventory(),
    world.reorderPoints ?? emptyReorderPoints(),
  );
});

Then(
  /^一覧は ((?:"[^"]*"(?:, )?)+) (?:である|の順である)$/,
  (world: LowStockWorld, skus: string) => {
    const expected = [...skus.matchAll(/"([^"]*)"/g)].map((m) => m[1]);
    expect(world.list).toEqual(expected);
  },
);

Then("一覧は空である", (world: LowStockWorld) => {
  expect(world.list).toEqual([]);
});
