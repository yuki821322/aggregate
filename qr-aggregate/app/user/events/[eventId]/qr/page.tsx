// app/user/events/[eventId]/qr/page.tsx
import { prisma } from "@/lib/prisma";
import styles from "./page.module.css";

type Props = {
  params: {
    eventId: string;
  };
};

async function getCurrentParticipantId(): Promise<string> {
  // TODO: ログイン実装に合わせて変更
  return "dummy-participant-id";
}

export default async function EventQrPage({ params }: Props) {
  const { eventId } = params;
  const participantId = await getCurrentParticipantId();

  const attendee = await prisma.eventAttendee.findFirst({
    where: {
      eventId,
      participantId,
    },
    include: {
      event: true,
    },
  });

  if (!attendee) {
    // 参加していない場合の簡易エラー
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

  const checkinUrl = `${process.env.NEXT_PUBLIC_BASE_URL ?? "https://example.com"}/checkin?token=${attendee.qrToken}`;

  return (
    <main className={styles.pageRoot}>
      <div className={styles.pageContainer}>
        <h1 className={styles.pageTitle}>
          出席用QRコード
        </h1>
        <p className={styles.eventName}>{attendee.event.title}</p>

        <div className={styles.qrWrapper}>
          {/* クライアントコンポーネントで QR を描画 */}
          {/* @ts-expect-error Server Component からのインポートを許可 */}
          <QrCodeBox value={checkinUrl} />
        </div>

        <p className={styles.qrNote}>
          当日、受付スタッフにこの QRコードを提示してください。
        </p>
      </div>
    </main>
  );
}
