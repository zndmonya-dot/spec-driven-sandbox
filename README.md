# spec-driven-sandbox

サンドボックスで動く大規模開発を想定した、仕様駆動開発の練習用リポジトリ。

## 進め方

1. **言葉を決める**：`CONTEXT.md` に用語を足す
2. **判断を残す**：迷って決めたことは `docs/adr/` に ADR として書く
3. **仕様を書く**：`specs/**/*.feature` に日本語の Gherkin でシナリオを書く
4. **テストを赤にする**：`tests/steps/` でステップをコードに対応づけ、`npm test` が落ちることを確かめる
5. **実装して緑にする**：`src/` を実装し、`npm test` と `npm run typecheck` を通す

仕様とテストは同じファイルです。シナリオを書き換えると、そのままテストが変わります。

## 構成

| パス | 役割 |
| --- | --- |
| `CONTEXT.md` | 用語集。仕様とコードはここの言葉だけを使う |
| `docs/adr/` | 設計判断の記録 |
| `specs/` | 振る舞いの仕様（Gherkin） |
| `src/**/schema.ts` | データの形と境界の契約（Zod） |
| `src/` | 実装 |
| `tests/steps/` | 仕様のステップと実装の対応づけ |

## コマンド

```sh
npm install
npm test           # 仕様（.feature）をテストとして実行
npm run typecheck  # 型検査
```
