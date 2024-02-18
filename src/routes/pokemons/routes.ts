import {
  type FastifyPluginAsyncTypebox,
  Type,
} from '@fastify/type-provider-typebox';

const pokenomRoutes: FastifyPluginAsyncTypebox = async function (fastify) {
  fastify.get(
    '/',
    {
      schema: {
        querystring: Type.Object({
          name: Type.String({ default: 'world', description: 'Pass Name' }),
        }),
        response: {
          200: Type.Object({
            hello: Type.String(),
          }),
        },
      },
    },
    (req) => {
      const { name } = req.query;
      return { hello: name };
    },
  );

  fastify.get(
    '/:id',
    {
      schema: {
        params: Type.Object({
          id: Type.String({ description: 'Pass ID' }),
        }),
        response: {
          200: Type.Object({
            id: Type.String(),
          }),
        },
      },
    },
    (request) => {
      const { id } = request.params;
      return { id: id };
    },
  );

  fastify.get(
    '/name/:name',
    {
      schema: {
        params: Type.Object({
          name: Type.String({ description: 'Pass Name' }),
        }),
        response: {
          200: Type.Object({
            name: Type.String(),
          }),
        },
      },
    },
    (request) => {
      return { name: request.params.name };
    },
  );

  fastify.get(
    '/types',
    {
      schema: {
        response: {
          200: Type.Array(Type.String()),
        },
      },
    },
    () => {
      return ['fire', 'water', 'grass'];
    },
  );
};

export default pokenomRoutes;
