import {
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { PokemonEntity } from './pokemon.entity';
import { TypeEntity } from './type.entity';
import { BaseEntity } from './base.entity';

@Entity()
export class AttackEntity extends BaseEntity {
  @PrimaryKey({ autoincrement: true })
  id!: number;

  @Property({ unique: true })
  name!: string;

  @ManyToOne()
  type!: TypeEntity;

  @Property()
  damage!: number;

  @ManyToMany({ mappedBy: 'fastAttack' })
  fast: PokemonEntity;

  @ManyToMany({ mappedBy: 'specialAttack' })
  special: PokemonEntity;
}
