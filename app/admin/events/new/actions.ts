// app/admin/events/actions.ts
"use server";

import { prisma } from "@/lib/prisma";
import path from "path";
import fs from "fs/promises";

function getExt(mime: string) {
  if (mime === "image/jpeg") return "jpg";
  if (mime === "image/png") return "png";
  if (mime === "image/webp") return "webp";
  if (mime === "image/gif") return "gif";
  return null;
}

// ★ これを追加する
export async function updateEventHero(formData: FormData) {
  const eventId = formData.get("eventId")?.toString();
  const file = formData.get("hero");

  if (!eventId || !(file instanceof File) || file.size === 0) return;

  const ext = getExt(file.type);
  if (!ext) throw new Error("Unsupported image type");

  if (file.size > 5 * 1024 * 1024) {
    throw new Error("Image too large");
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  const dir = path.join(process.cwd(), "public", "event-hero");
  await fs.mkdir(dir, { recursive: true });

  const filename = `event-${Date.now()}.${ext}`;
  await fs.writeFile(path.join(dir, filename), buffer);

  await prisma.event.update({
    where: { id: eventId },
    data: {
      heroImageUrl: `/event-hero/${filename}`,
    },
  });
}
