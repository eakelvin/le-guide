import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

export async function proxy(request: NextRequest) {
  const { response } = await updateSession(request);
  response.headers.set("x-pathname", request.nextUrl.pathname);
  return response;
}

/** Must be static strings (Next.js build). Keep in sync with routes under `app/(authed)/`. */
export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*"],
};
