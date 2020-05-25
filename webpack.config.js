import { productionConfig } from './cfg/webpack.production.config'
import { developmentConfig } from './cfg/webpack.development.config'
import { testConfig } from './cfg/webpack.test.config'

export default (() => {
  if (process.env.NODE_ENV === 'production') return productionConfig
  if (process.env.NODE_ENV === 'test') return testConfig
  return developmentConfig
})()
