/**
 * Seed guide posts into Supabase for each supported locale.
 *
 * Usage:
 *   npm run seed:guides
 *   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npm run seed:guides
 *
 * Sources:
 *   - lib/data/guides.en.json → locale `en`
 *   - lib/data/guides.fr.json → locale `fr`
 *
 * Requires `SUPABASE_SERVICE_ROLE_KEY` (service role, not anon key).
 */

import { createClient } from "@supabase/supabase-js";
import guidesEn from "@/lib/data/guides.en.json";
import guidesFr from "@/lib/data/guides.fr.json";
import type { BlogPost, GuidesFile } from "@/types/blog";

type SeedLocale = "en" | "fr";

const LOCALES: { locale: SeedLocale; file: GuidesFile }[] = [
  { locale: "en", file: guidesEn as GuidesFile },
  { locale: "fr", file: guidesFr as GuidesFile },
];

const supabaseUrl =
  process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  console.error("Missing SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL).");
  process.exit(1);
}
if (!serviceRoleKey) {
  console.error(
    "Missing SUPABASE_SERVICE_ROLE_KEY. This script writes past RLS — you need the service role key, not the publishable key.",
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const nullable = (value: string | undefined): string | null => {
  if (value == null) return null;
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
};

function toRow(locale: SeedLocale, post: BlogPost) {
  return {
    slug: post.slug,
    locale,
    kind: post.kind === "checklist" ? "checklist" : "editorial",
    title: post.title,
    excerpt: post.excerpt,
    category: post.category,
    reading_minutes: post.readingMinutes,
    updated_on: post.updated,
    sections: post.sections ?? [],
    recommendation: nullable(post.recommendation),
    warning: nullable(post.warning),
    updated_at: new Date().toISOString(),
  };
}

async function seedLocale(locale: SeedLocale, file: GuidesFile) {
  const rows = file.posts.map((p) => toRow(locale, p));
  console.log(`Seeding ${rows.length} guide posts for locale=${locale}…`);

  const { error } = await supabase.from("guide_posts").upsert(rows, {
    onConflict: "slug,locale",
  });

  if (error) {
    console.error(`Failed upsert for ${locale}:`, error.message);
    process.exit(1);
  }

  console.log(`  ✓ ${locale}: ${rows.length} posts upserted`);
}

async function main() {
  for (const { locale, file } of LOCALES) {
    await seedLocale(locale, file);
  }
  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
