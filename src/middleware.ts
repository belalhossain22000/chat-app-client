import { NextResponse, type NextRequest } from "next/server";
import { TOKEN_COOKIE } from "@/features/auth/authConstants";

const PROTECTED = ["/chat"];
const GUEST_ONLY = ["/login"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasToken = Boolean(request.cookies.get(TOKEN_COOKIE)?.value);

  if (PROTECTED.some((p) => pathname === p || pathname.startsWith(`${p}/`)) && !hasToken) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (GUEST_ONLY.some((p) => pathname === p || pathname.startsWith(`${p}/`)) && hasToken) {
    const url = request.nextUrl.clone();
    url.pathname = "/chat";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/chat/:path*", "/login"],
};
