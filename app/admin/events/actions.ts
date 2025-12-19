// app/admin/events/actions.ts
"use server";

import { prisma } from "@/lib/prisma";

export async function updateEvent(formData: FormData) {
  const eventId = formData.get("eventId")?.toString() ?? "";

  const title = (formData.get("title") ?? "").toString().trim();
  const location = (formData.get("location") ?? "").toString().trim();
  const description = (formData.get("description") ?? "").toString().trim();

  const dateStr = (formData.get("date") ?? "").toString(); // YYYY-MM-DD
  const startStr = (formData.get("startTime") ?? "").toString(); // HH:MM
  const endStr = (formData.get("endTime") ?? "").toString(); // HH:MM
  const lateMinutesStr = (formData.get("lateMinutes") ?? "15").toString();

  if (!eventId || !title || !dateStr || !startStr || !endStr) return;

  const date = new Date(`${dateStr}T00:00:00`);
  const startAt = new Date(`${dateStr}T${startStr}:00`);
  const endAt = new Date(`${dateStr}T${endStr}:00`);

  const lateThresholdMinutes = Number.isNaN(Number(lateMinutesStr))
    ? 15
    : Number(lateMinutesStr);

  await prisma.event.update({
    where: { id: eventId },
    data: {
      title,
      location: location || null,
      description: description || null,
      date,
      startAt,
      endAt,
      lateThresholdMinutes,
    },
  });
}
