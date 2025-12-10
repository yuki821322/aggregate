import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const formData = await req.formData();

  const participantId = formData.get("participantId")?.toString() ?? "";
  const eventId = formData.get("eventId")?.toString() ?? "";
  const name = formData.get("name")?.toString() ?? "";
  const studentId = formData.get("studentId")?.toString() || null;

  if (!participantId || !name) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  await prisma.participant.update({
    where: { id: participantId },
    data: {
      name,
      studentId,
    },
  });

  return NextResponse.redirect(
    `/admin/participants?eventId=${eventId}`,
    303
  );
}
