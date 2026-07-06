import { createHash, timingSafeEqual } from "crypto";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const ADMIN_COOKIE_NAME = "tertulias_admin_session";

function getPasswordHash() {
  const password = process.env.ADMIN_PANEL_PASSWORD;

  if (!password) {
    return null;
  }

  return createHash("sha256").update(password).digest("hex");
}

function safeCompare(value: string, expected: string) {
  const valueBuffer = Buffer.from(value);
  const expectedBuffer = Buffer.from(expected);

  if (valueBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return timingSafeEqual(valueBuffer, expectedBuffer);
}

export function isAdminAuthenticated(request: NextRequest) {
  const passwordHash = getPasswordHash();
  const sessionValue = request.cookies.get(ADMIN_COOKIE_NAME)?.value;

  if (!passwordHash || !sessionValue) {
    return false;
  }

  return safeCompare(sessionValue, passwordHash);
}

export function verifyAdminPassword(password: unknown) {
  const passwordHash = getPasswordHash();

  if (!passwordHash || typeof password !== "string") {
    return false;
  }

  const submittedHash = createHash("sha256").update(password).digest("hex");

  return safeCompare(submittedHash, passwordHash);
}

export function createAdminSessionResponse() {
  const passwordHash = getPasswordHash();
  const response = NextResponse.json({ success: true });

  if (!passwordHash) {
    return NextResponse.json(
      { success: false, message: "ADMIN_PANEL_PASSWORD no está configurada." },
      { status: 500 }
    );
  }

  response.cookies.set({
    name: ADMIN_COOKIE_NAME,
    value: passwordHash,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8
  });

  return response;
}

export function clearAdminSessionResponse() {
  const response = NextResponse.json({ success: true });

  response.cookies.set({
    name: ADMIN_COOKIE_NAME,
    value: "",
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0
  });

  return response;
}

export function unauthorizedAdminResponse() {
  return NextResponse.json(
    { success: false, message: "No autorizado." },
    { status: 401 }
  );
}
