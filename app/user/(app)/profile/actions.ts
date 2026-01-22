// app/user/(app)/profile/actions.ts
"use server";

import { getCurrentParticipant } from "@/lib/auth-participant";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

// ==============================
//  プロフィール画像の更新
// ==============================
export async function updateAvatar(formData: FormData) {
  const participant = await getCurrentParticipant();

  if (!participant) {
    redirect("/user/login");
  }

  const file = formData.get("avatar") as File | null;

  if (!file || file.size === 0) {
    redirect("/user/profile");
  }

  if (!file.type.startsWith("image/")) {
    redirect("/user/profile");
  }

  const MAX_SIZE = 1024 * 1024; // 1MB
  if (file.size > MAX_SIZE) {
    redirect("/user/profile");
  }

  const arrayBuffer = await file.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString("base64");
  const dataUrl = `data:${file.type};base64,${base64}`;

  await prisma.participant.update({
    where: { id: participant.id },
    data: {
      avatarUrl: dataUrl,
    },
  });

  redirect("/user/profile");
}

// ==============================
//  パスワード変更用の状態型
// ==============================
export type PasswordFormState = {
  status: "idle" | "success" | "error";
  message: string;
};

// ==============================
//  パスワード変更アクション
// ==============================
export async function changePassword(
  prevState: PasswordFormState,
  formData: FormData
): Promise<PasswordFormState> {
  const participant = await getCurrentParticipant();

  if (!participant) {
    return {
      status: "error",
      message: "ログイン情報が見つかりません。再度ログインしてください。",
    };
  }

  const currentPassword = (formData.get("currentPassword") ?? "").toString();
  const newPassword = (formData.get("newPassword") ?? "").toString();
  const newPasswordConfirm = (formData.get("newPasswordConfirm") ?? "").toString();

  if (!currentPassword || !newPassword || !newPasswordConfirm) {
    return {
      status: "error",
      message: "すべての項目を入力してください。",
    };
  }

  if (newPassword !== newPasswordConfirm) {
    return {
      status: "error",
      message: "新しいパスワードと確認用パスワードが一致していません。",
    };
  }

  if (newPassword.length < 8) {
    return {
      status: "error",
      message: "新しいパスワードは8文字以上にしてください。",
    };
  }

  // 現在のパスワードを検証
  const isValid = await bcrypt.compare(currentPassword, participant.passwordHash);
  if (!isValid) {
    return {
      status: "error",
      message: "現在のパスワードが正しくありません。",
    };
  }

  // 新しいパスワードをハッシュ化
  const hashed = await bcrypt.hash(newPassword, 10);

  // パスワードを更新
  await prisma.participant.update({
    where: { id: participant.id },
    data: {
      passwordHash: hashed,
    },
  });

  return {
    status: "success",
    message: "パスワードを変更しました。",
  };
}
