// middleware.ts
import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // admin 以外は素通り
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  // ログイン・新規登録画面は例外（※1st ユーザー作成用）
  if (pathname === "/admin/login" || pathname === "/admin/register") {
    return NextResponse.next();
  }

  const session = req.cookies.get("admin_session");

  // ログインしてない → /admin/login に飛ばす
  if (!session) {
    const loginUrl = new URL("/admin/login", req.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
