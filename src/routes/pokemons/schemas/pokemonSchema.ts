import { Type } from '@sinclair/typebox';

export const TypeSchema = Type.Object({
  name: Type.String(),
});

export const AttackSchema = Type.Object({
  name: Type.String(),
  type: TypeSchema,
  damage: Type.Number(),
});

export const PokemonSchema = Type.Object({
  id: Type.Number(),
  name: Type.String(),
  classification: Type.String(),
  class: Type.String(),
  types: Type.Array(TypeSchema),
  height: Type.Object({
    minimum: Type.String(),
    maximum: Type.String(),
  }),
  weight: Type.Object({
    minimum: Type.String(),
    maximum: Type.String(),
  }),
  fleeRate: Type.Number(),
  maxCP: Type.Number(),
  maxHP: Type.Number(),
  weaknesses: Type.Array(TypeSchema),
  resistant: Type.Array(TypeSchema),
  fastAttack: Type.Array(AttackSchema),
  specialAttack: Type.Array(AttackSchema),
  commonCaptureArea: Type.String(),
  EvolutionRequirements: Type.Object({
    amount: Type.Optional(Type.Number()),
    name: Type.Optional(Type.String()),
  }),
  evolutions: Type.Array(
    Type.Optional(
      Type.Object({
        id: Type.Number(),
        name: Type.String(),
      }),
    ),
  ),
  previousEvolutions: Type.Array(
    Type.Optional(
      Type.Object({
        id: Type.Number(),
        name: Type.String(),
      }),
    ),
  ),
});

export const listQueryStringSchema = Type.Partial(
  Type.Object({
    types: Type.Array(Type.String(), { default: [] }),
    name: Type.String({ description: 'Filter by pokemon name', default: '' }),
    limit: Type.Number({ description: 'Pagination limit' }),
    offset: Type.Number({ description: 'Pagination offset' }),
  }),
);
