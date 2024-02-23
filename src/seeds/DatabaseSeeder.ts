import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import pokemons from './pokemons.json';
import { PokemonClass, PokemonEntity } from '../entities/pokemon.entity';
import { TypeEntity } from '../entities/type.entity';
import { AttackEntity } from '../entities/attack.entity';

interface Pokemon {
  id: string; //
  name: string; //
  classification: string; //
  types: string[]; //
  resistant: string[]; //
  weaknesses: string[]; //
  weight: MaxMin; //
  height: MaxMin; //
  fleeRate: number; //
  evolutionRequirements: EvolutionRequirements; //
  evolutions: Evolution[]; //
  pastEvolutions: Evolution[]; //
  maxCP: number; //
  maxHP: number; //
  attacks: Attacks; //
  LEGENDARY: string;
  MYTHIC: string;
  'Common Capture Area': string;
}

export interface Attacks {
  fast: Attack[];
  special: Attack[];
}

export interface Attack {
  name: string;
  type: string;
  damage: number;
}

export interface EvolutionRequirements {
  amount: number;
  name: string;
}

export interface Evolution {
  id: string;
  name: string;
}

export interface MaxMin {
  minimum: string;
  maximum: string;
}

export class DatabaseSeeder extends Seeder {
  private async findOrCreateType(
    em: EntityManager,
    name: string,
  ): Promise<TypeEntity> {
    let type = await em.findOne(TypeEntity, { name });
    if (!type) {
      type = em.create(TypeEntity, { name });
    }
    return type;
  }
  private async findOrCreateAttack(
    em: EntityManager,
    name: string,
    type: string,
    damage: number,
  ): Promise<AttackEntity> {
    let attack = await em.findOne(AttackEntity, { name });
    if (!attack) {
      const typeEntity = await this.findOrCreateType(em, type);
      attack = em.create(AttackEntity, {
        name,
        type: typeEntity,
        damage,
      });
    }
    return attack;
  }

  async run(em: EntityManager): Promise<void> {
    for (const pokemon of pokemons as Pokemon[]) {
      const pokemonEntity = em.create(PokemonEntity, {
        id: Number(pokemon.id),
        name: pokemon.name,
        classification: pokemon.classification,
        weight: {
          minimum: pokemon.weight.minimum,
          maximum: pokemon.weight.maximum,
        },
        height: {
          minimum: pokemon.height.minimum,
          maximum: pokemon.height.maximum,
        },
        fleeRate: pokemon.fleeRate,
        maxCP: pokemon.maxCP,
        maxHP: pokemon.maxHP,
        EvolutionRequirements: {
          amount: pokemon.evolutionRequirements?.amount,
          name: pokemon.evolutionRequirements?.name,
        },
        evolutions: pokemon.evolutions || [],
        previousEvolutions: pokemon.pastEvolutions || [],
      });

      if (pokemon.LEGENDARY) {
        pokemonEntity.class = PokemonClass.LEGENDARY;
      } else if (pokemon.MYTHIC) {
        pokemonEntity.class = PokemonClass.MYTHIC;
      }

      if (pokemon['Common Capture Area']) {
        pokemonEntity.commonCaptureArea = pokemon['Common Capture Area']
          .split(': ')
          .pop();
      }

      for (const type of pokemon.types) {
        const typeEntity = await this.findOrCreateType(em, type);
        typeEntity.pokemons.add(pokemonEntity);
        pokemonEntity.types.add(typeEntity);
      }

      for (const type of pokemon.weaknesses) {
        const typeEntity = await this.findOrCreateType(em, type);
        typeEntity.pokemonWeaknesses.add(pokemonEntity);
        pokemonEntity.weaknesses.add(typeEntity);
      }

      for (const type of pokemon.resistant) {
        const typeEntity = await this.findOrCreateType(em, type);
        typeEntity.pokemonResistance.add(pokemonEntity);
        pokemonEntity.weaknesses.add(typeEntity);
      }

      for (const attack of pokemon.attacks.fast) {
        const attackEntity = await this.findOrCreateAttack(
          em,
          attack.name,
          attack.type,
          attack.damage,
        );
        pokemonEntity.fastAttack.add(attackEntity);
      }

      for (const attack of pokemon.attacks.special) {
        const attackEntity = await this.findOrCreateAttack(
          em,
          attack.name,
          attack.type,
          attack.damage,
        );
        pokemonEntity.specialAttack.add(attackEntity);
      }
    }
  }
}
