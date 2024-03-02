import { FastifyBaseLogger, FastifyRequest } from 'fastify';
import { PokemonEntity } from '../entities/pokemon.entity';
import { TypeEntity } from '../entities/type.entity';
import { ListingQuery } from '../types';
import { EntityManager } from '@mikro-orm/core';

export class PokemonDataSource {
  private em: EntityManager;
  private logger: FastifyBaseLogger;

  constructor(request: FastifyRequest) {
    this.em = request.mikroORM.orm.em;
    this.logger = request.log;
  }

  private extractTypes(types: string[]) {
    const allTypes: string[] = [];
    for (const type of types) {
      type.split(',').forEach((t) => allTypes.push(t));
    }
    return allTypes.filter((type) => type);
  }

  async getList(req: ListingQuery) {
    const { limit = 10, offset = 0, ...filter } = req.query;
    const allTypes = this.extractTypes(filter.types);

    const whereFilter = {
      types: { name: { $in: allTypes } },
      name: { $ilike: filter.name },
    };

    for (const key in filter) {
      if (Object.prototype.hasOwnProperty.call(filter, key)) {
        const value = filter[key] as string | string[];

        if (!value || (Array.isArray(value) && allTypes.length === 0)) {
          delete whereFilter[key];
        }
      }
    }

    if (filter.favorite && req.user) {
      await req.user.favoritePokemons.init();
      const pokemonIds = req.user.favoritePokemons.getIdentifiers();
      whereFilter['id'] = { $in: pokemonIds };
    }

    const pokemons = await this.em.find(PokemonEntity, whereFilter, {
      populate: [
        'types',
        'specialAttack',
        'fastAttack',
        'specialAttack',
        'weaknesses',
        'resistant',
        'evolutionRequirements',
        'fastAttack.type',
        'specialAttack.type',
      ],
      limit,
      offset,
    });

    return pokemons;
  }
  async getById(id: number) {
    return this.em.findOne(
      PokemonEntity,
      { id },
      {
        populate: [
          'types',
          'specialAttack',
          'fastAttack',
          'specialAttack',
          'weaknesses',
          'resistant',
          'evolutionRequirements',
          'fastAttack.type',
          'specialAttack.type',
        ],
      },
    );
  }

  async getByName(name: string) {
    return this.em.findOne(
      PokemonEntity,
      { name: { $ilike: name } },
      {
        populate: [
          'types',
          'specialAttack',
          'fastAttack',
          'specialAttack',
          'weaknesses',
          'resistant',
          'evolutionRequirements',
          'fastAttack.type',
          'specialAttack.type',
        ],
      },
    );
  }
  async getTypes() {
    return this.em.find(TypeEntity, {});
  }
}
