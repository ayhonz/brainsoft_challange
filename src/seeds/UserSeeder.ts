import { Seeder } from '@mikro-orm/seeder';
import { UserEntity } from '../entities/user.entity';
import { EntityManager } from '@mikro-orm/core';

export class UserSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    em.create(UserEntity, {
      authToken: 'user01',
    });
  }
}
