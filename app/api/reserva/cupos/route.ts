import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const MAX_CAPACITY = 25;
const ACTIVE_RESERVATION_STATUSES = ["PENDING", "CONFIRMED"] as const;

export async function GET() {
  const reservedSeats = await prisma.reservation.count({
    where: {
      status: {
        in: [...ACTIVE_RESERVATION_STATUSES]
      }
    }
  });

  return NextResponse.json({
    maxCapacity: MAX_CAPACITY,
    reservedSeats,
    remainingSeats: Math.max(0, MAX_CAPACITY - reservedSeats)
  });
}
