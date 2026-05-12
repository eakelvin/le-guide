import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { AUTH_ROUTES } from "@/lib/auth-routes";
import { getAppUser, type AppUser } from "@/lib/supabase/user";

async function redirectUnauthenticatedToLogin(): Promise<never> {
    const h = await headers();
    const next = h.get("x-pathname") ?? "/dashboard";
    return redirect(`${AUTH_ROUTES.login}?next=${encodeURIComponent(next)}`);
}

/** Use in `app/(authed)/layout.tsx` — redirects to login with correct `next` when session is missing. */
export async function ensureAuthenticated(): Promise<void> {
    const user = await getAppUser();
    if (!user) return await redirectUnauthenticatedToLogin();
}

/** Use in pages under `(authed)` when you need the user object (dedupes with `getAppUser` via React cache). */
export async function requireAppUser(): Promise<AppUser> {
    const user = await getAppUser();
    if (user) return user;
    return await redirectUnauthenticatedToLogin();
}
