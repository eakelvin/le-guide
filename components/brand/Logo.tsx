import type { ComponentProps } from "react";
import { Link } from "@/i18n/navigation";
import { siteConfig } from "@/lib/seo/site";
import { cn } from "@/lib/utils";

const MARK_SIZES = {
  sm: "size-7",
  md: "size-8",
  lg: "size-10",
} as const;

const WORDMARK_SIZES = {
  sm: "text-[18px]",
  md: "text-xl",
  lg: "text-2xl",
} as const;

type LogoProps = {
  className?: string;
  /** Visual size for mark + wordmark. */
  size?: keyof typeof MARK_SIZES;
  /** Light surfaces (default) or dark panels. */
  tone?: "default" | "inverse";
  /** Hide the wordmark and show only the compass mark. */
  markOnly?: boolean;
  /** Wrap in a link. Defaults to `/`. Pass null to render bare content. */
  href?: ComponentProps<typeof Link>["href"] | null;
  onClick?: () => void;
};

export function Logo({
  className,
  size = "sm",
  tone = "default",
  markOnly = false,
  href = "/",
  onClick,
}: LogoProps) {
  const wordmark =
    tone === "inverse" ? (
      <>
        Le<span className="text-forest-400">Guide</span>
      </>
    ) : (
      <>
        Le<span className="text-forest-900">Guide</span>
      </>
    );

  const content = (
    <span
      className={cn(
        "inline-flex items-center gap-2 no-underline",
        tone === "inverse" ? "text-white" : "text-sand-800",
        !href && className,
      )}
    >
      {/* SVG mark from /public — next/image is awkward with small decorative SVGs */}
      <img
        src={siteConfig.logoMarkSvg}
        alt=""
        width={40}
        height={40}
        className={cn("shrink-0 object-contain", MARK_SIZES[size])}
        aria-hidden={markOnly ? undefined : true}
      />
      {markOnly ? (
        <span className="sr-only">{siteConfig.name}</span>
      ) : (
        <span
          className={cn(
            "font-heading font-normal tracking-tight",
            WORDMARK_SIZES[size],
            size === "lg" && "font-serif font-light",
          )}
        >
          {wordmark}
        </span>
      )}
    </span>
  );

  if (!href) return content;

  return (
    <Link
      href={href}
      className={cn("inline-flex no-underline", className)}
      aria-label={siteConfig.name}
      onClick={onClick}
    >
      {content}
    </Link>
  );
}
