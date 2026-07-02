CREATE TYPE "ReservationStatus" AS ENUM ('PENDING', 'CONTACTED', 'CONFIRMED', 'CANCELLED');

CREATE TABLE "Reservation" (
  "id" TEXT NOT NULL,
  "nombreApellido" TEXT NOT NULL,
  "documento" TEXT NOT NULL,
  "fechaNacimiento" TIMESTAMP(3) NOT NULL,
  "email" TEXT NOT NULL,
  "residencia" TEXT NOT NULL,
  "status" "ReservationStatus" NOT NULL DEFAULT 'PENDING',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "Reservation_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Reservation_email_idx" ON "Reservation"("email");
CREATE INDEX "Reservation_status_idx" ON "Reservation"("status");
CREATE INDEX "Reservation_createdAt_idx" ON "Reservation"("createdAt");
