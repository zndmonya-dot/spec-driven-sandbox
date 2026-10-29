// 在庫の領域の窓口。領域の外からはここだけを使う。
export { emptyReorderPoints, lowStock, type ReorderPoints, setReorderPoint } from "./low-stock";
export { ReorderPoint, Sku, StockCommand } from "./schema";
export {
  emptyInventory,
  type Inventory,
  type InventoryError,
  quantityOf,
  type Result,
  receive,
  ship,
} from "./stock";
