"use client";

import { countryFlag } from "@/lib/format";

function tone(code?: string): string {
  switch ((code || "").toUpperCase()) {
    case "KR":
      return "bg-sky-500/20 text-sky-300 border-sky-500/30";
    case "JP":
      return "bg-rose-500/20 text-rose-300 border-rose-500/30";
    case "CN":
      return "bg-amber-500/20 text-amber-300 border-amber-500/30";
    default:
      return "bg-zinc-700/40 text-zinc-300 border-zinc-600/40";
  }
}

export function CountryBadge({ code, className = "" }: { code?: string; className?: string }) {
  if (!code) return null;
  return (
    <span
      className={`inline-flex items-center px-1.5 py-0.5 rounded-md border text-[9px] font-black leading-none ${tone(code)} ${className}`}
    >
      {countryFlag(code)}
    </span>
  );
}
