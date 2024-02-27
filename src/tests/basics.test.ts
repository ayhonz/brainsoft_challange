import { FastifyInstance } from 'fastify';
import { build } from '../app';

describe('Basics', () => {
  let app: FastifyInstance;
  beforeEach(async () => {
    app = await build({});
    await app.ready();
  });

  afterEach(async () => {
    await app.close();
  });

  test('The application should start', async () => {
    const app = await build({});
    await app.ready();
    await app.close();

    return;
  });
  test('The application has base route available', async () => {
    await app.ready();
    const response = await app.inject({
      method: 'GET',
      url: '/',
    });
    expect(response.statusCode).toBe(200);
    expect(response.json()).toMatchObject({ root: true });
  });
});
