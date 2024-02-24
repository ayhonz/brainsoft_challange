import Fastify, { FastifyServerOptions } from 'fastify';
import AutoLoad from '@fastify/autoload';
import { join } from 'node:path';

export const build = async (opts: FastifyServerOptions) => {
  const fastify = Fastify(opts);

  void fastify.register(AutoLoad, {
    dir: join(__dirname, 'plugins'),
    ignorePattern: /.*no-load\.ts/,
    indexPattern: /^no$/i,
  });

  void fastify.register(AutoLoad, {
    dir: join(__dirname, 'routes'),
    indexPattern: /.*routes\.ts/i,
    ignorePattern: /.*\.ts/,
    autoHooksPattern: /.*,hook\.ts/i,
    autoHooks: true,
    cascadeHooks: true,
  });

  return fastify;
};
