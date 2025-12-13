import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { decodeJwt } from "jose";

export async function middleware(request: NextRequest) {
  // Skip middleware for server actions (POST requests)
  if (request.method === "POST") {
    return NextResponse.next();
  }

  // Get auth token from cookies
  const cookieStore = await cookies();
  const token = cookieStore.get("firebaseAuthToken")?.value;

  // Allow non-logged-in users to access the login page
  if (!token && request.nextUrl.pathname.startsWith("/login")) {
    return NextResponse.next();
  }

  // Redirect logged-in users away from the login page
  if (token && request.nextUrl.pathname.startsWith("/login")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // If no token, redirect to homepage
  if (!token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Decode token and check if user is admin
  // Note: This only decodes the JWT without verifying the signature.
  // Full token verification happens in server actions using Firebase Admin SDK.
  // Middleware runs on Edge runtime which doesn't support Firebase Admin.
  try {
    const decodedToken = decodeJwt(token);

    // Manually check for token expiration, as decodeJwt doesn't validate it.
    if (decodedToken.exp && decodedToken.exp * 1000 < Date.now()) {
      throw new Error("Token expired");
    }

    if (!decodedToken.admin) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  } catch {
    // Token is malformed or expired, redirect to homepage and clear cookies
    const response = NextResponse.redirect(new URL("/", request.url));
    response.cookies.delete("firebaseAuthToken");
    response.cookies.delete("firebaseAuthRefreshToken");
    return response;
  }

  // User appears to be authenticated and admin, allow access
  // Actual verification happens in server actions
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin-dashboard", "/admin-dashboard/:path*", "/login"],
};
