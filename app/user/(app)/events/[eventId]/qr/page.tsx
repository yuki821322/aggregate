// app/user/events/[eventId]/qr/page.tsx
import { prisma } from "@/lib/prisma";
import styles from "./page.module.css";
import crypto from "crypto";
import QrCodeBox from "./QrCodeBox"; // ここは実際の配置に合わせて調整
type Props = {
  params: { eventId: string };
};

// ✅ 詳細ページと同じ「ローカル用 participant」
async function getCurrentParticipantId(): Promise<string> {
  const LOGIN_KEY = "local-dev-user";

  let participant = await prisma.participant.findUnique({
    where: { studentId: LOGIN_KEY },
  });

  if (!participant) {
    participant = await prisma.participant.create({
      data: {
        name: "ローカルテストユーザー",
        studentId: LOGIN_KEY,
        passwordHash: "dummy",
      },
    });
  }

  return participant.id;
}

// ✅ 万が一 qrToken が空だったら補完して再発行（保険）
function generateQrToken(): string {
  return crypto.randomUUID().replace(/-/g, "");
}

export default async function EventQrPage({ params }: Props) {
  const { eventId } = await params;
  const participantId = await getCurrentParticipantId();

  const attendee = await prisma.eventAttendee.findFirst({
    where: { eventId, participantId },
    include: { event: true },
  });

  if (!attendee) {
    return (
      <main className={styles.pageRoot}>
        <div className={styles.pageContainer}>
          <p className={styles.errorMessage}>
            このイベントにはまだ「参加する」登録がされていません。
          </p>
        </div>
      </main>
    );
  }

  // ✅ 保険：qrToken が無い/空なら発行し直す
  const qrToken =
    attendee.qrToken && attendee.qrToken.length > 0
      ? attendee.qrToken
      : (await prisma.eventAttendee.update({
          where: { id: attendee.id },
          data: { qrToken: generateQrToken() },
        })).qrToken;

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ??
    process.env.VERCEL_URL?.startsWith("http")
      ? process.env.VERCEL_URL
      : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "https://example.com";

  const checkinUrl = `${baseUrl}/checkin?token=${qrToken}`;

  return (
    <main className={styles.pageRoot}>
      <div className={styles.pageContainer}>
        <h1 className={styles.pageTitle}>出席用QRコード</h1>
        <p className={styles.eventName}>{attendee.event.title}</p>

        <div className={styles.qrWrapper}>
          <QrCodeBox value={checkinUrl} />
        </div>

        <p className={styles.qrNote}>
          当日、受付スタッフにこの QRコードを提示してください。
        </p>
      </div>
    </main>
  );
}
