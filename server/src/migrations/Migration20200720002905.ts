import { Migration } from '@mikro-orm/migrations';

export class Migration20200720002905 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "template" ("id" uuid not null, "title" text not null, "sections" jsonb not null);');
    this.addSql('alter table "template" add constraint "template_pkey" primary key ("id");');
  }

}
