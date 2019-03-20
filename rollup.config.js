import buble from 'rollup-plugin-buble';
import RollupPluginTypescript from 'rollup-plugin-typescript2';
import { terser } from "rollup-plugin-terser";
import clear from 'rollup-plugin-clear';

const plugins = [
  RollupPluginTypescript({
    tsconfig: "tsconfig.json",
    clean: true
  }),
  terser(),
  buble({  // transpile ES2015+ to ES5
    exclude: ['node_modules/**']
  }),
  clear({
    targets: [ './dist' ]
  })
];

export default [
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/vue-rescroll-common.js',
      format: 'cjs',
      exports: 'named',
      name: 'VueRescroll'
    },
    plugins
  },
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/vue-rescroll-esm.js',
      format: 'es'
    },
    plugins
  },
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/vue-rescroll-min.js',
      format: 'umd',
      exports: 'named',
      name: 'VueRescroll'
    },
    plugins
  }
];
