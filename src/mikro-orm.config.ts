import { Migrator } from '@mikro-orm/migrations';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { defineConfig } from '@mikro-orm/postgresql';
import { SeedManager } from '@mikro-orm/seeder';

export default defineConfig({
  entities: ['dist/entities/**/*.js'],
  entitiesTs: ['src/entities/**/*.ts'],
  password: process.env.POSTGRES_PASSWORD,
  user: process.env.POSTGRES_USER,
  port: Number(process.env.POSTGRES_PORT),
  host: process.env.POSTGRES_HOST,
  dbName: 'pokemon',
  metadataProvider: TsMorphMetadataProvider,
  extensions: [SeedManager, Migrator],
  migrations: {
    path: 'dist/migrations',
    pathTs: 'src/migrations',
    emit: 'ts',
  },
  seeder: {
    pathTs: 'src/seeds',
    path: 'dist/seeds',
    defaultSeeder: 'DatabaseSeeder',
    glob: '!(*.d).{js,ts}', // how to match seeder files (all .js and .ts files, but not .d.ts)
    emit: 'ts',
    fileName: (className: string) => className, // seeder file naming convention
  },
});
