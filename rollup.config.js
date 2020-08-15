import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import { terser } from 'rollup-plugin-terser';

export default {
  input: 'src/index.js',
  output: [
    {
      file: 'dist/index.js',
      format: 'es',
      sourcemap: true,
    },
    {
      name: 'index',
      file: 'dist/index.min.js',
      format: 'umd',
      sourcemap: true,
    },
  ],
  plugins: [resolve(), commonjs(), terser(), json()],
};
