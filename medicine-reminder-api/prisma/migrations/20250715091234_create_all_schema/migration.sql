/*
  Warnings:

  - You are about to drop the column `userId` on the `Prescription` table. All the data in the column will be lost.
  - Added the required column `userEmail` to the `Prescription` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Prescription" DROP CONSTRAINT "Prescription_userId_fkey";

-- AlterTable
ALTER TABLE "Prescription" DROP COLUMN "userId",
ADD COLUMN     "userEmail" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Prescription" ADD CONSTRAINT "Prescription_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "User"("email") ON DELETE CASCADE ON UPDATE CASCADE;
