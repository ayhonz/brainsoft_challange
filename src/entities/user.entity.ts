import {
  Collection,
  Entity,
  ManyToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/postgresql';
import { BaseEntity } from './base.entity';
import { PokemonEntity } from './pokemon.entity';

@Entity()
export class UserEntity extends BaseEntity {
  @PrimaryKey()
  id!: number;

  @Property()
  authToken!: string;

  @ManyToMany()
  favoritePokemons = new Collection<PokemonEntity>(this);
}
