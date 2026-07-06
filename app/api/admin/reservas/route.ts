import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import {
  isAdminAuthenticated,
  unauthorizedAdminResponse
} from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const MAX_CAPACITY = 25;
const ACTIVE_RESERVATION_STATUSES = ["PENDING", "CONFIRMED"] as const;

export async function GET(request: NextRequest) {
  if (!isAdminAuthenticated(request)) {
    return unauthorizedAdminResponse();
  }

  const [
    reservations,
    totalReservations,
    pendingReservations,
    confirmedReservations,
    cancelledReservations,
    occupiedSeats
  ] =
    await Promise.all([
      prisma.reservation.findMany({
        orderBy: {
          createdAt: "desc"
        },
        select: {
          id: true,
          publicCode: true,
          nombreApellido: true,
          documento: true,
          fechaNacimiento: true,
          email: true,
          telefono: true,
          residencia: true,
          status: true,
          createdAt: true
        }
      }),
      prisma.reservation.count(),
      prisma.reservation.count({
        where: {
          status: "PENDING"
        }
      }),
      prisma.reservation.count({
        where: {
          status: "CONFIRMED"
        }
      }),
      prisma.reservation.count({
        where: {
          status: "CANCELLED"
        }
      }),
      prisma.reservation.count({
        where: {
          status: {
            in: [...ACTIVE_RESERVATION_STATUSES]
          }
        }
      })
    ]);

  return NextResponse.json({
    reservations,
    stats: {
      totalReservations,
      pendingReservations,
      confirmedReservations,
      cancelledReservations,
      occupiedSeats,
      remainingSeats: Math.max(0, MAX_CAPACITY - occupiedSeats)
    }
  });
}
