// app/admin/events/actions.ts
"use server";

import { prisma } from "@/lib/prisma";

export async function updateEvent(formData: FormData) {
  const eventId = formData.get("eventId")?.toString() ?? "";
  const title = formData.get("title")?.toString().trim() ?? "";
  const dateStr = formData.get("date")?.toString() ?? "";
  const startStr = formData.get("startAt")?.toString() ?? "";

  if (!eventId || !title || !dateStr || !startStr) return;

  const date = new Date(dateStr);
  const startAt = new Date(`${dateStr}T${startStr}:00`);

  await prisma.event.update({
    where: { id: eventId },
    data: { title, date, startAt },
  });
}
