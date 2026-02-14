import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function middleware(req: any) {
  const session = await auth.api.getSession({
    headers: req.headers,
  });

  if (!session && !req.nextUrl.pathname.startsWith("/login") && !req.nextUrl.pathname.startsWith("/register")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}
