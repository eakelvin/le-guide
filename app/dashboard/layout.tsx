import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getAppUser } from "@/features/auth/user";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const user = await getAppUser();
  if (!user) redirect("/login?next=/dashboard");
  return children;
}

