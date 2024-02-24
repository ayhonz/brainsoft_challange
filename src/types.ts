import { MikroORM } from '@mikro-orm/core';

export type Awaited<T> = T extends PromiseLike<infer U> ? Awaited<U> : T;

declare module 'fastify' {
  interface FastifyInstance {
    config: {
      PORT: number;
      HOST: string;
      POSTGRES_HOST: string;
      POSTGRES_USER: string;
      POSTGRES_PASSWORD: string;
      POSTGRES_PORT: number;
    };
    mikroORM: {
      orm: Awaited<ReturnType<(typeof MikroORM)['init']>>;
    };
  }
  interface FastifyRequest {
    mikroORM: {
      orm: Awaited<ReturnType<(typeof MikroORM)['init']>>;
    };
  }
}
