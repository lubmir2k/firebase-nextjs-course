import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { auth } from "@/firebase/server";

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

  // Verify token and check if user is admin
  try {
    const decodedToken = await auth.verifyIdToken(token);

    if (!decodedToken.admin) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  } catch {
    // Token is invalid or expired, redirect to homepage and clear cookies
    const response = NextResponse.redirect(new URL("/", request.url));
    response.cookies.delete("firebaseAuthToken");
    response.cookies.delete("firebaseAuthRefreshToken");
    return response;
  }

  // User is authenticated and is admin, allow access
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin-dashboard", "/admin-dashboard/:path*", "/login"],
};
