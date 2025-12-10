"use server";

import { prisma } from "@/lib/prisma";
import crypto from "node:crypto";

export async function registerToEvent(formData: FormData) {
  const eventId = formData.get("eventId")?.toString() ?? "";
  const name = formData.get("name")?.toString().trim() ?? "";
  const code = formData.get("code")?.toString().trim() ?? ""; // 学籍番号やユーザー識別用

  // --- 1. Event があるか確認 ---
  const event = await prisma.event.findUnique({ where: { id: eventId } });
  if (!event) {
    throw new Error(`eventId=${eventId} の Event が存在しません`);
  }

  // --- 2. Participant を code で検索（参加者リピートの場合） ---
  let participant = await prisma.participant.findUnique({
    where: { code },
  });

  // --- 3. なければ新規作成 ---
  if (!participant) {
    participant = await prisma.participant.create({
      data: {
        name,
        code,
      },
    });
  }

  // --- 4. 既に参加済みかチェック ---
  const existing = await prisma.eventAttendee.findUnique({
    where: {
      event_participant_unique: {
        eventId,
        participantId: participant.id,
      },
    },
  });

  if (existing) {
    return { status: "already", qrToken: existing.qrToken };
  }

  // --- 5. QR用トークン作成 ---
  const qrToken = crypto.randomBytes(16).toString("hex");

  // --- 6. EventAttendee レコード作成 ---
  const attendee = await prisma.eventAttendee.create({
    data: {
      eventId,
      participantId: participant.id,
      qrToken,
    },
  });

  return {
    status: "ok",
    attendeeId: attendee.id,
    qrToken: attendee.qrToken,
  };
}
