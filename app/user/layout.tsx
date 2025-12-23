// app/user/layout.tsx
import styles from "./layout.module.css";
import UserHeader from "./components/UserHeader";
import RadialMenu from "./components/RadialMenu";

import { getCurrentParticipant } from "@/lib/auth-participant";
import { redirect } from "next/navigation";

export default async function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // ✅ ここでログイン判定したいならON（ログインページも弾くので注意）
  // login/register にも表示するだけで、ログインは弾かないなら下の2行は消してOK
const participant = await getCurrentParticipant();

  return (
    <div className={styles.shell}>
      <UserHeader participant={participant ?? null} />
      <div className={styles.content}>{children}</div>
      <RadialMenu />
    </div>
  );
}