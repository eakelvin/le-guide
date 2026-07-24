"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export function Footer() {
    const t = useTranslations("footer");
    const tCommon = useTranslations("common");
    const year = new Date().getFullYear();

    return (
        <footer className="bg-sand-800 py-12">
            <div className="mx-auto flex max-w-[1120px] flex-wrap items-center justify-between gap-5 px-6 md:px-12">
                <div className="font-heading text-[16px] font-normal text-white/75">
                    Le<span className="text-forest-400">Guide</span>
                </div>
                <div className="flex flex-wrap gap-6 text-[13px]">
                    <Link href="/guides" className="text-white/40 no-underline transition-colors hover:text-white/75">
                        {tCommon("guides")}
                    </Link>
                    <Link href="/#contact" className="text-white/40 no-underline transition-colors hover:text-white/75">
                        {tCommon("contact")}
                    </Link>
                    <Link href="/privacy" className="text-white/40 no-underline transition-colors hover:text-white/75">
                        {tCommon("privacy")}
                    </Link>
                    <Link href="/terms" className="text-white/40 no-underline transition-colors hover:text-white/75">
                        {tCommon("terms")}
                    </Link>
                </div>
                <div className="text-[12px] text-white/40">
                    {t("tagline", { year })}
                </div>
            </div>
        </footer>
    );
}
