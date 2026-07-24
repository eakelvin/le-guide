import { Link } from "@/i18n/navigation";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { BlogPost } from "@/types/blog";

type RelatedGuidesProps = {
  posts: BlogPost[];
  title: string;
};

export function RelatedGuides({ posts, title }: RelatedGuidesProps) {
  if (posts.length === 0) return null;

  return (
    <section className="mt-12 border-t border-sand-100 pt-8" aria-labelledby="related-guides-heading">
      <h2 id="related-guides-heading" className="font-heading text-lg font-medium text-sand-800">
        {title}
      </h2>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link href={`/guides/${post.slug}`} className="group block no-underline">
              <Card className="h-full transition-[box-shadow,transform] hover:-translate-y-px hover:shadow-md">
                <CardHeader className="space-y-2 p-4">
                  <CardTitle className="font-heading text-base font-medium leading-snug text-sand-800 group-hover:text-forest-900">
                    {post.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-2 text-sm leading-relaxed text-sand-600">
                    {post.excerpt}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
