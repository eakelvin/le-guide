import type { ReactNode } from "react";
import { ensureAuthenticated } from "@/features/auth/session";

/** Use in `app/[locale]/(authed)/layout.tsx` — redirects to login with correct `next` when session is missing. */
export default async function AuthedLayout({ children }: { children: ReactNode }) {
    await ensureAuthenticated();
    return children;
}
