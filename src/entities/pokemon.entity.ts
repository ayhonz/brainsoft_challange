import {
  Collection,
  Embeddable,
  Embedded,
  Entity,
  Enum,
  ManyToMany,
  PrimaryKey,
  Property,
  t,
} from '@mikro-orm/core';
import { TypeEntity } from './type.entity';
import { AttackEntity } from './attack.entity';

export enum PokemonClass {
  LEGENDARY = 'legendary',
  MYTHIC = 'mythic',
}

@Embeddable()
export class EvolutionRequirements {
  @Property()
  amount?: number;

  @Property()
  name?: string;
}

@Embeddable()
export class Height {
  @Property()
  minimum!: string;

  @Property()
  maximum!: string;
}

@Embeddable()
export class Weight {
  @Property()
  minimum!: string;

  @Property()
  maximum!: string;
}

@Embeddable()
export class Evolution {
  @Property()
  id!: number;

  @Property()
  name!: string;
}

@Entity()
export class PokemonEntity {
  @PrimaryKey({ unique: true })
  id!: number;

  @Property()
  name!: string;

  @Property()
  classification?: string;

  @ManyToMany()
  types = new Collection<TypeEntity>(this);

  @ManyToMany()
  resistant = new Collection<TypeEntity>(this);

  @ManyToMany()
  weaknesses = new Collection<TypeEntity>(this);

  @Embedded()
  height!: Height;

  @Property({ type: t.float })
  fleeRate!: number;

  @Embedded()
  weight!: Weight;

  @Embedded(() => EvolutionRequirements, { object: true })
  EvolutionRequirements?: EvolutionRequirements;

  @Embedded(() => Evolution, { array: true })
  evolutions?: Evolution[];

  @Embedded(() => Evolution, { array: true })
  previousEvolutions?: Evolution[];

  @Property()
  maxCP!: number;

  @Property()
  maxHP!: number;

  @ManyToMany()
  fastAttack = new Collection<AttackEntity>(this);

  @ManyToMany()
  specialAttack = new Collection<AttackEntity>(this);

  @Property()
  commonCaptureArea?: string;

  @Enum({ items: () => PokemonClass, nullable: true })
  class?: PokemonClass;
}
