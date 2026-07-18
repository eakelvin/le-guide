"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
    getCountryLabel,
    getCountryOptions,
    toCanonicalCountryName,
} from "@/lib/data/countries-master";

type Props = {
    id?: string;
    value: string;
    onChange: (countryName: string) => void;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
};

export function CountryCombobox({
    id,
    value,
    onChange,
    placeholder,
    disabled,
    className,
}: Props) {
    const t = useTranslations("auth");
    const locale = useLocale();
    const resolvedPlaceholder = placeholder ?? t("selectCountry");
    const [open, setOpen] = React.useState(false);
    const options = React.useMemo(() => getCountryOptions(locale), [locale]);
    const safeValue = value ?? "";
    const displayLabel = safeValue ? getCountryLabel(safeValue, locale) : "";

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    id={id}
                    type="button"
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    disabled={disabled}
                    className={cn(
                        "h-9 w-full justify-between font-normal text-left",
                        !safeValue && "text-muted-foreground",
                        className,
                    )}
                >
                    <span className="truncate">{displayLabel || resolvedPlaceholder}</span>
                    <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" aria-hidden />
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className="w-[min(calc(100vw-2rem),24rem)] p-0"
                align="start"
                sideOffset={4}
            >
                <Command>
                    <CommandInput placeholder={t("searchCountries")} />
                    <CommandList>
                        <CommandEmpty>{t("noCountryFound")}</CommandEmpty>
                        <CommandGroup>
                            {options.map((opt) => (
                                <CommandItem
                                    key={opt.value}
                                    value={opt.label}
                                    keywords={[opt.value, opt.label]}
                                    onSelect={() => {
                                        onChange(toCanonicalCountryName(opt.value));
                                        setOpen(false);
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 size-4 shrink-0",
                                            toCanonicalCountryName(safeValue) === opt.value
                                                ? "opacity-100"
                                                : "opacity-0",
                                        )}
                                        aria-hidden
                                    />
                                    {opt.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
