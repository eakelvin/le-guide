"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get("code");
    const next = searchParams.get("next") ?? "/dashboard";
    const safeNext = next.startsWith("/") ? next : "/dashboard";

    async function run() {
      if (!code) {
        router.replace(`/login?error=${encodeURIComponent("Missing OAuth code")}`);
        return;
      }

      const supabase = createClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) {
        router.replace(`/login?error=${encodeURIComponent(error.message)}`);
        return;
      }

      router.replace(safeNext);
    }

    void run();
  }, [router, searchParams]);

  return (
    <main className="mx-auto flex min-h-screen max-w-md items-center justify-center px-6">
      <p className="text-sm text-muted-foreground">Signing you in…</p>
    </main>
  );
}

