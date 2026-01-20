import styles from "./layout.module.css";
import UserHeader from "../components/UserHeader";
import RadialMenu from "../components/RadialMenu";
import { getCurrentParticipant } from "@/lib/auth-participant";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const participant = await getCurrentParticipant();

  return (
    <div className={styles.shell}>
      <UserHeader participant={participant ?? null} />
      <div className={styles.content}>{children}</div>
      <RadialMenu />
    </div>
  );
}