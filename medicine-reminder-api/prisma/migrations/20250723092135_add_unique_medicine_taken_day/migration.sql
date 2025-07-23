/*
  Warnings:

  - A unique constraint covering the columns `[medicineId,date]` on the table `MedicineTakenDay` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "MedicineTakenDay_medicineId_date_key" ON "MedicineTakenDay"("medicineId", "date");
