# spec-driven-sandbox

サンドボックスで動く大規模開発を想定した、仕様駆動開発の練習用リポジトリ。

## 注文の仕方

人は GitHub の Issue で「注文書」を書くだけです。書き方は [docs/how-to-order.md](docs/how-to-order.md)。

## 進め方

1. **言葉を決める**：`CONTEXT.md` に用語を足す
2. **判断を残す**：迷って決めたことは `docs/adr/` に ADR として書く
3. **仕様を書く**：`specs/**/*.feature` に日本語の Gherkin でシナリオを書く
4. **テストを赤にする**：`tests/steps/` でステップをコードに対応づけ、`npm test` が落ちることを確かめる
5. **実装して緑にする**：`src/` を実装し、`npm test` と `npm run typecheck` を通す

仕様とテストは同じファイルです。シナリオを書き換えると、そのままテストが変わります。

## 構成

| パス               | 役割                                       |
| ------------------ | ------------------------------------------ |
| `CONTEXT.md`       | 用語集。仕様とコードはここの言葉だけを使う |
| `docs/adr/`        | 設計判断の記録                             |
| `specs/`           | 振る舞いの仕様（Gherkin）                  |
| `src/**/schema.ts` | データの形と境界の契約（Zod）              |
| `src/`             | 実装                                       |
| `tests/steps/`     | 仕様のステップと実装の対応づけ             |

## 作業部屋（サンドボックス）

`.devcontainer/` に作業部屋の定義があります。VS Code の Dev Containers や GitHub Codespaces で開くと、
Node 22 と Claude Code が入った隔離環境で作業できます。中で何をしても、作り直せば元に戻ります。

GitHub Actions（`.github/workflows/verify.yml`）も同じ Node のイメージで `npm run verify` を走らせるので、
手元・AI・CI の合否判定は同じ結果になります。AI 向けの約束事は `CLAUDE.md` にあります。

## コマンド

```sh
npm ci
npm run verify     # 合否判定：lint → 型検査 → 仕様のテスト をまとめて実行
npm run format     # 書式の自動修正
```
