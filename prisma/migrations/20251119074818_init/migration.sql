-- CreateTable
CREATE TABLE "AccountUser" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "authSub" TEXT,
    "email" TEXT,
    "name" TEXT,
    "role" TEXT NOT NULL DEFAULT 'admin',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Participant" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "remarks" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "date" DATETIME NOT NULL,
    "startAt" DATETIME NOT NULL,
    "endAt" DATETIME NOT NULL,
    "lateThresholdMinutes" INTEGER NOT NULL DEFAULT 15,
    "ownerId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Event_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "AccountUser" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EventAttendee" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "eventId" TEXT NOT NULL,
    "participantId" TEXT NOT NULL,
    "qrToken" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'registered',
    "firstCheckedInAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "EventAttendee_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "EventAttendee_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "Participant" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AttendanceLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "eventAttendeeId" TEXT NOT NULL,
    "checkedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL,
    "deviceLabel" TEXT,
    "handledById" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AttendanceLog_eventAttendeeId_fkey" FOREIGN KEY ("eventAttendeeId") REFERENCES "EventAttendee" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "AttendanceLog_handledById_fkey" FOREIGN KEY ("handledById") REFERENCES "AccountUser" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "AccountUser_authSub_key" ON "AccountUser"("authSub");

-- CreateIndex
CREATE UNIQUE INDEX "AccountUser_email_key" ON "AccountUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Participant_code_key" ON "Participant"("code");

-- CreateIndex
CREATE UNIQUE INDEX "EventAttendee_qrToken_key" ON "EventAttendee"("qrToken");
