// 在庫の入庫・出庫。振る舞いの仕様は specs/inventory/stock.feature。
import type { Sku, StockCommand } from "./schema";

export type Inventory = ReadonlyMap<Sku, number>;
export type InventoryError = "INSUFFICIENT_STOCK" | "UNKNOWN_SKU" | "INVALID_INPUT";
export type Result<T> = { ok: true; value: T } | { ok: false; error: InventoryError };

export function emptyInventory(): Inventory {
  throw new Error("未実装");
}

export function quantityOf(_inventory: Inventory, _sku: string): number {
  throw new Error("未実装");
}

export function receive(_inventory: Inventory, _command: StockCommand): Result<Inventory> {
  throw new Error("未実装");
}

export function ship(_inventory: Inventory, _command: StockCommand): Result<Inventory> {
  throw new Error("未実装");
}
