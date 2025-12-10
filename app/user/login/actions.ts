"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { createParticipantSession } from "@/lib/auth-participant";

type LoginResult = {
  status: "idle" | "error" | "success";
  message: string;
};

export async function loginParticipant(
  _prevState: LoginResult,
  formData: FormData
): Promise<LoginResult> {
  const identifier = String(formData.get("identifier") || "").trim();
  const password = String(formData.get("password") || "");

  if (!identifier || !password) {
    return {
      status: "error",
      message: "名前 / 学籍番号 と パスワードを入力してください。",
    };
  }

  // 名前 または 学籍番号で検索
  const participant = await prisma.participant.findFirst({
    where: {
      OR: [{ name: identifier }, { studentId: identifier }],
    },
  });

  if (!participant) {
    return {
      status: "error",
      message:
        "該当するユーザーが見つかりません。名前 / 学籍番号 をご確認ください。",
    };
  }

  const ok = await bcrypt.compare(password, participant.passwordHash);
  if (!ok) {
    return {
      status: "error",
      message: "パスワードが正しくありません。",
    };
  }

  // ログイン成功 → セッション付与
  await createParticipantSession(participant.id);

  return {
    status: "success",
    message: "ログインに成功しました。",
  };
}
