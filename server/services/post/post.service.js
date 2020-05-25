import { getPosts } from './endpoints/get-posts.endpoint'

export const postService = (fastify, _, next) => {
  fastify.get('/', getPosts)

  next()
}
