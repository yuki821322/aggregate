"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { createParticipantSession } from "@/lib/auth-participant";

export async function registerParticipant(
  _prevState: { status: string; message: string },
  formData: FormData
): Promise<{ status: "idle" | "error" | "success"; message: string }> {
  const name = String(formData.get("name") || "").trim();
  const studentId = String(formData.get("studentId") || "").trim();
  const pass1 = String(formData.get("password") || "");
  const pass2 = String(formData.get("passwordConfirm") || "");

  if (!name) {
    return { status: "error", message: "名前を入力してください。" };
  }
  if (!pass1) {
    return { status: "error", message: "パスワードを入力してください。" };
  }
  if (pass1 !== pass2) {
    return { status: "error", message: "パスワードが一致していません。" };
  }

  if (studentId) {
    const existing = await prisma.participant.findUnique({
      where: { studentId },
    });
    if (existing) {
      return {
        status: "error",
        message: "この学籍番号はすでに登録されています。",
      };
    }
  }

  const passwordHash = await bcrypt.hash(pass1, 10);

  const participant = await prisma.participant.create({
    data: {
      name,
      studentId: studentId || null,
      passwordHash,
    },
  });

  await createParticipantSession(participant.id);

  return {
    status: "success",
    message: "登録に成功しました。",
  };
}
