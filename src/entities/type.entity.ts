import {
  Collection,
  Entity,
  ManyToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { PokemonEntity } from './pokemon.entity';
import { BaseEntity } from './base.entity';

@Entity()
export class TypeEntity extends BaseEntity {
  @PrimaryKey({ autoincrement: true })
  id!: number;

  @Property({ unique: true })
  name!: string;

  @ManyToMany({ mappedBy: 'types' })
  pokemons = new Collection<PokemonEntity>(this);

  @ManyToMany({ mappedBy: 'resistant' })
  pokemonResistance = new Collection<PokemonEntity>(this);

  @ManyToMany({ mappedBy: 'weaknesses' })
  pokemonWeaknesses = new Collection<PokemonEntity>(this);
}
