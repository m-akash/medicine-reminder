/*
  Warnings:

  - Added the required column `scheduledTime` to the `Medicine` table without a default value. This is not possible if the table is not empty.
  - Added the required column `taken` to the `Medicine` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Medicine" ADD COLUMN     "scheduledTime" TIMESTAMP(3) NOT NULL,
DROP COLUMN "taken",
ADD COLUMN     "taken" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "fcmToken" TEXT;
