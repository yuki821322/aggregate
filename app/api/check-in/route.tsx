// app/api/check-in/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const tokenRaw: string | undefined = body?.token;
    const deviceLabel: string | undefined = body?.deviceLabel;

    if (!tokenRaw || typeof tokenRaw !== "string") {
      return NextResponse.json(
        { ok: false, message: "token が指定されていません。" },
        { status: 400 }
      );
    }

    // 空白などを削除
    const token = tokenRaw.trim();

    // QR トークンから EventAttendee を特定
    const attendee = await prisma.eventAttendee.findUnique({
      where: { qrToken: token },
      include: {
        event: true,
        participant: true,
      },
    });

    if (!attendee) {
      // 無効トークン
      return NextResponse.json(
        {
          ok: false,
          code: "NOT_FOUND",
          message: "この QR は登録されていません。（無効なコード）",
        },
        { status: 404 }
      );
    }

    const now = new Date();
    const event = attendee.event;

    // 遅刻判定
    const diffMs = now.getTime() - event.startAt.getTime();
    const diffMin = diffMs / (60 * 1000);

    let status: string = "on_time";

    // 例: 開始30分以上前は "too_early"
    if (diffMin < -30) {
      status = "too_early";
    } else if (diffMin > event.lateThresholdMinutes) {
      status = "late";
    } else {
      status = "on_time";
    }

    const isFirst = attendee.firstCheckedInAt == null;

    // 出席ログを追加
    const log = await prisma.attendanceLog.create({
      data: {
        eventAttendeeId: attendee.id,
        checkedAt: now,
        status,
        deviceLabel: deviceLabel ?? null,
        handledById: null, // いずれ AccountUser と紐づけるならここを更新
      },
    });

    // 初回なら EventAttendee にも記録
    if (isFirst) {
      await prisma.eventAttendee.update({
        where: { id: attendee.id },
        data: { firstCheckedInAt: now, status: "checked_in" },
      });
    }

    // 返却データ
    return NextResponse.json({
      ok: true,
      eventTitle: event.title,
      participantName: attendee.participant?.name ?? "（名前未登録）",
      participantCode: attendee.participant?.code ?? null,
      status,
      checkedAt: log.checkedAt,
      isFirst,
    });
  } catch (err) {
    console.error("check-in error", err);
    return NextResponse.json(
      { ok: false, message: "サーバーエラーが発生しました。" },
      { status: 500 }
    );
  }
}
