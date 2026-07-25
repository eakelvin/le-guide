"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { useTranslations } from "next-intl";
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

const LABEL_KEYS: Record<StudentType, "studentTypeDegree" | "studentTypeExchange" | "studentTypeIntern" | "studentTypeLanguageSchool"> = {
    "degree-student": "studentTypeDegree",
    "exchange-student": "studentTypeExchange",
    intern: "studentTypeIntern",
    "language-school": "studentTypeLanguageSchool",
};

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
    placeholder,
    disabled,
    className,
}: Props) {
    const t = useTranslations("profile");
    const [open, setOpen] = React.useState(false);
    const resolvedPlaceholder = placeholder ?? t("selectStudentType");
    const label = value ? t(LABEL_KEYS[value]) : "";

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
                        "h-9 w-full min-w-0 max-w-full justify-between overflow-hidden font-normal text-left",
                        !value && "text-muted-foreground",
                        className,
                    )}
                >
                    <span className="min-w-0 flex-1 truncate">{label || resolvedPlaceholder}</span>
                    <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" aria-hidden />
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className="w-[var(--radix-popover-trigger-width)] max-w-[calc(100vw-2rem)] p-0"
                align="start"
                sideOffset={4}
                collisionPadding={16}
            >
                <Command className="max-w-full">
                    <CommandInput placeholder={t("searchStudentType")} />
                    <CommandList>
                        <CommandEmpty>{t("noStudentTypeFound")}</CommandEmpty>
                        <CommandGroup>
                            {STUDENT_TYPE_OPTIONS.map((opt) => {
                                const optLabel = t(LABEL_KEYS[opt.value]);
                                return (
                                    <CommandItem
                                        key={opt.value}
                                        value={optLabel}
                                        keywords={[opt.value, optLabel, opt.label]}
                                        className="min-w-0"
                                        onSelect={() => {
                                            onChange(opt.value);
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
                                        <span className="min-w-0 truncate">{optLabel}</span>
                                    </CommandItem>
                                );
                            })}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
