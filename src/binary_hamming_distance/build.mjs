#!/usr/bin/env zx
import path from 'node:path';

const isCI = process.env.CI === 'true';

if (!isCI) {
  const cjs = path.join(__dirname, 'pkg');
  await $`wasm-pack build ${__dirname} --target nodejs --out-dir ${cjs}`;
  const cjs_ignore = path.join(cjs, '.gitignore');
  await $`rimraf ${cjs_ignore}`;
}
