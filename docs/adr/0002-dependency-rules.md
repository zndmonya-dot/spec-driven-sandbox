# ADR 0002: 依存ルールを dependency-cruiser で機械的に守る

- 状態: 採用
- 日付: 2026-10-29
- 注文書: #9

## 決定

1. 依存ルールは `.dependency-cruiser.cjs` に書き、`npm run deps` として `npm run verify` に組み込む。
2. 領域の外から使うときは窓口（`src/<領域>/index.ts`）だけを使う。`tests/` と `scripts/` も「領域の外」に含める。
3. TypeScript は 6 系に戻す。dependency-cruiser が TypeScript 7 の API にまだ対応しておらず、7 のままでは `.ts` を読めないため。

## 理由

- 規則を文章で書くだけでは AI も人も破る。破ったら verify が落ちるようにしておけば、レビューで見落とさない。
- `tests/` を窓口の規則から外すと、テストが中身に直接依存し、窓口の外から見た振る舞いを確かめられなくなる。

## 見直す条件

dependency-cruiser が TypeScript 7 に対応したら、TypeScript を 7 に上げる。
