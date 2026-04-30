import { type NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const tokenHash = requestUrl.searchParams.get("token_hash");
  const type = requestUrl.searchParams.get("type");
  const next = requestUrl.searchParams.get("next") || "/catalogue";

  const supabase = await createSupabaseServerClient();

  if (code) {
    await supabase.auth.exchangeCodeForSession(code);
  } else if (tokenHash && type) {
    const otpType =
      type === "recovery" ||
      type === "invite" ||
      type === "email" ||
      type === "email_change"
        ? type
        : null;
    if (!otpType) {
      return NextResponse.redirect(new URL("/compte?error=forgot-password-failed", requestUrl.origin));
    }
    await supabase.auth.verifyOtp({
      type: otpType,
      token_hash: tokenHash,
    });
  }

  return NextResponse.redirect(new URL(next, requestUrl.origin));
}
