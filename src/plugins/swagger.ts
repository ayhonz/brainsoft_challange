import { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';

const swagger: FastifyPluginAsync = async function (fastify) {
  const swaggerCofig = {
    swagger: {
      info: {
        title: 'Pokemon API',
        description: 'A simple Pokemon API documentation',
        version: '0.1.0',
      },
      externalDocs: {
        url: 'https://swagger.io',
        description: 'Find more info here',
      },
      host: 'localhost:3000',
      schemes: ['http', 'https'],
      consumes: ['application/json'],
      produces: ['application/json'],
    },
  };
  await fastify.register(fastifySwagger, swaggerCofig);
  await fastify.register(fastifySwaggerUi, {
    routePrefix: '/docs',
  });
};

export default fp(swagger, {
  name: 'swagger',
});
