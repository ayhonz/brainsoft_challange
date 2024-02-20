import { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import { MikroORM } from '@mikro-orm/postgresql';

const microORM: FastifyPluginAsync = async function (fastify) {
  const orm = await MikroORM.init({
    entities: ['dist/entities/**/*.js'],
    entitiesTs: ['src/entities/**/*.ts'],
    password: fastify.config.POSTGRES_PASSWORD,
    user: fastify.config.POSTGRES_USER,
    port: fastify.config.POSTGRES_PORT,
    host: fastify.config.POSTGRES_HOST,
    dbName: 'pokemon',
  });

  fastify.decorate('mikroORM', { orm });

  fastify.addHook('onRequest', async function (this: typeof fastify, request) {
    request.mikroORM = this.mikroORM;

    request.mikroORM.orm.em = request.mikroORM.orm.em.fork();
  });

  fastify.addHook('onClose', () => orm.close());
};

export default fp(microORM, {
  name: 'micro-orm',
  dependencies: ['application-config'],
});
