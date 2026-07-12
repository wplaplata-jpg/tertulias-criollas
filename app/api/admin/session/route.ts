import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import {
  clearAdminSessionResponse,
  createAdminSessionResponse,
  isAdminAuthenticated,
  verifyAdminPassword
} from "@/lib/admin-auth";
import { getClientIp, isRateLimited } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  return NextResponse.json({
    authenticated: isAdminAuthenticated(request)
  });
}

export async function POST(request: NextRequest) {
  const clientIp = getClientIp(request);

  if (
    isRateLimited({
      key: `admin-login:${clientIp}`,
      limit: 10,
      windowMs: 15 * 60 * 1000
    })
  ) {
    return NextResponse.json(
      { success: false, message: "Demasiados intentos. Intentá nuevamente más tarde." },
      { status: 429 }
    );
  }

  const body = (await request.json().catch(() => ({}))) as {
    password?: unknown;
  };

  if (!verifyAdminPassword(body.password)) {
    return NextResponse.json(
      { success: false, message: "La contraseña ingresada no es correcta." },
      { status: 401 }
    );
  }

  return createAdminSessionResponse();
}

export async function DELETE() {
  return clearAdminSessionResponse();
}
