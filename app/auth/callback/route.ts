import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { AUTH_ROUTES } from "@/lib/auth-routes";
import { getLocaleFromCookie, withLocalePath } from "@/lib/locale";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const url = request.nextUrl;
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") ?? "/dashboard";
  const safeNext = next.startsWith("/") && !next.startsWith("//") ? next : "/dashboard";
  const locale = await getLocaleFromCookie();

  if (!code) {
    return NextResponse.redirect(
      new URL(
        withLocalePath(locale, `${AUTH_ROUTES.login}?error=oauth_missing_code`),
        url.origin,
      ),
    );
  }

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect(
      new URL(
        withLocalePath(locale, `${AUTH_ROUTES.login}?error=oauth_failed`),
        url.origin,
      ),
    );
  }

  const localizedUpdatePassword = withLocalePath(locale, AUTH_ROUTES.updatePassword);
  if (safeNext === AUTH_ROUTES.updatePassword || safeNext === localizedUpdatePassword) {
    const res = NextResponse.redirect(new URL(localizedUpdatePassword, url.origin));
    res.cookies.set("password_recovery_flow", "1", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 3600,
      path: localizedUpdatePassword,
    });
    return res;
  }

  const localizedNext = safeNext.match(/^\/(fr|en)(\/|$)/)
    ? safeNext
    : withLocalePath(locale, safeNext);
  const sep = localizedNext.includes("?") ? "&" : "?";
  return NextResponse.redirect(new URL(`${localizedNext}${sep}signedIn=1`, url.origin));
}
