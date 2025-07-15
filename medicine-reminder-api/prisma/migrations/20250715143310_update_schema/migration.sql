/*
  Warnings:

  - You are about to drop the column `reminderTime` on the `Reminder` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Reminder" DROP COLUMN "reminderTime";

-- CreateTable
CREATE TABLE "ReminderTime" (
    "id" TEXT NOT NULL,
    "reminderId" TEXT NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReminderTime_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ReminderTime" ADD CONSTRAINT "ReminderTime_reminderId_fkey" FOREIGN KEY ("reminderId") REFERENCES "Reminder"("id") ON DELETE CASCADE ON UPDATE CASCADE;
