import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest, response: NextResponse) {
  const session = request.cookies.get("session");

  console.log("session...", session);

  //Return to /login if don't have a session
  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  //Call the authentication endpoint

  try {
    await fetch(`${process.env.NEXT_PUBLIC_API_BASEURL}/auth/login`, {
      headers: {
        Cookie: `session=${session?.value}`,
      },
    });
  } catch (error) {
    console.log("[LOGIN FAILED]", error);
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

//Add your protected routes
export const config = {
  matcher: ["/caller-dashboard", "/ai-research"],
};
