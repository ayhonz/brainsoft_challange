import { type FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { Type } from '@sinclair/typebox';
import {
  listQueryStringSchema,
  PokemonSchema,
  TypeSchema,
} from './schemas/pokemonSchema';
import { TypeEntity } from '../../entities/type.entity';

export const FilterType = Type.Object({
  filter: Type.Partial(
    Type.Object({
      type: Type.String({ description: 'Filter by pokemon type' }),
    }),
  ),
});

const pokenomRoutes: FastifyPluginAsyncTypebox = async function (fastify) {
  fastify.get(
    '/',
    {
      schema: {
        querystring: listQueryStringSchema,
        headers: Type.Object({
          authorization: Type.Optional(Type.String()),
        }),
        response: {
          200: {
            data: Type.Array(PokemonSchema),
          },
        },
      },
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
      preHandler: fastify.auth([
        fastify.allowAnonymous,
        fastify.authorization,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
      ]) as any,
    },
    async (request) => {
      const pokemons = await request.pokemonSource.getList(request);

      return { data: pokemons };
    },
  );

  fastify.get(
    '/:id',
    {
      schema: {
        params: Type.Object({
          id: Type.Number({ description: 'Pokemon Id' }),
        }),
        response: {
          200: {
            data: PokemonSchema,
          },
          404: {
            error: Type.String({ description: 'Pokemon not found' }),
          },
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params;
      const pokemon = await request.pokemonSource.getById(id);
      if (!pokemon) {
        void reply.status(404);
        return { error: 'Pokemon not found' };
      }

      return { data: pokemon };
    },
  );

  fastify.get(
    '/name/:name',
    {
      schema: {
        params: Type.Object({
          name: Type.String({ description: 'Pokemon Name' }),
        }),
        response: {
          200: {
            data: PokemonSchema,
          },
          404: {
            error: Type.String(),
          },
        },
      },
    },
    async (request, reply) => {
      const { name } = request.params;
      const pokemon = await request.pokemonSource.getByName(name);
      if (!pokemon) {
        void reply.status(404);
        return { error: 'Pokemon not found' };
      }

      return { data: pokemon };
    },
  );

  fastify.get(
    '/types',
    {
      schema: {
        response: {
          200: {
            data: Type.Array(TypeSchema),
          },
          404: {
            error: Type.String(),
          },
        },
      },
    },
    async (request) => {
      const types = await request.mikroORM.orm.em.find(TypeEntity, {});
      if (types.length === 0) {
        return { error: 'Types not found' };
      }

      return { data: types };
    },
  );
};

export default pokenomRoutes;
