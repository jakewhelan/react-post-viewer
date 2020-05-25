import path from 'path'
import fastify from 'fastify'
import fastifyStatic from 'fastify-static'
import compression from 'compression'
import pino from 'pino'
import open from 'opn'

import webpack from 'webpack'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'
import webpackConfig from '../webpack.config'

import { rootService } from './services/root.service'

const logger = pino({ level: 'info' })
const app = fastify({ logger })

if (process.env.NODE_ENV !== 'production') {
  const compiler = webpack(webpackConfig)

  app.use(
    webpackDevMiddleware(compiler, {
      noInfo: true,
      publicPath: webpackConfig.output.publicPath,
      open: true
    })
  )
  app.use(webpackHotMiddleware(compiler))
}

app.register(fastifyStatic, {
  root: path.join(process.cwd(), 'client/dist')
})

app.use(compression())

app.register(rootService, { prefix: '/api' })

app.listen(3000, '0.0.0.0')
  .then(() => {
    open(`http://localhost:${app.server.address().port}`)
  })
  .catch(err => {
    if (err) throw err
  })
