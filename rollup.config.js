import buble from 'rollup-plugin-buble';
import RollupPluginTypescript from 'rollup-plugin-typescript2';
import uglify from 'rollup-plugin-uglify-es';

const plugins = [
  RollupPluginTypescript({
    tsconfig: "tsconfig.json"
  }),
  buble({  // transpile ES2015+ to ES5
    exclude: ['node_modules/**']
  })
];

export default [
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/vue-rescroll-common.js',
      format: 'cjs'
    },
    external: [ 'vue' ],
    plugins
  },
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/vue-rescroll-esm.js',
      format: 'es'
    },
    external: [ 'vue' ],
    plugins
  },
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/vue-rescroll.js',
      format: 'umd',
      name: 'VueRescroll'
    },
    external: [ 'vue' ],
    plugins
  },
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/vue-rescroll-min.js',
      format: 'umd',
      name: 'VueRescroll'
    },
    external: [ 'vue' ],
    plugins: [
      ...plugins,
      uglify()
    ]
  },
];
