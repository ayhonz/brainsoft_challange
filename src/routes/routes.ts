import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';

const rootRoutes: FastifyPluginAsyncTypebox = async function (fastify) {
  fastify.get('/', async () => {
    return { root: true };
  });
};

export default rootRoutes;
