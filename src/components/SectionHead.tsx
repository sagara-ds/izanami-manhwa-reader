"use client";

import Link from "next/link";
import type { ComponentType } from "react";

export function SectionHead({
  title,
  href,
  hrefLabel,
  Icon,
  iconClass = "text-[#3b82f6]",
  children,
}: {
  title: string;
  href?: string;
  hrefLabel?: string;
  Icon?: ComponentType<{ className?: string }>;
  iconClass?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
      <div className="flex items-center gap-2.5 min-w-0">
        <span className="w-1 h-5 bg-[#3b82f6] rounded-full flex-shrink-0" aria-hidden="true" />
        {Icon && <Icon className={`w-4 h-4 flex-shrink-0 ${iconClass}`} />}
        <h2 className="font-black text-sm sm:text-base tracking-tight truncate text-white">{title}</h2>
      </div>
      <div className="flex items-center gap-2">
        {children}
        {href && (
          <Link
            href={href}
            className="flex items-center gap-1 text-[11px] font-semibold text-zinc-500 hover:text-[#3b82f6] transition-colors whitespace-nowrap"
          >
            {hrefLabel ?? "Lihat semua"}
            <span aria-hidden="true" className="text-[8px]">›</span>
          </Link>
        )}
      </div>
    </div>
  );
}
