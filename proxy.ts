import createIntlMiddleware from "next-intl/middleware";
import { type NextRequest, NextResponse } from "next/server";
import { routing } from "@/i18n/routing";
import { updateSession } from "@/lib/supabase/proxy";

const handleI18nRouting = createIntlMiddleware(routing);

const LOCALE_PATTERN = new RegExp(`^/(${routing.locales.join("|")})(/|$)`);

function stripLocale(pathname: string): string {
  const stripped = pathname.replace(LOCALE_PATTERN, "/");
  return stripped === "" ? "/" : stripped;
}

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (pathname.startsWith("/auth/callback")) {
    const { response } = await updateSession(request);
    return response;
  }

  const i18nResponse = handleI18nRouting(request);

  if (i18nResponse.headers.get("location")) {
    return i18nResponse;
  }

  const pathWithoutLocale = stripLocale(pathname);
  const isAuthedRoute =
    pathWithoutLocale === "/dashboard" ||
    pathWithoutLocale.startsWith("/dashboard/") ||
    pathWithoutLocale === "/profile" ||
    pathWithoutLocale.startsWith("/profile/");

  if (isAuthedRoute) {
    const { response } = await updateSession(request);
    response.headers.set("x-pathname", pathname);
    return response;
  }

  i18nResponse.headers.set("x-pathname", pathname);
  return i18nResponse;
}

export const config = {
  matcher: [
    "/((?!_next|.*\\..*).*)",
    "/(fr|en)/dashboard/:path*",
    "/(fr|en)/profile/:path*",
  ],
};
