import Fastify from 'fastify';
import AutoLoad from '@fastify/autoload';
import { join } from 'node:path';

const fastify = Fastify({ logger: true });

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

fastify.listen({ host: '0.0.0.0', port: 3000 }).catch((err) => {
  fastify.log.error(err);
  process.exit(1);
});
