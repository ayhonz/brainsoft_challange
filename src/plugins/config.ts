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
    'NODE_ENV',
  ],
  properties: {
    PORT: { type: 'string', default: '3000' },
    HOST: { type: 'string', default: 'localhost' },
    POSTGRES_PORT: { type: 'string' },
    POSTGRES_PASSWORD: { type: 'string' },
    POSTGRES_USER: { type: 'string' },
    POSTGRES_HOST: { type: 'string' },
    NODE_ENV: { type: 'string', default: 'development' },
  },
};

const appConfig: FastifyPluginAsync = async function (fastify) {
  await fastify.register(fastifyEnv, {
    schema,
    dotenv: true,
  });
};

export default fp(appConfig, { name: 'application-config' });
