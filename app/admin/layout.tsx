// app/admin/layout.tsx
import type { ReactNode } from "react";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import AdminShell from "./AdminShell";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");
  const userId = session?.value;

  let displayName = "ゲスト";

  if (userId) {
    const user = await prisma.accountUser.findUnique({
      where: { id: userId },
      select: { name: true },
    });
    if (user?.name) {
      displayName = user.name;
    }
  }

  return <AdminShell displayName={displayName}>{children}</AdminShell>;
}