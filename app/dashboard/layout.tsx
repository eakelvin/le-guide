import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { AUTH_ROUTES } from "@/lib/auth-routes";
import { getAppUser } from "@/lib/supabase/user";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const user = await getAppUser();
  if (!user) redirect(`${AUTH_ROUTES.login}?next=/dashboard`);
  return children;
}

