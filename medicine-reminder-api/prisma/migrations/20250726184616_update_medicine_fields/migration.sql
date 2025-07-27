/*
  Warnings:

  - You are about to drop the `Pharmacy` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `frequency` on table `Medicine` required. This step will fail if there are existing NULL values in that column.
  - Made the column `startDate` on table `Medicine` required. This step will fail if there are existing NULL values in that column.
  - Made the column `durationDays` on table `Medicine` required. This step will fail if there are existing NULL values in that column.
  - Made the column `dosesPerDay` on table `Medicine` required. This step will fail if there are existing NULL values in that column.
  - Made the column `originalDurationDays` on table `Medicine` required. This step will fail if there are existing NULL values in that column.
  - Made the column `originalTotalPills` on table `Medicine` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Medicine" ALTER COLUMN "frequency" SET NOT NULL,
ALTER COLUMN "startDate" SET NOT NULL,
ALTER COLUMN "durationDays" SET NOT NULL,
ALTER COLUMN "dosesPerDay" SET NOT NULL,
ALTER COLUMN "originalDurationDays" SET NOT NULL,
ALTER COLUMN "originalTotalPills" SET NOT NULL;

-- DropTable
DROP TABLE "Pharmacy";
