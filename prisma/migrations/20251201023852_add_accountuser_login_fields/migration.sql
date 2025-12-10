/*
  Warnings:

  - A unique constraint covering the columns `[loginId]` on the table `AccountUser` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "AccountUser" ADD COLUMN "loginId" TEXT;
ALTER TABLE "AccountUser" ADD COLUMN "passwordHash" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "AccountUser_loginId_key" ON "AccountUser"("loginId");
