"use client";

/* eslint-disable react-hooks/set-state-in-effect -- reset modal form state each time it opens */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthConfigured, useAuth } from "./AuthProvider";
import { Turnstile, isTurnstileConfigured } from "./Turnstile";

export function LoginModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const { signInMagicLink } = useAuth();
  const [email, setEmail] = useState("");
  const [captcha, setCaptcha] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (!open) return;
    setError(null);
    setBusy(false);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

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
      setBusy(false);
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Masuk"
      onClick={onClose}
      className="fixed inset-0 z-[70] flex items-center justify-center p-4"
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md bg-[#111114] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl"
      >
        <button
          onClick={onClose}
          aria-label="Tutup"
          className="absolute -top-3 -right-3 w-9 h-9 grid place-items-center rounded-full bg-[#1c1c21] border border-white/10 text-zinc-300 hover:text-white cursor-pointer"
        >
          ✕
        </button>

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
            <h2 className="text-xl font-extrabold text-white text-center mb-1">Masuk dengan Link Email</h2>
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
            <Turnstile onVerify={setCaptcha} />
            <button
              onClick={() => void send()}
              disabled={busy || cooldown > 0}
              className="w-full py-3 rounded-xl bg-white text-black text-sm font-bold hover:bg-zinc-200 disabled:opacity-50 transition-all cursor-pointer"
            >
              {busy ? "Mengirim…" : cooldown > 0 ? `Kirim ulang (${cooldown}s)` : "Kirim link masuk"}
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3 items-center py-4">
            <h2 className="text-xl font-extrabold text-white text-center">Cek inbox kamu</h2>
            <p className="text-xs text-zinc-400 text-center">
              Link masuk dikirim ke <span className="text-white font-semibold">{email.trim()}</span>.
              Klik link itu untuk masuk — halaman ini boleh ditutup.
            </p>
            <button
              onClick={() => {
                onClose();
                router.refresh();
              }}
              className="text-xs font-semibold text-[#3b82f6] hover:underline cursor-pointer"
            >
              Saya sudah klik link →
            </button>
          </div>
        )}

        {error && <p className="mt-3 text-xs text-red-400 text-center">{error}</p>}
      </div>
    </div>
  );
}
