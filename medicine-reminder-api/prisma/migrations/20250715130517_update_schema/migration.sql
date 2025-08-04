/*
  Warnings:

  - Added the required column `userEmail` to the `Medicine` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Medicine" ADD COLUMN     "userEmail" TEXT NOT NULL;
