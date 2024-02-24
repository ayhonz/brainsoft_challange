import { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';

const errorHandler: FastifyPluginAsync = async function (fastify) {
  fastify.setErrorHandler(async (error, request, reply) => {
    if (reply.statusCode >= 500) {
      request.log.error(
        { req: request, res: reply, err: error },
        error.message,
      );
      await reply.send(`Fatal error. ID: ${request.id}`);
      return;
    }
    request.log.error({ req: request, res: reply, err: error }, error.message);
    await reply.send(error);
  });
};

export default fp(errorHandler, {
  name: 'error-handler',
});
