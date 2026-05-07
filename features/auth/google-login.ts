import { createClient } from "@/lib/supabase/client";

export async function googleLogin(next?: string) {
  const supabase = createClient();

  const nextPath = (next && next.startsWith("/")) ? next : "/dashboard";
  const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath)}`;

  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo,
    },
  });

  if (error) throw error;
}

