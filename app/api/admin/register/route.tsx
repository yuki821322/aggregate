// app/api/admin/register/route.ts
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

function generateLoginId() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let id = "";
  for (let i = 0; i < 8; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
}



export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const name = String(formData.get("name") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!name || !password) {
    const url = new URL("/admin/register", req.url);
    url.searchParams.set("error", "missing");
    return NextResponse.redirect(url);
  }

  // ★ 既存ユーザーと名前が被っていないかチェック
  const sameName = await prisma.accountUser.findFirst({
    where: { name },
  });
  if (sameName) {
    const url = new URL("/admin/register", req.url);
    url.searchParams.set("error", "duplicate_name");
    return NextResponse.redirect(url);
  }

  // すでに admin がいる場合は登録禁止（初回専用）
  const existingAdmins = await prisma.accountUser.count({
    where: { role: "admin" },
  });
  if (existingAdmins > 0) {
    const url = new URL("/admin/login", req.url);
    url.searchParams.set("error", "already_has_admin");
    return NextResponse.redirect(url);
  }

  const hash = await bcrypt.hash(password, 10);
  const loginId = generateLoginId();

  const user = await prisma.accountUser.create({
    data: {
      loginId,
      passwordHash: hash,
      name,
      role: "admin",
    },
  });

  // 登録後そのままログイン状態に
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
