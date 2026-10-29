// specs/inventory/*.feature の各ステップを、在庫モジュールの呼び出しに対応づける。
// ここには判断ロジックを書かない。仕様の言葉をコードの言葉に訳すだけにする。
import { Given, Then, When } from "quickpickle";
import { expect } from "vitest";
import {
  emptyInventory,
  type Inventory,
  type InventoryError,
  quantityOf,
  receive,
  ship,
} from "../../src/inventory/stock";

export type InventoryWorld = {
  inventory: Inventory;
  lastError?: InventoryError;
};

// CONTEXT.md の「エラー」表と同じ対応
const errorNames: Record<string, InventoryError> = {
  在庫不足: "INSUFFICIENT_STOCK",
  未登録の商品: "UNKNOWN_SKU",
  不正な入力: "INVALID_INPUT",
};

const operations = { 入庫: receive, 出庫: ship } as const;

function apply(world: InventoryWorld, op: keyof typeof operations, sku: string, quantity: number) {
  const result = operations[op](world.inventory, { sku, quantity });
  if (result.ok) {
    world.inventory = result.value;
    world.lastError = undefined;
  } else {
    world.lastError = result.error;
  }
}

Given("在庫は空である", (world: InventoryWorld) => {
  world.inventory = emptyInventory();
});

Given(
  "商品 {string} の在庫数は {int} 個である",
  (world: InventoryWorld, sku: string, quantity: number) => {
    const current = world.inventory ?? emptyInventory();
    if (current.has(sku)) throw new Error(`前提で同じ商品を2回登録しています: ${sku}`);
    const result = receive(current, { sku, quantity });
    if (!result.ok) throw new Error(`前提を作れません: ${result.error}`);
    world.inventory = result.value;
  },
);

When(
  /^商品 "([^"]*)" を (-?[\d.]+) 個(入庫|出庫)する$/,
  (world: InventoryWorld, sku: string, quantity: string, op: string) => {
    apply(world, op as keyof typeof operations, sku, Number(quantity));
  },
);

Then(
  /^商品 "([^"]*)" の在庫数は (\d+) 個(?:になる|のままである)$/,
  (world: InventoryWorld, sku: string, quantity: string) => {
    expect(quantityOf(world.inventory, sku)).toBe(Number(quantity));
  },
);

Then("{string} で拒否される", (world: InventoryWorld, name: string) => {
  const expected = errorNames[name];
  if (!expected) throw new Error(`CONTEXT.md にないエラー名です: ${name}`);
  expect(world.lastError).toBe(expected);
});
