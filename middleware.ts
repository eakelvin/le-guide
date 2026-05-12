import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const { response } = await updateSession(request);
  response.headers.set("x-pathname", request.nextUrl.pathname);
  return response;
}

/** Must be static strings (Next.js build). Keep in sync with routes under `app/(authed)/`. */
export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*"],
};

