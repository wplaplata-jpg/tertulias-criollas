-- AlterTable
ALTER TABLE "Reservation" ADD COLUMN "publicCode" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Reservation_publicCode_key" ON "Reservation"("publicCode");
