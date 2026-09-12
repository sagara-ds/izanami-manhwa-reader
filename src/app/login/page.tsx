"use client";

import { Suspense, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { ButtonCorner } from "@/components/ButtonCorner";
import { isAuthConfigured, useAuth } from "@/components/AuthProvider";
import { Turnstile, isTurnstileConfigured, type TurnstileHandle } from "@/components/Turnstile";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#09090b] text-white">
      <Nav />
      <main className="flex-1 w-full max-w-md mx-auto px-4 py-10">
        <Suspense fallback={<div className="bg-[#111114] border border-white/10 rounded-3xl p-8 text-center text-xs text-zinc-500">Memuat…</div>}>
          <LoginBox />
        </Suspense>
      </main>
      <ButtonCorner />
      <Footer />
    </div>
  );
}

function LoginBox() {
  const router = useRouter();
  const sp = useSearchParams();
  const { signInMagicLink } = useAuth();
  const [email, setEmail] = useState("");
  const [captcha, setCaptcha] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(sp.get("error") === "link_expired" ? "Link kedaluwarsa atau tidak valid. Kirim link baru." : null);
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const turnstileRef = useRef<TurnstileHandle>(null);

  async function send() {
    if (!isAuthConfigured()) {
      setError("Auth belum dikonfigurasi (env Supabase kosong).");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Masukkan email yang valid.");
      return;
    }
    if (isTurnstileConfigured() && !captcha) {
      setError("Selesaikan verifikasi anti-spam dulu.");
      return;
    }
    if (cooldown > 0) return;
    setBusy(true);
    setError(null);
    try {
      await signInMagicLink(email.trim(), captcha ?? undefined);
      setSent(true);
      setCooldown(60);
      const t = setInterval(() => {
        setCooldown((c) => {
          if (c <= 1) {
            clearInterval(t);
            return 0;
          }
          return c - 1;
        });
      }, 1000);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal kirim link");
    } finally {
      // Token single-use: selalu reset agar token berikutnya fresh.
      turnstileRef.current?.reset();
      setCaptcha(null);
      setBusy(false);
    }
  }

  return (
    <div className="bg-[#111114] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl">
      <div className="flex gap-2 mb-6">
        <span className="flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold text-zinc-600 text-center select-none">
          Social
        </span>
        <span className="flex-1 px-4 py-2.5 rounded-lg bg-[#3b82f6] text-white text-sm font-bold text-center">
          Link Email
        </span>
      </div>

      {!sent ? (
        <div className="flex flex-col gap-3">
          <h1 className="text-xl font-extrabold text-center mb-1">Masuk dengan Link Email</h1>
          <p className="text-xs text-zinc-500 text-center">
            Masukkan email, klik link yang kami kirim. Tanpa password, tanpa kode.
          </p>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            onKeyDown={(e) => {
              if (e.key === "Enter") void send();
            }}
            className="w-full px-4 py-3 bg-white/5 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#3b82f6]/50 border border-transparent"
          />
          <Turnstile ref={turnstileRef} onVerify={setCaptcha} />
          <button
            onClick={() => void send()}
            disabled={busy || cooldown > 0}
            className="w-full py-3 rounded-xl bg-white text-black text-sm font-bold hover:bg-zinc-200 disabled:opacity-50 transition-all cursor-pointer"
          >
            {busy ? "Mengirim…" : cooldown > 0 ? `Kirim ulang (${cooldown}s)` : "Kirim link masuk"}
          </button>
          <button
            onClick={() => router.push("/")}
            className="text-xs text-zinc-500 hover:text-white cursor-pointer"
          >
            Lanjut tanpa login
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3 items-center py-4">
          <h1 className="text-xl font-extrabold text-center">Cek inbox kamu</h1>
          <p className="text-xs text-zinc-400 text-center">
            Link masuk dikirim ke <span className="text-white font-semibold">{email.trim()}</span>.
            Klik link itu untuk masuk.
          </p>
          <button
            onClick={() => router.push("/")}
            className="text-xs font-semibold text-[#3b82f6] hover:underline cursor-pointer"
          >
            Kembali ke beranda →
          </button>
        </div>
      )}

      {error && <p className="mt-3 text-xs text-red-400 text-center">{error}</p>}
    </div>
  );
}
