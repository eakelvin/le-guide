import { BlogHeader } from "@/components/layout/BlogHeader";

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-canvas text-foreground">
      <BlogHeader />
      {children}
    </div>
  );
}
