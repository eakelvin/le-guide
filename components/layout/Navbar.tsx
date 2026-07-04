"use client";

import type { AppUser } from "@/features/auth/user";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UserMenu } from "@/components/layout/UserMenu";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";

const MOBILE_LINKS = [
    { href: "/guides", label: "Guides" },
    { href: "#contact", label: "Contact" },
] as const;

export function Navbar({ initialUser }: { initialUser: AppUser | null }) {
    const [user] = useState<AppUser | null>(initialUser);
    const [mobileOpen, setMobileOpen] = useState(false);
    const closeMobile = () => setMobileOpen(false);

    return (
        <>
            <nav className="fixed top-0 left-0 right-0 z-50 flex h-14 items-center justify-between border-b border-border bg-background/90 px-6 backdrop-blur-md supports-[backdrop-filter]:bg-background/75 md:h-[60px] md:px-12">
                <Link
                    href="/"
                    className="font-heading text-[18px] font-normal tracking-tight text-sand-800 no-underline"
                    onClick={closeMobile}
                >
                    Le<span className="text-forest-900">Guide</span>
                </Link>
                <div className="flex items-center gap-3 md:gap-7">
                    <div className="hidden items-center gap-7 md:flex">
                        <a
                            href="#processes"
                            className="text-[13.5px] text-sand-600 transition-colors no-underline hover:text-sand-800"
                        >
                            Processes
                        </a>
                        <a
                            href="#how"
                            className="text-[13.5px] text-sand-600 transition-colors no-underline hover:text-sand-800"
                        >
                            How it works
                        </a>
                        <a
                            href="#faq"
                            className="text-[13.5px] text-sand-600 transition-colors no-underline hover:text-sand-800"
                        >
                            FAQ
                        </a>
                        <a
                            href="#contact"
                            className="text-[13.5px] text-sand-600 transition-colors no-underline hover:text-sand-800"
                        >
                            Contact
                        </a>
                        <Link
                            href="/guides"
                            className="text-[13.5px] text-sand-600 transition-colors no-underline hover:text-sand-800"
                        >
                            Guides
                        </Link>
                    </div>
                    {user ? (
                        <div className="flex items-center gap-3">
                            <Button
                                size="sm"
                                variant="outline"
                                className="rounded-full border-sand-200 bg-transparent px-4 text-[13px] text-sand-800 shadow-none hover:bg-card"
                                asChild
                            >
                                <Link href="/dashboard">Dashboard</Link>
                            </Button>
                            <UserMenu name={user.name} email={user.email} imageUrl={user.imageUrl} />
                        </div>
                    ) : (
                        <Button
                            size="sm"
                            className="rounded-full bg-forest-900 px-5 text-[13px] text-white hover:bg-forest-800"
                            asChild
                        >
                            <Link href="/dashboard">Start free →</Link>
                        </Button>
                    )}
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-9 shrink-0 text-sand-700 md:hidden"
                        aria-expanded={mobileOpen}
                        aria-controls="mobile-nav-menu"
                        aria-label={mobileOpen ? "Close menu" : "Open menu"}
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
                    {MOBILE_LINKS.map(({ href, label }) =>
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
                </nav>
            </div>
        </>
    );
}
