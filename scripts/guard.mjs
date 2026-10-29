// 品質チェックの機械でできる部分：テストのスキップが紛れ込んでいないか確かめる。
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const skipTags = /@(skip|todo|wip|fails|failing|soft|softfail)\b/;
const skipCalls = /\b(it|test|describe)\.(skip|only|todo)\(/;

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) yield* walk(path);
    else yield path;
  }
}

const problems = [];
for (const root of ["specs", "src", "tests"]) {
  for (const path of walk(root)) {
    const lines = readFileSync(path, "utf8").split("\n");
    lines.forEach((line, i) => {
      const pattern = path.endsWith(".feature") ? skipTags : skipCalls;
      if (pattern.test(line)) problems.push(`${path}:${i + 1}: ${line.trim()}`);
    });
  }
}

if (problems.length > 0) {
  console.error("テストをスキップする書き方が見つかりました。スキップせずに直してください。");
  for (const p of problems) console.error(`  ${p}`);
  process.exit(1);
}
console.log("guard: スキップなし");
