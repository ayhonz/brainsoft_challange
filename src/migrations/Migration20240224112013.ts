import { Migration } from '@mikro-orm/migrations';

export class Migration20240224112013 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "pokemon_entity" ("id" serial primary key, "name" varchar(255) not null, "classification" varchar(255) null, "height_minimum" varchar(255) not null, "height_maximum" varchar(255) not null, "flee_rate" real not null, "weight_minimum" varchar(255) not null, "weight_maximum" varchar(255) not null, "evolution_requirements" jsonb null, "evolutions" jsonb null, "previous_evolutions" jsonb null, "max_cp" int not null, "max_hp" int not null, "common_capture_area" varchar(255) null, "class" text check ("class" in (\'legendary\', \'mythic\')) null);');

    this.addSql('create table "type_entity" ("id" serial primary key, "name" varchar(255) not null);');
    this.addSql('alter table "type_entity" add constraint "type_entity_name_unique" unique ("name");');

    this.addSql('create table "pokemon_entity_weaknesses" ("pokemon_entity_id" int not null, "type_entity_id" int not null, constraint "pokemon_entity_weaknesses_pkey" primary key ("pokemon_entity_id", "type_entity_id"));');

    this.addSql('create table "pokemon_entity_types" ("pokemon_entity_id" int not null, "type_entity_id" int not null, constraint "pokemon_entity_types_pkey" primary key ("pokemon_entity_id", "type_entity_id"));');

    this.addSql('create table "pokemon_entity_resistant" ("pokemon_entity_id" int not null, "type_entity_id" int not null, constraint "pokemon_entity_resistant_pkey" primary key ("pokemon_entity_id", "type_entity_id"));');

    this.addSql('create table "attack_entity" ("id" serial primary key, "name" varchar(255) not null, "type_id" int not null, "damage" int not null);');
    this.addSql('alter table "attack_entity" add constraint "attack_entity_name_unique" unique ("name");');

    this.addSql('create table "pokemon_entity_special_attack" ("pokemon_entity_id" int not null, "attack_entity_id" int not null, constraint "pokemon_entity_special_attack_pkey" primary key ("pokemon_entity_id", "attack_entity_id"));');

    this.addSql('create table "pokemon_entity_fast_attack" ("pokemon_entity_id" int not null, "attack_entity_id" int not null, constraint "pokemon_entity_fast_attack_pkey" primary key ("pokemon_entity_id", "attack_entity_id"));');

    this.addSql('alter table "pokemon_entity_weaknesses" add constraint "pokemon_entity_weaknesses_pokemon_entity_id_foreign" foreign key ("pokemon_entity_id") references "pokemon_entity" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "pokemon_entity_weaknesses" add constraint "pokemon_entity_weaknesses_type_entity_id_foreign" foreign key ("type_entity_id") references "type_entity" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "pokemon_entity_types" add constraint "pokemon_entity_types_pokemon_entity_id_foreign" foreign key ("pokemon_entity_id") references "pokemon_entity" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "pokemon_entity_types" add constraint "pokemon_entity_types_type_entity_id_foreign" foreign key ("type_entity_id") references "type_entity" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "pokemon_entity_resistant" add constraint "pokemon_entity_resistant_pokemon_entity_id_foreign" foreign key ("pokemon_entity_id") references "pokemon_entity" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "pokemon_entity_resistant" add constraint "pokemon_entity_resistant_type_entity_id_foreign" foreign key ("type_entity_id") references "type_entity" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "attack_entity" add constraint "attack_entity_type_id_foreign" foreign key ("type_id") references "type_entity" ("id") on update cascade;');

    this.addSql('alter table "pokemon_entity_special_attack" add constraint "pokemon_entity_special_attack_pokemon_entity_id_foreign" foreign key ("pokemon_entity_id") references "pokemon_entity" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "pokemon_entity_special_attack" add constraint "pokemon_entity_special_attack_attack_entity_id_foreign" foreign key ("attack_entity_id") references "attack_entity" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "pokemon_entity_fast_attack" add constraint "pokemon_entity_fast_attack_pokemon_entity_id_foreign" foreign key ("pokemon_entity_id") references "pokemon_entity" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "pokemon_entity_fast_attack" add constraint "pokemon_entity_fast_attack_attack_entity_id_foreign" foreign key ("attack_entity_id") references "attack_entity" ("id") on update cascade on delete cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "pokemon_entity_weaknesses" drop constraint "pokemon_entity_weaknesses_pokemon_entity_id_foreign";');

    this.addSql('alter table "pokemon_entity_types" drop constraint "pokemon_entity_types_pokemon_entity_id_foreign";');

    this.addSql('alter table "pokemon_entity_resistant" drop constraint "pokemon_entity_resistant_pokemon_entity_id_foreign";');

    this.addSql('alter table "pokemon_entity_special_attack" drop constraint "pokemon_entity_special_attack_pokemon_entity_id_foreign";');

    this.addSql('alter table "pokemon_entity_fast_attack" drop constraint "pokemon_entity_fast_attack_pokemon_entity_id_foreign";');

    this.addSql('alter table "pokemon_entity_weaknesses" drop constraint "pokemon_entity_weaknesses_type_entity_id_foreign";');

    this.addSql('alter table "pokemon_entity_types" drop constraint "pokemon_entity_types_type_entity_id_foreign";');

    this.addSql('alter table "pokemon_entity_resistant" drop constraint "pokemon_entity_resistant_type_entity_id_foreign";');

    this.addSql('alter table "attack_entity" drop constraint "attack_entity_type_id_foreign";');

    this.addSql('alter table "pokemon_entity_special_attack" drop constraint "pokemon_entity_special_attack_attack_entity_id_foreign";');

    this.addSql('alter table "pokemon_entity_fast_attack" drop constraint "pokemon_entity_fast_attack_attack_entity_id_foreign";');

    this.addSql('drop table if exists "pokemon_entity" cascade;');

    this.addSql('drop table if exists "type_entity" cascade;');

    this.addSql('drop table if exists "pokemon_entity_weaknesses" cascade;');

    this.addSql('drop table if exists "pokemon_entity_types" cascade;');

    this.addSql('drop table if exists "pokemon_entity_resistant" cascade;');

    this.addSql('drop table if exists "attack_entity" cascade;');

    this.addSql('drop table if exists "pokemon_entity_special_attack" cascade;');

    this.addSql('drop table if exists "pokemon_entity_fast_attack" cascade;');
  }

}
