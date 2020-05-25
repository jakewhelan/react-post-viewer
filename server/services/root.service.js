import { postService } from './post/post.service'

export const rootService = (fastify, opts, next) => {
  fastify.register(postService, { prefix: '/posts' })
  next()
}
