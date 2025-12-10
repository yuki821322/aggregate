/*
  Warnings:

  - A unique constraint covering the columns `[eventId,participantId]` on the table `EventAttendee` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "EventAttendee_eventId_participantId_key" ON "EventAttendee"("eventId", "participantId");
