import type { AppUser } from "@/lib/supabase/user";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UserMenu } from "@/components/layout/UserMenu";

export function Navbar({ initialUser }: { initialUser: AppUser | null }) {
    const [user] = useState<AppUser | null>(initialUser);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 flex h-14 items-center justify-between border-b border-border bg-background/90 px-6 backdrop-blur-md supports-[backdrop-filter]:bg-background/75 md:h-[60px] md:px-12">
            <Link
                href="/"
                className="font-heading text-[18px] font-normal tracking-tight text-sand-800 no-underline"
            >
                Arrive<span className="text-forest-900">France</span>
            </Link>
            <div className="flex items-center gap-4 md:gap-7">
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
                    <Button size="sm" className="rounded-full bg-forest-900 px-5 text-[13px] text-white hover:bg-forest-800" asChild>
                        <Link href="/dashboard">Start free →</Link>
                    </Button>
                )}
            </div>
        </nav>
    );
}