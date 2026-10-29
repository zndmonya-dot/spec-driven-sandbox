// 依存ルール。仕様は specs/platform/dependency-rules.feature、用語は CONTEXT.md。
/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: "src-not-to-tests",
      comment: "本番がテストに依存",
      severity: "error",
      from: { path: "^src/" },
      to: { path: "^(tests|specs|scripts)/" },
    },
    {
      name: "no-circular",
      comment: "循環",
      severity: "error",
      from: {},
      to: { circular: true },
    },
    {
      name: "schema-at-bottom",
      comment: "契約が一番下にない",
      severity: "error",
      from: { path: "^src/.*schema\\.ts$" },
      to: { path: "^src/" },
    },
    {
      name: "gateway-between-areas",
      comment: "窓口を通っていない",
      severity: "error",
      from: { path: "^src/([^/]+)/" },
      to: { path: "^src/[^/]+/", pathNot: ["^src/$1/", "^src/[^/]+/index\\.ts$"] },
    },
    {
      name: "gateway-from-tests",
      comment: "窓口を通っていない",
      severity: "error",
      from: { path: "^(tests|scripts)/" },
      to: { path: "^src/[^/]+/", pathNot: "^src/[^/]+/index\\.ts$" },
    },
  ],
  options: {
    doNotFollow: { path: "node_modules" },
    tsPreCompilationDeps: true,
    enhancedResolveOptions: { extensions: [".ts", ".mjs", ".js"] },
  },
};
