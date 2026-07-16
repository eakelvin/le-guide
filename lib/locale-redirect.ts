import { getLocale } from "next-intl/server";
import { redirect } from "next/navigation";
import { routing } from "@/i18n/routing";
import { isAppLocale, withLocalePath } from "@/lib/locale";

/** Redirect to a locale-prefixed path from server actions and route handlers. */
export async function redirectWithLocale(path: string): Promise<never> {
  const localeRaw = await getLocale();
  const locale = isAppLocale(localeRaw) ? localeRaw : routing.defaultLocale;
  return redirect(withLocalePath(locale, path));
}
