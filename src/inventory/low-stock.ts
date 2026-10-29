// 在庫が少ない商品の一覧。振る舞いの仕様は specs/inventory/low-stock.feature。
import { ReorderPoint, Sku } from "./schema";
import { type Inventory, quantityOf } from "./stock";

export type ReorderPoints = ReadonlyMap<Sku, ReorderPoint>;

export function emptyReorderPoints(): ReorderPoints {
  return new Map();
}

export function setReorderPoint(
  reorderPoints: ReorderPoints,
  sku: unknown,
  reorderPoint: unknown,
): ReorderPoints {
  return new Map(reorderPoints).set(Sku.parse(sku), ReorderPoint.parse(reorderPoint));
}

// 発注点を決めている商品のうち、在庫数が発注点以下のものを在庫数の少ない順に返す。
// 在庫数が同じときは商品の順に並べる。
export function lowStock(inventory: Inventory, reorderPoints: ReorderPoints): Sku[] {
  return [...reorderPoints]
    .filter(([sku, reorderPoint]) => quantityOf(inventory, sku) <= reorderPoint)
    .map(([sku]) => sku)
    .sort((a, b) => quantityOf(inventory, a) - quantityOf(inventory, b) || a.localeCompare(b));
}
