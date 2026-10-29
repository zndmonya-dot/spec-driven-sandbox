// 在庫モジュールの入力の契約。用語の定義は CONTEXT.md を参照。
import { z } from "zod";

export const Sku = z.string().regex(/^[A-Z]{3}-\d{4}$/);
export type Sku = z.infer<typeof Sku>;

export const Quantity = z.number().int().positive();
export type Quantity = z.infer<typeof Quantity>;

export const StockCommand = z.object({ sku: Sku, quantity: Quantity });
export type StockCommand = z.infer<typeof StockCommand>;
