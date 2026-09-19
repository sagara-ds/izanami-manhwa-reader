import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const GENERIC_OK = "Jika email valid, link masuk sudah dikirim. Cek inbox/spam.";
const GENERIC_FAIL = "Gagal mengirim link. Coba lagi beberapa saat.";

async function verifyTurnstile(token: string, ip?: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  // If no secret configured, don't block dev — but production should set it.
  if (!secret) return true;
  if (!token) return false;
  try {
    const form = new FormData();
    form.append("secret", secret);
    form.append("response", token);
    if (ip && ip !== "unknown") form.append("remoteip", ip);
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: form,
      signal: AbortSignal.timeout(8000),
    });
    const json = (await res.json()) as { success?: boolean };
    return json.success === true;
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  // 5 attempts / hour / IP — magic links are email-bomb vectors.
  const rl = checkRateLimit(req, { limit: 5, windowS: 3600, prefix: "api:auth-otp" });
  if (!rl.allowed) return rateLimitResponse(rl.retryAfter);

  let body: { email?: unknown; captchaToken?: unknown };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: GENERIC_FAIL }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim().slice(0, 254) : "";
  const captchaToken = typeof body.captchaToken === "string" ? body.captchaToken.slice(0, 2048) : "";

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Masukkan email yang valid." }, { status: 400 });
  }

  const siteKeyConfigured = (process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "").length > 0;
  const secretConfigured = (process.env.TURNSTILE_SECRET_KEY ?? "").length > 0;
  if (siteKeyConfigured && secretConfigured) {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
    const ok = await verifyTurnstile(captchaToken, ip);
    if (!ok) {
      return NextResponse.json({ error: "Verifikasi anti-spam gagal. Coba lagi." }, { status: 400 });
    }
  }

  try {
    const supabase = await createClient();
    const origin = new URL(req.url).origin;
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: `${origin}/auth/callback?next=/`,
        ...(captchaToken ? { captchaToken } : {}),
      },
    });
    if (error) {
      console.error("[auth/otp] signInWithOtp failed:", error.message);
      // Generic to avoid account enumeration.
      return NextResponse.json({ message: GENERIC_OK }, { status: 200 });
    }
    return NextResponse.json({ message: GENERIC_OK }, { status: 200 });
  } catch (e) {
    console.error("[auth/otp] unexpected:", e instanceof Error ? e.message : e);
    return NextResponse.json({ error: GENERIC_FAIL }, { status: 500 });
  }
}
