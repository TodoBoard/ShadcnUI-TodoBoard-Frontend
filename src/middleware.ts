import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { env } from "@/config/env";

const PROTECTED_PATHS = ["/board"] as const;
const AUTH_PATHS = ["/auth/login", "/auth/register"] as const;

interface JWTPayload {
  sub: string;
  exp: number;
  iat?: number;
}

async function verifyToken(token: string): Promise<boolean> {
  try {
    const secret = new TextEncoder().encode(env.jwtSecretKey);
    const { payload } = await jwtVerify(token, secret, {
      algorithms: ["HS256"],
      requiredClaims: ["sub", "exp"],
      clockTolerance: 60,
    });

    const jwtPayload = payload as unknown as JWTPayload;
    const currentTime = Math.floor(Date.now() / 1000);

    return currentTime < jwtPayload.exp;
  } catch {
    return false;
  }
}

function addSecurityHeaders(headers: Headers): void {
  headers.set("X-Frame-Options", "DENY");
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  headers.set(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains"
  );
}

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  addSecurityHeaders(response.headers);

  const token = request.cookies.get("auth-token");
  const isValidToken = token ? await verifyToken(token.value) : false;

  const isAuthPath = AUTH_PATHS.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  if (isAuthPath && isValidToken) {
    return NextResponse.redirect(new URL("/board/home", request.url));
  }

  const isProtectedPath = PROTECTED_PATHS.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  if (isProtectedPath) {
    if (!isValidToken) {
      if (token) {
        const response = NextResponse.redirect(
          new URL("/auth/login", request.url)
        );
        response.cookies.delete("auth-token");
        return response;
      }

      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (token?.value) {
      response.headers.set("Authorization", `Bearer ${token.value}`);
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public/).*)"],
};
