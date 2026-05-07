"use client";

import { LogOut } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logoutAction } from "@/features/auth/logout";

export function UserMenu({
  name,
  email,
  imageUrl,
  align = "end",
}: {
  name?: string | null;
  email?: string | null;
  imageUrl?: string | null;
  align?: "start" | "end" | "center";
}) {
  const fallback =
    (name ?? email ?? "U")
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase())
      .join("") || "U";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="rounded-full outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
        <Avatar className="size-9 ring-2 ring-border">
          {imageUrl ? <AvatarImage src={imageUrl} alt={name ?? "User avatar"} /> : null}
          <AvatarFallback className="text-xs font-medium text-sand-700 bg-sand-100">{fallback}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent align={align} className="w-56">
        <DropdownMenuLabel className="space-y-0.5">
          <p className="text-sm font-medium leading-none text-sand-800">{name ?? "Account"}</p>
          {email ? <p className="text-xs font-normal text-sand-500">{email}</p> : null}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <form action={logoutAction}>
          <DropdownMenuItem asChild>
            <button type="submit" className="w-full">
              <LogOut className="mr-2 size-4" aria-hidden />
              Log out
            </button>
          </DropdownMenuItem>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

