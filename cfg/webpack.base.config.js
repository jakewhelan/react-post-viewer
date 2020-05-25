import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import { join, resolve } from 'path'
import tsconfig from '../tsconfig.json'

export const root = resolve(__dirname, '../client/src')

export const compileTypeScript = () => {
  return {
    test: /\.(ts|tsx)$/,
    exclude: /node_modules/,
    use: [
      {
        loader: 'awesome-typescript-loader',
        options: {
          silent: true,
          useBabel: true,
          babelOptions: {
            babelrc: false,
            presets: [
              [
                '@babel/preset-env',
                { modules: false }
              ]
            ],
            plugins: [
              'react-hot-loader/babel'
            ]
          },
          babelCore: '@babel/core'
        }
      }
    ]
  }
}

export const compilePolyfills = () => ({
  test: /polyfills\.js$/,
  exclude: resolve(__dirname, 'node_modules'),
  use: [
    {
      loader: 'babel-loader',
      options: {
        presets: [
          [
            '@babel/preset-env', {
              useBuiltIns: 'entry',
              modules: false,
              corejs: 3,
              targets: {
                // TODO: add more robust browser compile targets using .browserslistrc
                // TODO: split and serve different bundles to different browsers
                ie: 11
              }
            }
          ]
        ]
      }
    }
  ]
})

export const compileCSS = () => ({
  test: /\.css$/,
  use: [
    MiniCssExtractPlugin.loader,
    'css-loader'
  ]
})

export const compileReactHot = () => ({
  test: /\.(ts|tsx)$/,
  use: 'react-hot-loader/webpack',
  include: /node_modules/
})

export const generateOutputConfig = ({ isDev = false } = {}) => ({
  path: resolve(root, '../dist'),
  filename: isDev
    ? '[name].[hash].js'
    : '[name].[contenthash:8].js',
  chunkFilename: isDev
    ? '[name].[hash].js'
    : '[name].[contenthash:8].js',
  publicPath: '/',
})

export const HtmlAndCssPlugins = [
  new MiniCssExtractPlugin({
    filename: '[name].[contenthash:8].css'
  }),
  new HtmlWebpackPlugin({
    template: resolve(root, 'index.html'),
    filename: './index.html'
  })
]

const {
  compilerOptions: {
    paths
  }
} = require('../tsconfig.json')

/**
* Module aliases should be maintained
* in `.tsconfig` _only_ - the following
* block will derive a webpack appropriate
* equivalent
*/
const alias = Object.entries(paths)
  .reduce((acc, [alias, path]) => {
    return {
      ...acc,
      [alias.replace('/*', '')]: resolve(root, `${path}`.replace('*', ''))
    }
  }, {})

export const baseConfig = {
  mode: 'production',
  entry: {
    polyfills: resolve(root, 'polyfills.js'),
    main: resolve(root, 'main.tsx')
  },
  output: generateOutputConfig(),
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
    alias: {
      ...alias,
      'react-dom': '@hot-loader/react-dom'
    }
    
  },
  module: {
    rules: [
      compilePolyfills(),
      compileCSS()
    ]
  },
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: Infinity,
      minSize: 0,
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name (module) {
            const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1]

            return `vendor.${packageName.replace('@', '')}`
          }
        }
      }
    }
  },
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000
  },
  plugins: [
    new CleanWebpackPlugin()
  ]
}