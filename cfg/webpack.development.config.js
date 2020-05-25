import {
  baseConfig,
  compileTypeScript,
  generateOutputConfig,
  HtmlAndCssPlugins
} from './webpack.base.config'
import { HotModuleReplacementPlugin } from 'webpack'

export const developmentConfig = {
  ...baseConfig,
  mode: 'development',
  devtool: 'inline-source-map',
  entry: {
    ...baseConfig.entry,
    hot: 'webpack-hot-middleware/client'
  },
  output: generateOutputConfig({ isDev: true }),
  plugins: [
    ...baseConfig.plugins,
    ...HtmlAndCssPlugins,
    new HotModuleReplacementPlugin()
  ],
  module: {
    ...baseConfig.module,
    rules: [
      ...baseConfig.module.rules,
      compileTypeScript()
    ]
  }
}