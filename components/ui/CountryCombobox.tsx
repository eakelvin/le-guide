"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
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
import { COUNTRY_NAMES } from "@/lib/data/countries-master";

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
    placeholder = "Select country…",
    disabled,
    className,
}: Props) {
    const [open, setOpen] = React.useState(false);
    const safeValue = value ?? "";

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
                    <span className="truncate">{safeValue || placeholder}</span>
                    <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" aria-hidden />
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className="w-[min(calc(100vw-2rem),24rem)] p-0"
                align="start"
                sideOffset={4}
            >
                <Command>
                    <CommandInput placeholder="Search countries…" />
                    <CommandList>
                        <CommandEmpty>No country found.</CommandEmpty>
                        <CommandGroup>
                            {COUNTRY_NAMES.map((name) => (
                                <CommandItem
                                    key={name}
                                    value={name}
                                    keywords={[name]}
                                    onSelect={(raw) => {
                                        const picked =
                                            COUNTRY_NAMES.find((n) => n.toLowerCase() === raw.toLowerCase()) ?? raw;
                                        onChange(picked);
                                        setOpen(false);
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 size-4 shrink-0",
                                            safeValue === name ? "opacity-100" : "opacity-0",
                                        )}
                                        aria-hidden
                                    />
                                    {name}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
