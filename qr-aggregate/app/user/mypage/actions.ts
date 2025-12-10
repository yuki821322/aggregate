"use server";

import { clearParticipantSession } from "@/lib/auth-participant";
import { redirect } from "next/navigation";

// 🔹 ログアウト処理（サーバーアクション）
export async function logoutParticipant() {
  // cookie を削除
  await clearParticipantSession();

  // ログイン画面へ戻す
  redirect("/user");
}
