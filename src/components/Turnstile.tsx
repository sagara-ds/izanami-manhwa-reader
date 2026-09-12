"use client";

import { forwardRef, useEffect, useId, useImperativeHandle, useRef } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: Record<string, unknown>) => string;
      reset: (id?: string) => void;
      remove: (id?: string) => void;
    };
    __turnstileLoaded?: boolean;
  }
}

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

export interface TurnstileHandle {
  reset: () => void;
}

export function isTurnstileConfigured(): boolean {
  return SITE_KEY.length > 0;
}

export const Turnstile = forwardRef<TurnstileHandle, { onVerify: (token: string | null) => void }>(
  function Turnstile({ onVerify }, ref) {
    const el = useRef<HTMLDivElement>(null);
    const widgetId = useRef<string | null>(null);
    const cbId = useId();

    useImperativeHandle(ref, () => ({
      reset() {
        if (widgetId.current && window.turnstile) {
          try {
            window.turnstile.reset(widgetId.current);
          } catch {}
        }
        onVerify(null);
      },
    }));

    useEffect(() => {
      if (!SITE_KEY || !el.current) return;
      let cancelled = false;

      function render() {
        if (cancelled || !el.current || !window.turnstile || widgetId.current) return;
        widgetId.current = window.turnstile.render(el.current, {
          sitekey: SITE_KEY,
          theme: "dark",
          callback: (token: string) => onVerify(token),
          "expired-callback": () => onVerify(null),
          "error-callback": () => onVerify(null),
        });
      }

      if (window.turnstile) {
        render();
      } else if (!window.__turnstileLoaded) {
        window.__turnstileLoaded = true;
        const s = document.createElement("script");
        s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
        s.async = true;
        s.defer = true;
        s.onload = render;
        document.head.appendChild(s);
      } else {
        const t = setInterval(() => {
          if (window.turnstile) {
            clearInterval(t);
            render();
          }
        }, 200);
        return () => clearInterval(t);
      }

      return () => {
        cancelled = true;
        if (widgetId.current && window.turnstile) {
          try {
            window.turnstile.remove(widgetId.current);
          } catch {}
          widgetId.current = null;
        }
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cbId]);

    if (!SITE_KEY) return null;
    return <div ref={el} className="flex justify-center" />;
  },
);
