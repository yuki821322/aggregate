// app/admin/profile/actions.ts
"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// ==============================
//  プロフィール画像の更新
// ==============================
export async function updateAvatar(formData: FormData) {
  // ★ ここを await 付きにする
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");
  const userId = session?.value;

  if (!userId) {
    redirect("/admin/login");
  }

  const file = formData.get("avatar") as File | null;

  if (!file || file.size === 0) {
    redirect("/admin/profile");
  }

  if (!file.type.startsWith("image/")) {
    redirect("/admin/profile");
  }

  const MAX_SIZE = 1024 * 1024; // 1MB
  if (file.size > MAX_SIZE) {
    redirect("/admin/profile");
  }

  const arrayBuffer = await file.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString("base64");
  const dataUrl = `data:${file.type};base64,${base64}`;

  await prisma.accountUser.update({
    where: { id: userId },
    data: {
      avatarUrl: dataUrl,
    },
  });

  redirect("/admin/profile");
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
  // ★ ここも await 付きにする
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");
  const userId = session?.value;

  if (!userId) {
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

  const user = await prisma.accountUser.findUnique({
    where: { id: userId },
  });

  if (!user) {
    return {
      status: "error",
      message: "ユーザー情報が見つかりませんでした。",
    };
  }

  if (user.passwordHash) {
    const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isValid) {
      return {
        status: "error",
        message: "現在のパスワードが正しくありません。",
      };
    }
  }

  const hashed = await bcrypt.hash(newPassword, 10);

  await prisma.accountUser.update({
    where: { id: userId },
    data: {
      passwordHash: hashed,
    },
  });

  return {
    status: "success",
    message: "パスワードを変更しました。",
  };
}
