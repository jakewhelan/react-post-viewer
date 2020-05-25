import data from './posts.json'

export const getPosts = async (request, reply) => {
  const successMessage = 'Successfully retrieved posts from static file'

  request.log.info(successMessage)
  reply.type('application/json').code(200)

  return {
    messages: [
      successMessage
    ],
    data
  }
}
