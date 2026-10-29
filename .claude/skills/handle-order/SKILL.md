---

name: handle-order
description: 注文書（ラベル order の Issue）から機能を作るときの手順。Issue を読んでから PR を出すまでの流れ。
---

# 注文書を処理する

1. 注文書を読む。あいまいなところがあれば `grill` スキルで質問し、答えが来るまで実装しない
2. 新しい言葉を `CONTEXT.md` に足す
3. 「決まりごと」を `specs/<領域>/<名前>.feature` にそのまま写す（先頭は `# language: ja`、2行目に注文書の URL）
4. `npm test` で新しいシナリオが不合格になることを確かめ、ここで一度コミットする
5. `tests/steps/` にステップ、`src/` に実装を書き、`npm run verify` が通るまで直す
6. `quality-check` スキルを通す
7. ブランチ `claude/order-<番号>` を push し、main 向けの PR を出す。本文には次を書く
   - `Closes #番号`
   - 手順の記録（赤を確認したコミット、緑にしたコミット）
   - AI が判断したこと
   - 品質チェックの結果
