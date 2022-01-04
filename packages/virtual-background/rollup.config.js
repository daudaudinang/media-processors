import * as fs from 'fs';
import * as path from 'path';
import typescript from '@rollup/plugin-typescript';
import pkg from './package.json';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';

const banner = `/**
 * ${pkg.name}
 * ${pkg.description}
 * @version: ${pkg.version}
 * @author: ${pkg.author}
 * @license: ${pkg.license}
 **/
`;

export default [
  {
    input: 'src/virtual_background.ts',
    plugins: [
      typescript({module: "esnext"}),
      commonjs(),
      resolve(),
      mediapipe_workaround(),
    ],
    output: {
      sourcemap: false,
      file: './dist/virtual_background.js',
      format: 'umd',
      name: 'Shiguredo',
      extend: true,
      banner: banner,
    }
  },
];

// https://github.com/google/mediapipe/issues/2883 が本家で対応されるまでのワークアラウンド
function mediapipe_workaround() {
  return {
    name: 'mediapipe_workaround',
    load(id) {
      if (path.basename(id) === 'selfie_segmentation.js') {
        let code = fs.readFileSync(id, 'utf-8');
        code += 'exports.SelfieSegmentation = SelfieSegmentation;';
        return {code};
      } else {
        return null;
      }
    },
  };
}
