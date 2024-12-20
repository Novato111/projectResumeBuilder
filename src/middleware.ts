import { NextResponse } from "next/server";
import { createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/stripe-webhook",
]);

export function middleware(request) {
  if (isPublicRoute(request)) {
    return NextResponse.next();
  }

  // Redirect to sign-in if unauthenticated
  return NextResponse.redirect(new URL("/sign-in", request.url));
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
