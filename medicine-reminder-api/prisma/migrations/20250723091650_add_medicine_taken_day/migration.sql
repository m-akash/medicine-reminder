-- CreateTable
CREATE TABLE "MedicineTakenDay" (
    "id" TEXT NOT NULL,
    "medicineId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "taken" TEXT NOT NULL,

    CONSTRAINT "MedicineTakenDay_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MedicineTakenDay" ADD CONSTRAINT "MedicineTakenDay_medicineId_fkey" FOREIGN KEY ("medicineId") REFERENCES "Medicine"("id") ON DELETE CASCADE ON UPDATE CASCADE;
