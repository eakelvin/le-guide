"use client";

import Link from "next/link";
import { UserRound } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function CompleteProfileAlert() {
    return (
        <Link href="/profile" className="block no-underline">
            <Alert className="cursor-pointer border-azure-100 bg-azure-50 text-azure-900 shadow-none transition-colors hover:bg-azure-100 [&>svg]:text-azure-600">
                <UserRound className="size-4" aria-hidden />
                <AlertTitle className="text-azure-950">Complete your profile</AlertTitle>
                <AlertDescription className="text-azure-700">
                    Add your university and stay details (France arrival and accommodation) to personalise your checklist.{" "}
                    <span className="font-medium text-azure-800">Set up →</span>
                </AlertDescription>
            </Alert>
        </Link>
    );
}
