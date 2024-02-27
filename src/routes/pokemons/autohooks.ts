import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import fp from 'fastify-plugin';
import { PokemonDataSource } from '../../dataSources/pokemonDataSource';

const pokemonAutoHooks: FastifyPluginAsyncTypebox = async function (fastify) {
  fastify.decorateRequest('pokemonSource', null);

  fastify.addHook('onRequest', async (request) => {
    fastify.log.info('onRequest');
    request.pokemonSource = new PokemonDataSource(request);
  });
};

export default fp(pokemonAutoHooks, {
  name: 'pokemon-store',
});
