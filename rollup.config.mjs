import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import pkg from './package.json' assert { type: 'json' };
import commonjs from '@rollup/plugin-commonjs';
import alias from '@rollup/plugin-alias';
import wasm from '@rollup/plugin-wasm';
import replace from '@rollup/plugin-replace';

const pkgDeps = Array.from(Object.keys({ ...pkg.dependencies, ...pkg.peerDependencies }));

/** @type {import('rollup').RollupOptions} */
const config = {
  input: 'src/index.ts',
  output: [
    {
      entryFileNames: `[name].cjs`,
      dir: 'dist',
      format: 'cjs',
      exports: 'named',
      sourcemap: true,
      preserveModules: true,
    },
  ],
  plugins: [
    typescript({
      tsconfig: 'tsconfig.build.json',
    }),
    resolve(),
    commonjs(),
    alias({
      entries: [
        {
          find: '@/binary_hamming_distance/pkg',
          replacement: './src/binary_hamming_distance/pkg/binary_hamming_distance.js',
        },
      ],
    }),
    wasm(), // 没啥用
    replace({
      preventAssignment: true,
    }), // 没啥用
  ],
  external: [...pkgDeps],
  treeshake: false,
};

export default config;
