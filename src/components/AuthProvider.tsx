"use client";
/* eslint-disable react-hooks/set-state-in-effect -- sync supabase session once on mount */

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { syncNow } from "@/lib/sync";

interface AuthCtx {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signInMagicLink: (email: string, captchaToken?: string) => Promise<void>;
  signOut: () => Promise<void>;
  accessToken: () => Promise<string | null>;
}

const Ctx = createContext<AuthCtx | null>(null);

const hasEnv =
  typeof process.env.NEXT_PUBLIC_SUPABASE_URL === "string" &&
  process.env.NEXT_PUBLIC_SUPABASE_URL.length > 0 &&
  typeof process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY === "string" &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.length > 0;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!hasEnv) {
      setLoading(false);
      return;
    }
    let alive = true;
    const supabase = createClient();
    supabase.auth.getSession().then(({ data }) => {
      if (!alive) return;
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setLoading(false);
    });
    const { data } = supabase.auth.onAuthStateChange((event, next) => {
      setSession(next);
      setUser(next?.user ?? null);
      setLoading(false);
      // Upload data lokal yang menumpuk saat logged-out, lalu tarik dari cloud.
      if (event === "SIGNED_IN") {
        void syncNow();
      }
    });
    return () => {
      alive = false;
      data.subscription.unsubscribe();
    };
  }, []);

  const signInMagicLink = useCallback(async (email: string, captchaToken?: string) => {
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/`,
        ...(captchaToken ? { captchaToken } : {}),
      },
    });
    if (error) throw error;
  }, []);

  const signOut = useCallback(async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
  }, []);

  const accessToken = useCallback(async () => {
    if (!hasEnv) return null;
    const supabase = createClient();
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token ?? null;
  }, []);

  const value = useMemo(
    () => ({ user, session, loading, signInMagicLink, signOut, accessToken }),
    [user, session, loading, signInMagicLink, signOut, accessToken],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth(): AuthCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

export function isAuthConfigured(): boolean {
  return hasEnv;
}
