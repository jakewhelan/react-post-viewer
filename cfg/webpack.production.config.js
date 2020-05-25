import { baseConfig, compileTypeScript, HtmlAndCssPlugins } from './webpack.base.config'
import HtmlMinifierPlugin from 'html-minifier-webpack-plugin'
import TerserPlugin from 'terser-webpack-plugin'
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin'

export const productionConfig = {
  ...baseConfig,
  module: {
    ...baseConfig.module,
    rules: [
      ...baseConfig.module.rules,
      compileTypeScript()
    ]
  },
  optimization: {
    ...baseConfig.optimization,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          output: {
            comments: false
          }
        }
      }),
      new OptimizeCSSAssetsPlugin()
    ]
  },
  plugins: [
    ...baseConfig.plugins,
    ...HtmlAndCssPlugins,
    new HtmlMinifierPlugin({
      collapseInlineTagWhitespace: true,
      collapseWhitespace: true,
      removeComments: true,
      useShortDoctype: true
    })
  ]
}