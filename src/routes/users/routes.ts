import {
  type FastifyPluginAsyncTypebox,
  Type,
} from '@fastify/type-provider-typebox';
import { UniqueConstraintViolationException } from '@mikro-orm/core';
import { PokemonEntity } from '../../entities/pokemon.entity';

const usersRoutes: FastifyPluginAsyncTypebox = async function (fastify) {
  fastify.put(
    '/favorites/:pokemonId',
    {
      schema: {
        params: Type.Object({
          pokemonId: Type.Number({ description: 'Pokemon Id' }),
        }),
        headers: Type.Object({
          authorization: Type.String(),
        }),
        response: {
          200: {
            success: Type.Boolean(),
          },
          404: {
            message: Type.String(),
          },
        },
      },
      preHandler: fastify.auth([fastify.authorization]) as any, // eslint-disable-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
    },
    async (request, reply) => {
      try {
        const { pokemonId } = request.params;
        request.log.info('Adding favorite');
        request.log.info(request.params);
        const pokemon = await request.mikroORM.orm.em.findOne(
          PokemonEntity,
          pokemonId,
        );

        if (!pokemon) {
          void reply.status(404);
          return { message: 'Pokemon not found' };
        }
        request.user.favoritePokemons.add(pokemon);

        await request.mikroORM.orm.em.persistAndFlush(request.user);

        void reply.status(201);
        return { success: true };
      } catch (error: unknown) {
        if (error instanceof UniqueConstraintViolationException) {
          void reply.status(409);
          return { message: 'Pokemon already favorited' };
        }

        request.log.error(error);

        void reply.status(500);
        return { message: 'Error adding favorite' };
      }
    },
  );

  fastify.delete(
    '/favorites/:pokemonId',
    {
      schema: {
        params: Type.Object({
          pokemonId: Type.Number(),
        }),
        headers: Type.Object({
          authorization: Type.String(),
        }),
        response: {
          200: {
            success: Type.Boolean(),
          },
          404: {
            message: Type.String(),
          },
        },
      },
      preHandler: fastify.auth([fastify.authorization]) as any, // eslint-disable-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
    },
    async (request, reply) => {
      try {
        const { pokemonId } = request.params;

        await request.user.favoritePokemons.init();
        const favoriteForDeletion = request.user.favoritePokemons.find(
          (f) => f.id === pokemonId,
        );

        if (!favoriteForDeletion) {
          void reply.status(404);
          return { message: 'Favorite not found' };
        }
        request.user.favoritePokemons.remove(favoriteForDeletion);

        await request.mikroORM.orm.em.persistAndFlush(request.user);
        return { success: true };
      } catch (error: unknown) {
        request.log.error(error);

        void reply.status(500);
        return;
      }
    },
  );
};

export default usersRoutes;
