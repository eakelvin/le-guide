"use client";

import type { AppUser } from "@/features/auth/user";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { UserMenu } from "@/components/layout/UserMenu";
import { LocaleSwitcher } from "@/components/layout/LocaleSwitcher";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";

export function Navbar({ initialUser }: { initialUser: AppUser | null }) {
    const t = useTranslations("nav");
    const tCommon = useTranslations("common");
    const [user] = useState<AppUser | null>(initialUser);
    const [mobileOpen, setMobileOpen] = useState(false);
    const closeMobile = () => setMobileOpen(false);

    const mobileLinks = [
        { href: "/guides" as const, label: t("guides") },
        { href: "#contact" as const, label: t("contact") },
    ];

    return (
        <>
            <nav className="fixed top-0 left-0 right-0 z-50 flex h-14 items-center justify-between border-b border-border bg-background/90 px-4 backdrop-blur-md supports-[backdrop-filter]:bg-background/75 md:h-[60px] md:px-12">
                <Logo size="sm" onClick={closeMobile} />
                <div className="flex items-center gap-2 md:gap-7">
                    <div className="hidden items-center gap-7 md:flex">
                        <a
                            href="#processes"
                            className="text-[13.5px] text-sand-600 transition-colors no-underline hover:text-sand-800"
                        >
                            {t("processes")}
                        </a>
                        <a
                            href="#how"
                            className="text-[13.5px] text-sand-600 transition-colors no-underline hover:text-sand-800"
                        >
                            {t("howItWorks")}
                        </a>
                        <a
                            href="#faq"
                            className="text-[13.5px] text-sand-600 transition-colors no-underline hover:text-sand-800"
                        >
                            {t("faq")}
                        </a>
                        <a
                            href="#contact"
                            className="text-[13.5px] text-sand-600 transition-colors no-underline hover:text-sand-800"
                        >
                            {t("contact")}
                        </a>
                        <Link
                            href="/guides"
                            className="text-[13.5px] text-sand-600 transition-colors no-underline hover:text-sand-800"
                        >
                            {t("guides")}
                        </Link>
                    </div>
                    <LocaleSwitcher variant="pill" />
                    {user ? (
                        <div className="flex items-center gap-2 sm:gap-3">
                            <Button
                                size="sm"
                                variant="outline"
                                className="hidden rounded-full border-sand-200 bg-transparent px-4 text-[13px] text-sand-800 shadow-none hover:bg-card sm:inline-flex"
                                asChild
                            >
                                <Link href="/dashboard">{t("dashboard")}</Link>
                            </Button>
                            <UserMenu name={user.name} email={user.email} imageUrl={user.imageUrl} />
                        </div>
                    ) : (
                        <Button
                            size="sm"
                            className="hidden rounded-full bg-forest-900 px-5 text-[13px] text-white hover:bg-forest-800 md:inline-flex"
                            asChild
                        >
                            <Link href="/dashboard">{t("startFree")}</Link>
                        </Button>
                    )}
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-9 shrink-0 text-sand-700 md:hidden"
                        aria-expanded={mobileOpen}
                        aria-controls="mobile-nav-menu"
                        aria-label={mobileOpen ? tCommon("closeMenu") : tCommon("openMenu")}
                        onClick={() => setMobileOpen((open) => !open)}
                    >
                        {mobileOpen ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
                    </Button>
                </div>
            </nav>

            <div
                id="mobile-nav-menu"
                className={cn(
                    "fixed inset-x-0 top-14 z-40 border-b border-border bg-background/95 px-6 py-4 backdrop-blur-md transition-[opacity,visibility] duration-200 md:hidden supports-[backdrop-filter]:bg-background/90",
                    mobileOpen ? "visible opacity-100" : "invisible opacity-0 pointer-events-none",
                )}
            >
                <nav className="flex flex-col gap-1">
                    {mobileLinks.map(({ href, label }) =>
                        href.startsWith("#") ? (
                            <a
                                key={href}
                                href={href}
                                className="rounded-md px-2 py-3 text-[15px] font-medium text-sand-800 no-underline transition-colors hover:bg-sand-50"
                                onClick={closeMobile}
                            >
                                {label}
                            </a>
                        ) : (
                            <Link
                                key={href}
                                href={href}
                                className="rounded-md px-2 py-3 text-[15px] font-medium text-sand-800 no-underline transition-colors hover:bg-sand-50"
                                onClick={closeMobile}
                            >
                                {label}
                            </Link>
                        ),
                    )}
                    {!user ? (
                        <Button
                            size="sm"
                            className="mt-2 w-full rounded-full bg-forest-900 text-[13px] text-white hover:bg-forest-800"
                            asChild
                        >
                            <Link href="/dashboard" onClick={closeMobile}>
                                {t("startFree")}
                            </Link>
                        </Button>
                    ) : null}
                </nav>
            </div>
        </>
    );
}
