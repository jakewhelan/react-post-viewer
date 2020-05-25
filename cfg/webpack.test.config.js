import { resolve } from 'path'
import glob from 'glob'
import { baseConfig, compileTypeScript, root } from './webpack.base.config'

const testFiles = glob.sync(resolve(root, '**/*.test.tsx'))

if (!testFiles.length) {
  console.error('No tests detected')
  process.exit(0)
}

export const testConfig = {
  ...baseConfig,
  target: 'node',
  entry: [
    'global-jsdom/lib/register',
    resolve(root, 'polyfills.js'),
    resolve(root, 'test.js'),
    ...testFiles
  ],
  output: {
    path: resolve(root, '../dist'),
    filename: 'test.js',
    publicPath: '/',
    libraryTarget: 'umd'
  },
  devtool: 'inline-source-map',
  module: {
    ...baseConfig.module,
    rules: [
      compileTypeScript()
    ]
  },
  optimization: {
    minimize: false
    /**
     * - Overwriting splitChunks here on purpose, we only want a 
     *   single bundle file for testing
     * 
     * - We remove all minification because it is time consuming
     * 
     * - We disable uglification of variable names to try make
     *   debugging a little less painful in debuggers with poor
     *   source-map parsing (VS CODE!!!!)
     */
  },
  externals: {
    /**
     * This is necessary noise so that dependencies
     * compile correctly
     */
    canvas: `commonjs canvas`,
    'utf-8-validate': 'utf-8-validate',
    bufferutil: 'bufferutil',
    enzyme: 'enzyme',
    'enzyme-adapter-react-16': 'enzyme-adapter-react-16',
    react: 'react'
  }
}
