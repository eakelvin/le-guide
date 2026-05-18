import type { ReactNode } from "react";
import { ensureAuthenticated } from "@/lib/auth/session";

/**
 * Shared guard for authenticated routes.
 *
 * To protect a new URL: add `app/(authed)/your-route/page.tsx` (URLs stay `/your-route`)
 * and add `"/your-route/:path*"` to `config.matcher` in `proxy.ts` so sessions refresh
 * and login redirects receive `next` via the `x-pathname` header.
 */
export default async function AuthedLayout({ children }: { children: ReactNode }) {
    await ensureAuthenticated();
    return children;
}
