import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "share_count" numeric DEFAULT 0;
    ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "video_url" varchar;
    ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "video_news" boolean DEFAULT false;

    ALTER TABLE "_posts_v" ADD COLUMN IF NOT EXISTS "version_share_count" numeric DEFAULT 0;
    ALTER TABLE "_posts_v" ADD COLUMN IF NOT EXISTS "version_video_url" varchar;
    ALTER TABLE "_posts_v" ADD COLUMN IF NOT EXISTS "version_video_news" boolean DEFAULT false;

    ALTER TABLE "header" ADD COLUMN IF NOT EXISTS "header_ad_image_id" integer;
    ALTER TABLE "header" ADD COLUMN IF NOT EXISTS "header_ad_url" varchar;
    ALTER TABLE "header" ADD COLUMN IF NOT EXISTS "sidebar_ad_image_id" integer;
    ALTER TABLE "header" ADD COLUMN IF NOT EXISTS "sidebar_ad_url" varchar;

    DO $$ BEGIN
      ALTER TABLE "header" ADD CONSTRAINT "header_header_ad_image_id_media_id_fk"
        FOREIGN KEY ("header_ad_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "header" ADD CONSTRAINT "header_sidebar_ad_image_id_media_id_fk"
        FOREIGN KEY ("sidebar_ad_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    CREATE INDEX IF NOT EXISTS "header_header_ad_image_idx" ON "header" USING btree ("header_ad_image_id");
    CREATE INDEX IF NOT EXISTS "header_sidebar_ad_image_idx" ON "header" USING btree ("sidebar_ad_image_id");

    DROP TABLE IF EXISTS "_funding_rounds_v_version_investors" CASCADE;
    DROP TABLE IF EXISTS "_funding_rounds_v" CASCADE;
    DROP TABLE IF EXISTS "funding_rounds_investors" CASCADE;
    DROP TABLE IF EXISTS "funding_rounds" CASCADE;
    DROP TABLE IF EXISTS "funding_news" CASCADE;
    DROP TYPE IF EXISTS "enum_funding_rounds_series";
    DROP TYPE IF EXISTS "enum_funding_rounds_status";
    DROP TYPE IF EXISTS "enum__funding_rounds_v_version_series";
    DROP TYPE IF EXISTS "enum__funding_rounds_v_version_status";
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "posts" DROP COLUMN IF EXISTS "share_count";
    ALTER TABLE "posts" DROP COLUMN IF EXISTS "video_url";
    ALTER TABLE "posts" DROP COLUMN IF EXISTS "video_news";

    ALTER TABLE "_posts_v" DROP COLUMN IF EXISTS "version_share_count";
    ALTER TABLE "_posts_v" DROP COLUMN IF EXISTS "version_video_url";
    ALTER TABLE "_posts_v" DROP COLUMN IF EXISTS "version_video_news";

    ALTER TABLE "header" DROP CONSTRAINT IF EXISTS "header_header_ad_image_id_media_id_fk";
    ALTER TABLE "header" DROP CONSTRAINT IF EXISTS "header_sidebar_ad_image_id_media_id_fk";
    DROP INDEX IF EXISTS "header_header_ad_image_idx";
    DROP INDEX IF EXISTS "header_sidebar_ad_image_idx";
    ALTER TABLE "header" DROP COLUMN IF EXISTS "header_ad_image_id";
    ALTER TABLE "header" DROP COLUMN IF EXISTS "header_ad_url";
    ALTER TABLE "header" DROP COLUMN IF EXISTS "sidebar_ad_image_id";
    ALTER TABLE "header" DROP COLUMN IF EXISTS "sidebar_ad_url";
  `)
}
