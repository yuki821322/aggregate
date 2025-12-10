// app/api/admin/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const loginInput = String(formData.get("username") ?? "").trim(); // ← 名前 or ログインID
  const password = String(formData.get("password") ?? "");

  if (!loginInput || !password) {
    const url = new URL("/admin/login", req.url);
    url.searchParams.set("error", "missing");
    return NextResponse.redirect(url);
  }

  // ★ 名前 OR ログインID のどちらかが一致すればOK
  const user = await prisma.accountUser.findFirst({
    where: {
      OR: [{ loginId: loginInput }, { name: loginInput }],
    },
  });

  if (!user || !user.passwordHash) {
    const url = new URL("/admin/login", req.url);
    url.searchParams.set("error", "invalid");
    return NextResponse.redirect(url);
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    const url = new URL("/admin/login", req.url);
    url.searchParams.set("error", "invalid");
    return NextResponse.redirect(url);
  }

  const res = NextResponse.redirect(new URL("/admin", req.url));
  res.cookies.set("admin_session", user.id, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 8,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return res;
}
