// 在庫の入庫・出庫。振る舞いの仕様は specs/inventory/stock.feature。
// 在庫は変更せず、新しい在庫を返す。失敗したときは元の在庫がそのまま残る。
import { type Sku, StockCommand } from "./schema";

export type Inventory = ReadonlyMap<Sku, number>;
export type InventoryError = "INSUFFICIENT_STOCK" | "UNKNOWN_SKU" | "INVALID_INPUT";
export type Result<T> = { ok: true; value: T } | { ok: false; error: InventoryError };

const fail = (error: InventoryError): Result<never> => ({ ok: false, error });

export function emptyInventory(): Inventory {
  return new Map();
}

export function quantityOf(inventory: Inventory, sku: string): number {
  return inventory.get(sku) ?? 0;
}

export function receive(inventory: Inventory, command: unknown): Result<Inventory> {
  const parsed = StockCommand.safeParse(command);
  if (!parsed.success) return fail("INVALID_INPUT");
  const { sku, quantity } = parsed.data;

  return { ok: true, value: new Map(inventory).set(sku, quantityOf(inventory, sku) + quantity) };
}

export function ship(inventory: Inventory, command: unknown): Result<Inventory> {
  const parsed = StockCommand.safeParse(command);
  if (!parsed.success) return fail("INVALID_INPUT");
  const { sku, quantity } = parsed.data;

  const current = inventory.get(sku);
  if (current === undefined) return fail("UNKNOWN_SKU");
  if (current < quantity) return fail("INSUFFICIENT_STOCK");

  return { ok: true, value: new Map(inventory).set(sku, current - quantity) };
}
