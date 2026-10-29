# 作業部屋（サンドボックス）。人も AI もこの中で開発し、同じ結果を得る。
FROM node:22-bookworm

# Claude Code をこの中で動かせるようにする（ステップ3で使う）
RUN npm install -g @anthropic-ai/claude-code

USER node
WORKDIR /workspace
