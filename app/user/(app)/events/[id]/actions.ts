"use server";

import { prisma } from "@/lib/prisma";
import crypto from "node:crypto";

export async function registerToEvent(formData: FormData) {
  const eventId = formData.get("eventId")?.toString() ?? "";
  const name = formData.get("name")?.toString().trim() ?? "";
  const rawCode = formData.get("code")?.toString().trim() ?? ""; // 学籍番号など

  if (!eventId || !name) {
    throw new Error("eventId または name が不正です");
  }

  // 空文字なら null にしておく（unique 制約との相性も良い）
  const studentId = rawCode === "" ? null : rawCode;

  // --- 1. Event があるか確認 ---
  const event = await prisma.event.findUnique({ where: { id: eventId } });
  if (!event) {
    throw new Error(`eventId=${eventId} の Event が存在しません`);
  }

  // --- 2. Participant を studentId で検索（学籍番号リピートの場合） ---
  let participant = studentId
    ? await prisma.participant.findUnique({
        where: { studentId }, // ★ code ではなく studentId
      })
    : null;

  // --- 3. なければ新規作成 ---
  if (!participant) {
    participant = await prisma.participant.create({
      data: {
        name,
        studentId, // ★ ここも studentId
        // Participant は passwordHash 必須なのでダミーを入れる
        // ログインに使わないならランダム文字列でOK
        passwordHash: crypto.randomBytes(32).toString("hex"),
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
