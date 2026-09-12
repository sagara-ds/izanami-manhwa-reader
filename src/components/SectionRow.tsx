import Link from "next/link";

export function SectionRow({
  title,
  actionHref,
  actionText,
  children,
}: {
  title: string;
  actionHref?: string;
  actionText?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-black text-sm sm:text-base tracking-tight text-white flex items-center gap-2.5">
          <span
            className="w-1 h-5 rounded-full bg-[#3b82f6] inline-block"
            aria-hidden="true"
          />
          {title}
        </h2>

        {actionHref && (
          <Link
            href={actionHref}
            className="text-[11px] font-semibold text-zinc-500 hover:text-[#3b82f6] transition-colors flex items-center gap-1 whitespace-nowrap"
          >
            {actionText ?? "Lihat Semua"}
            <span aria-hidden="true">›</span>
          </Link>
        )}
      </div>

      {children}
    </section>
  );
}
