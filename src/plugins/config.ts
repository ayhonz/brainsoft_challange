import { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import fastifyEnv from '@fastify/env';

const schema = {
  type: 'object',
  required: [
    'PORT',
    'HOST',
    'POSTGRES_HOST',
    'POSTGRES_USER',
    'POSTGRES_PASSWORD',
    'POSTGRES_PORT',
  ],
  properties: {
    PORT: { type: 'string', default: '3000' },
    HOST: { type: 'string', default: 'localhost' },
    POSTGRES_PORT: { type: 'string', default: '3000' },
    POSTGRES_PASSWORD: { type: 'string' },
    POSTGRES_USER: { type: 'string' },
    POSTGRES_HOST: { type: 'string' },
  },
};

const appConfig: FastifyPluginAsync = async function (fastify) {
  await fastify.register(fastifyEnv, {
    schema,
    dotenv: true,
  });
};

export default fp(appConfig, { name: 'application-config' });
