import { FastifyInstance } from 'fastify';
import { build } from '../app';
import { UserEntity } from '../entities/user.entity';
import { EntityManager } from '@mikro-orm/core';

let app: FastifyInstance;
let em: EntityManager;
beforeEach(async () => {
  app = await build({});
  await app.ready();
  em = app.mikroORM.orm.em.fork();

  const user = em.create(UserEntity, {
    authToken: 'testUserToken',
  });
  await em.persistAndFlush(user);
});
afterEach(async () => {
  await em.nativeDelete(UserEntity, {
    authToken: 'testUserToken',
  });

  await app.close();
});

describe('User', () => {
  test('PUT /users/favorites/:pokemonId', async () => {
    const response = await app.inject({
      method: 'PUT',
      url: '/users/favorites/1',
      headers: {
        authorization: 'Bearer testUserToken',
      },
    });

    const data: { success: boolean } = response.json();
    expect(response.statusCode).toBe(201);
    expect(data.success).toBe(true);

    const userFavorites = await app.mikroORM.orm.em.findOne(
      UserEntity,
      {
        authToken: 'testUserToken',
      },
      { populate: ['favoritePokemons'] },
    );
    expect(userFavorites?.favoritePokemons).toHaveLength(1);
    expect(userFavorites?.favoritePokemons[0].id).toBe(1);
  });
  test('DELETE /users/favorites/:pokemonId', async () => {
    for (const id of [1, 2, 3]) {
      await app.inject({
        method: 'PUT',
        url: `/users/favorites/${id}`,
        headers: {
          authorization: 'Bearer testUserToken',
        },
      });
    }

    let userFavorites = await app.mikroORM.orm.em.findOne(
      UserEntity,
      {
        authToken: 'testUserToken',
      },
      { populate: ['favoritePokemons'] },
    );
    expect(userFavorites?.favoritePokemons).toHaveLength(3);

    await app.inject({
      method: 'DELETE',
      url: '/users/favorites/2',
      headers: {
        authorization: 'Bearer testUserToken',
      },
    });

    userFavorites = await app.mikroORM.orm.em.findOne(
      UserEntity,
      {
        authToken: 'testUserToken',
      },
      { populate: ['favoritePokemons'] },
    );

    expect(userFavorites?.favoritePokemons).toHaveLength(2);
    expect(userFavorites?.favoritePokemons.map((p) => p.id)).toEqual([1, 3]);
  });
});
