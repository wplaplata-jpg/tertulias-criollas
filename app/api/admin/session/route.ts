import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import {
  clearAdminSessionResponse,
  createAdminSessionResponse,
  isAdminAuthenticated,
  verifyAdminPassword
} from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  return NextResponse.json({
    authenticated: isAdminAuthenticated(request)
  });
}

export async function POST(request: NextRequest) {
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
