/*
  Warnings:

  - Made the column `pillsPerDose` on table `Medicine` required. This step will fail if there are existing NULL values in that column.
  - Made the column `totalPills` on table `Medicine` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Medicine" ALTER COLUMN "pillsPerDose" SET NOT NULL,
ALTER COLUMN "totalPills" SET NOT NULL;
