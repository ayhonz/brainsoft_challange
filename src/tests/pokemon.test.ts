import { FastifyInstance } from 'fastify';
import { build } from '../app';

let app: FastifyInstance;
beforeEach(async () => {
  app = await build({});
  await app.ready();
});
afterEach(async () => {
  await app.close();
});

describe('Pokemon', () => {
  test('/pokemons returns list of pokemons', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/pokemons',
    });
    const data: { data: any[] } = response.json();

    expect(response.statusCode).toBe(200);
    expect(data.data.length).toBe(10);
  });

  test('/pokemons returns list of pokemons according to set limit', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/pokemons',
      query: {
        limit: '5',
      },
    });
    const data: { data: any[] } = response.json();

    expect(response.statusCode).toBe(200);
    expect(data.data.length).toBe(5);
  });

  test('/pokemons return list of pokemons with specified name', async () => {
    const pokemonName = 'Bulbasaur';
    const response = await app.inject({
      method: 'GET',
      url: '/pokemons',
      query: {
        name: pokemonName,
      },
    });
    const data: { data: any[] } = response.json();

    expect(response.statusCode).toBe(200);
    expect(data.data.length).toBe(1);

    expect(data.data).toContainEqual(
      expect.objectContaining({ name: pokemonName }),
    );
  });

  test('/pokemons return list of pokemons with specified type', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/pokemons',
      query: {
        types: 'Grass',
      },
    });

    const data: { data: any[] } = response.json();

    expect(response.statusCode).toBe(200);
    expect(data.data.length).toBe(10);
    data.data.forEach((obj) => {
      expect(obj).toEqual(
        expect.objectContaining({
          types: expect.arrayContaining([
            expect.objectContaining({ name: 'Grass' }),
          ]),
        }),
      );
    });
  });

  test('/pokemons returns empty list if filter does not match anything', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/pokemons',
      query: {
        types: 'Grass',
        name: 'not-existing-pokemon',
      },
    });

    const data: { data: any[] } = response.json();

    expect(response.statusCode).toBe(200);
    expect(data.data.length).toBe(0);
  });

  test('/pokemons/:id returns pokemon by id', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/pokemons/1',
    });

    const data: { data: any } = response.json();

    expect(response.statusCode).toBe(200);
    expect(data.data).toEqual(expect.objectContaining({ id: 1 }));
  });

  test('/pokemons/:id returns 404 non existing pokemon', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/pokemons/424242',
    });

    expect(response.statusCode).toBe(404);
  });

  test('/pokemons/name/:name returns pokemon by name', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/pokemons/name/Bulbasaur',
    });

    const data: { data: any } = response.json();

    expect(response.statusCode).toBe(200);
    expect(data.data).toEqual(expect.objectContaining({ name: 'Bulbasaur' }));
  });

  test('/pokemons/name/:name is case insensitive', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/pokemons/name/bulbasaur',
    });

    const data: { data: any } = response.json();

    expect(response.statusCode).toBe(200);
    expect(data.data).toEqual(expect.objectContaining({ name: 'Bulbasaur' }));
  });

  test('/pokemons/name/:name return 404 for non existing name', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/pokemons/name/Tav',
    });

    expect(response.statusCode).toBe(404);
  });

  test('/pokemons/types returns list of all types', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/pokemons/types',
    });

    const data: { data: any } = response.json();

    expect(response.statusCode).toBe(200);

    expect(data.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: expect.any(String),
        }),
      ]),
    );
  });
});
