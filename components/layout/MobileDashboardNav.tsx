"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { useEffect } from "react";
import { SidebarPanel, type SidebarPanelProps } from "./Sidebar";

interface MobileDashboardNavProps extends SidebarPanelProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function MobileDashboardNav({
    open,
    onOpenChange,
    ...sidebarProps
}: MobileDashboardNavProps) {
    useEffect(() => {
        if (!open) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = prev;
        };
    }, [open]);

    return (
        <>
            <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur-md supports-[backdrop-filter]:bg-background/90 md:hidden">
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-9 shrink-0 text-sand-700"
                    aria-expanded={open}
                    aria-controls="mobile-dashboard-sidebar"
                    aria-label={open ? "Close menu" : "Open menu"}
                    onClick={() => onOpenChange(!open)}
                >
                    {open ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
                </Button>
                {/* <span className="font-heading text-lg font-normal tracking-tight text-sand-800">
                    Le<span className="text-forest-700">Guide</span>
                </span> */}
                <div className="size-9 shrink-0" aria-hidden />
            </header>

            <div
                className={cn(
                    "fixed inset-0 z-40 bg-black/40 transition-opacity duration-200 md:hidden",
                    open ? "visible opacity-100" : "invisible opacity-0 pointer-events-none",
                )}
                aria-hidden={!open}
                onClick={() => onOpenChange(false)}
            />

            <aside
                id="mobile-dashboard-sidebar"
                className={cn(
                    "fixed inset-y-0 left-0 z-50 w-[min(100vw-3rem,16rem)] border-r border-border shadow-lg transition-transform duration-200 ease-out md:hidden",
                    open ? "translate-x-0" : "-translate-x-full pointer-events-none",
                )}
                aria-hidden={!open}
            >
                <SidebarPanel
                    {...sidebarProps}
                    className="h-full"
                    onAfterNavigate={() => onOpenChange(false)}
                />
            </aside>
        </>
    );
}
