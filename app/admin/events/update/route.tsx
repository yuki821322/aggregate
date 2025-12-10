// app/admin/events/update/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const formData = await req.formData();

  const eventId = formData.get("eventId")?.toString() ?? "";
  const title = formData.get("title")?.toString().trim() ?? "";
  const dateStr = formData.get("date")?.toString() ?? "";
  const startStr = formData.get("startAt")?.toString() ?? "";

  if (!eventId || !title || !dateStr || !startStr) {
    // 入力が足りないときは 400 を返して何も更新しない
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const date = new Date(dateStr);                // "2025-11-23"
  const startAt = new Date(`${dateStr}T${startStr}:00`); // "2025-11-23T13:00:00"

  await prisma.event.update({
    where: { id: eventId },
    data: {
      title,
      date,
      startAt,
    },
  });

  // 一覧に戻す
  const url = new URL("/admin/events", req.url);
  return NextResponse.redirect(url, 303);
}
