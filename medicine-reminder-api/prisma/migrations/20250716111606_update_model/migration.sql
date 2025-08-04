/*
  Warnings:

  - You are about to drop the column `prescriptionId` on the `Medicine` table. All the data in the column will be lost.
  - You are about to drop the `Prescription` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Medicine" DROP CONSTRAINT "Medicine_prescriptionId_fkey";

-- DropForeignKey
ALTER TABLE "Prescription" DROP CONSTRAINT "Prescription_userEmail_fkey";

-- AlterTable
ALTER TABLE "Medicine" DROP COLUMN "prescriptionId";

-- DropTable
DROP TABLE "Prescription";

-- AddForeignKey
ALTER TABLE "Medicine" ADD CONSTRAINT "Medicine_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "User"("email") ON DELETE CASCADE ON UPDATE CASCADE;
