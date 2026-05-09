import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { AUTH_ROUTES } from "@/lib/auth-routes";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const url = request.nextUrl;
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") ?? "/dashboard";
  const safeNext = next.startsWith("/") && !next.startsWith("//") ? next : "/dashboard";

  if (!code) {
    return NextResponse.redirect(
      new URL(`${AUTH_ROUTES.login}?error=${encodeURIComponent("Missing OAuth code")}`, url.origin),
    );
  }

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect(
      new URL(`${AUTH_ROUTES.login}?error=${encodeURIComponent(error.message)}`, url.origin),
    );
  }

  if (safeNext === AUTH_ROUTES.updatePassword) {
    const res = NextResponse.redirect(new URL(safeNext, url.origin));
    res.cookies.set("password_recovery_flow", "1", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 3600,
      path: AUTH_ROUTES.updatePassword,
    });
    return res;
  }

  const sep = safeNext.includes("?") ? "&" : "?";
  return NextResponse.redirect(new URL(`${safeNext}${sep}signedIn=1`, url.origin));
}

