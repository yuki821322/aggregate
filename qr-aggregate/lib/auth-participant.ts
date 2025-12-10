// lib/auth-participant.ts
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

const PARTICIPANT_COOKIE = "participant_id";

// ログイン時に呼んでいるやつ
export async function createParticipantSession(participantId: string) {
  const cookieStore = await cookies();
  cookieStore.set(PARTICIPANT_COOKIE, participantId, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7日
  });
}

// 🔹いま欲しいやつ：ログイン中の参加者を取得
export async function getCurrentParticipant() {
  const cookieStore = await cookies();
  const id = cookieStore.get(PARTICIPANT_COOKIE)?.value;
  if (!id) return null;

  const participant = await prisma.participant.findUnique({
    where: { id },
  });

  return participant;
}

// ログアウト用
export async function clearParticipantSession() {
  const cookieStore = await cookies();
  cookieStore.set(PARTICIPANT_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}
