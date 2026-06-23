// proxy.ts
import { NextResponse } from "next/server";
import NextAuth from "next-auth";
import { authConfig } from "./auth.config"; // A könnyűsúlyú konfiguráció


const { auth } = NextAuth(authConfig);

export default  auth((req) => {
  const { nextUrl } = req;
  

  const isLoggedIn = !!req.auth; 
  
  console.log(req.auth);
 
  

  const isOnboarded = req.auth?.user && (req.auth.user as any).onboarded;
  //console.log(isOnboarded);
  
  const isAuthRoute = nextUrl.pathname.startsWith("/login") || nextUrl.pathname.startsWith("/register");
  const isOnboardingRoute = nextUrl.pathname.startsWith("/onboarding");
  const isDashboardRoute = nextUrl.pathname.startsWith("/dashboard");

  if (!isLoggedIn && (isDashboardRoute || isOnboardingRoute)) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  if (isLoggedIn && !isOnboarded && !isOnboardingRoute) {
    return NextResponse.redirect(new URL("/onboarding", nextUrl));
  }

  if (isLoggedIn && isOnboarded && (isOnboardingRoute || isAuthRoute)) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  if (isLoggedIn && isOnboarded && nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  return NextResponse.next();
});


export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};