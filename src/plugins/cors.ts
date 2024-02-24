import { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import cors from '@fastify/cors';

const corsPlugin: FastifyPluginAsync = async function (fastify) {
  await fastify.register(cors, {
    origin: true,
  });
};

export default fp(corsPlugin, {
  name: 'cors',
});
