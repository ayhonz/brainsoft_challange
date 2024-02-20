import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class User {
  @PrimaryKey({ type: 'number' })
  id!: number;

  @Property({ type: 'text' })
  fullName!: string;

  @Property({ type: 'text' })
  email!: string;

  @Property({ type: 'text' })
  password!: string;

  @Property({ type: 'text' })
  bio = '';
}
