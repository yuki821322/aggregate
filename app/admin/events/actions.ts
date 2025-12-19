// app/admin/events/actions.ts
"use server";

import { prisma } from "@/lib/prisma";
import path from "path";
import fs from "fs/promises";
import crypto from "crypto";

async function saveHeroToPublic(file: File): Promise<string> {
  if (!file || file.size === 0) throw new Error("ファイルが空です");
  if (file.size > 3 * 1024 * 1024) throw new Error("画像は3MB以下にしてください");

  const ok = ["image/png", "image/jpeg", "image/webp", "image/gif"];
  if (!ok.includes(file.type)) throw new Error("対応していない画像形式です");

  const dir = path.join(process.cwd(), "public", "event-hero");
  await fs.mkdir(dir, { recursive: true });

  const ext =
    file.type === "image/png"
      ? "png"
      : file.type === "image/jpeg"
      ? "jpg"
      : file.type === "image/webp"
      ? "webp"
      : "gif";

  const filename = `hero_${Date.now()}_${crypto.randomUUID()}.${ext}`;
  const filepath = path.join(dir, filename);

  const bytes = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(filepath, bytes);

  return `/event-hero/${filename}`;
}

export async function updateEvent(formData: FormData) {
  const eventId = formData.get("eventId")?.toString() ?? "";

  const title = (formData.get("title") ?? "").toString().trim();
  const location = (formData.get("location") ?? "").toString().trim();
  const description = (formData.get("description") ?? "").toString().trim();

  const dateStr = (formData.get("date") ?? "").toString(); // YYYY-MM-DD
  const startStr = (formData.get("startTime") ?? "").toString(); // HH:MM
  const endStr = (formData.get("endTime") ?? "").toString(); // HH:MM

  // ★ 画像（任意）
  const heroFile = formData.get("heroImageFile");
  let heroImageUrl: string | undefined = undefined;

  if (heroFile instanceof File && heroFile.size > 0) {
    heroImageUrl = await saveHeroToPublic(heroFile);
  }

  if (!eventId || !title || !dateStr || !startStr || !endStr) return;

  const date = new Date(`${dateStr}T00:00:00`);
  const startAt = new Date(`${dateStr}T${startStr}:00`);
  const endAt = new Date(`${dateStr}T${endStr}:00`);

  await prisma.event.update({
    where: { id: eventId },
    data: {
      title,
      location: location || null,
      description: description || null,
      date,
      startAt,
      endAt,
      ...(heroImageUrl ? { heroImageUrl } : {}), // ★選んだ時だけ更新
    },
  });
}
