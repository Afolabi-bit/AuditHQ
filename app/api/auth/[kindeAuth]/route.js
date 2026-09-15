import { handleAuth } from "@kinde-oss/kinde-auth-nextjs/server";
import { cookies } from "next/headers";

const authHandler = handleAuth();

export async function GET(request, context) {
  const { pathname } = request.nextUrl;
  const cookieStore = await cookies();

  // If callback and the state cookie was dropped by Brave Shields or browser tracking protection
  if (pathname.endsWith("/kinde_callback")) {
    const state = request.nextUrl.searchParams.get("state");
    if (state && !cookieStore.get("ac-state-key")) {
      cookieStore.set("ac-state-key", state, {
        path: "/",
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        sameSite: "none",
      });
    }
  }

  const response = await authHandler(request, context);

  // Upgrade login/register cookies with Partitioned for cross-site cookie privacy compatibility (Brave, Safari, Chrome)
  if (pathname.endsWith("/login") || pathname.endsWith("/register")) {
    const setCookieHeaders = response.headers.getSetCookie();
    if (setCookieHeaders && setCookieHeaders.length > 0) {
      response.headers.delete("set-cookie");
      for (const header of setCookieHeaders) {
        let updated = header.replace(/SameSite=[^;]+/i, "SameSite=None");
        if (!/;\s*Secure/i.test(updated)) {
          updated += "; Secure";
        }
        if (!/;\s*Partitioned/i.test(updated)) {
          updated += "; Partitioned";
        }
        response.headers.append("set-cookie", updated);
      }
    }
  }

  return response;
}

