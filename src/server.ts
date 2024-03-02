import { FastifyInstance } from 'fastify';
import { build } from './app';

const start = async () => {
  let fastify: FastifyInstance;
  try {
    fastify = await build({ logger: true });
    await fastify.listen({
      host: fastify.config.HOST,
      port: fastify.config.PORT,
    });

    fastify.log.info(`Swagger available at ${fastify.listeningOrigin}/docs`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

void start();
