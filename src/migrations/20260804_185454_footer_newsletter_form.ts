import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "footer" ALTER COLUMN "copyright" SET DEFAULT '© 2026 dossier.';
  ALTER TABLE "footer" ADD COLUMN "newsletter_form_id" integer;
  ALTER TABLE "footer" ADD CONSTRAINT "footer_newsletter_form_id_forms_id_fk" FOREIGN KEY ("newsletter_form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "footer_newsletter_newsletter_form_idx" ON "footer" USING btree ("newsletter_form_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "footer" DROP CONSTRAINT "footer_newsletter_form_id_forms_id_fk";
  
  DROP INDEX "footer_newsletter_newsletter_form_idx";
  ALTER TABLE "footer" ALTER COLUMN "copyright" SET DEFAULT '© 2026 TechBlog LLC.';
  ALTER TABLE "footer" DROP COLUMN "newsletter_form_id";`)
}
