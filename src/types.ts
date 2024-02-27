import { MikroORM } from '@mikro-orm/core';
import { PokemonDataSource } from './dataSources/pokemonDataSource';
import { Static } from '@sinclair/typebox';
import { listQueryStringSchema } from './routes/pokemons/schemas/pokemonSchema';

export type Awaited<T> = T extends PromiseLike<infer U> ? Awaited<U> : T;
export type ListingQuery = Static<typeof listQueryStringSchema>;

declare module 'fastify' {
  interface FastifyInstance {
    config: {
      PORT: number;
      HOST: string;
      POSTGRES_HOST: string;
      POSTGRES_USER: string;
      POSTGRES_PASSWORD: string;
      POSTGRES_PORT: number;
      NODE_ENV: string;
    };
    mikroORM: {
      orm: Awaited<ReturnType<(typeof MikroORM)['init']>>;
    };
  }
  interface FastifyRequest {
    mikroORM: {
      orm: Awaited<ReturnType<(typeof MikroORM)['init']>>;
    };
    pokemonSource: PokemonDataSource;
  }
}
