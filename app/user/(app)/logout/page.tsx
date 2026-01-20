// app/user/logout/page.tsx
import { clearParticipantSession } from "@/lib/auth-participant";
import { redirect } from "next/navigation";

export default async function LogoutPage() {
  // セッション破棄
  await clearParticipantSession();

  // ログイン画面へ
  redirect("/user/login");
}
