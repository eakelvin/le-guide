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
import { STUDENT_TYPE_OPTIONS, type StudentType } from "@/types";

type Props = {
    id?: string;
    value: StudentType | "";
    onChange: (value: StudentType) => void;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
};

export function StudentTypeCombobox({
    id,
    value,
    onChange,
    placeholder = "Select student type…",
    disabled,
    className,
}: Props) {
    const [open, setOpen] = React.useState(false);
    const label = STUDENT_TYPE_OPTIONS.find((o) => o.value === value)?.label ?? "";

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
                        !value && "text-muted-foreground",
                        className,
                    )}
                >
                    <span className="truncate">{label || placeholder}</span>
                    <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" aria-hidden />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[min(calc(100vw-2rem),24rem)] p-0" align="start" sideOffset={4}>
                <Command>
                    <CommandInput placeholder="Search…" />
                    <CommandList>
                        <CommandEmpty>No type found.</CommandEmpty>
                        <CommandGroup>
                            {STUDENT_TYPE_OPTIONS.map((opt) => (
                                <CommandItem
                                    key={opt.value}
                                    value={opt.label}
                                    keywords={[opt.value, opt.label]}
                                    onSelect={(raw) => {
                                        const picked =
                                            STUDENT_TYPE_OPTIONS.find((o) => o.label.toLowerCase() === raw.toLowerCase()) ??
                                            STUDENT_TYPE_OPTIONS.find((o) => o.value.toLowerCase() === raw.toLowerCase());
                                        if (picked) onChange(picked.value);
                                        setOpen(false);
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 size-4 shrink-0",
                                            value === opt.value ? "opacity-100" : "opacity-0",
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
