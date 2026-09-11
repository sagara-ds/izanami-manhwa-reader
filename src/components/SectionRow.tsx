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
        <h2 className="font-display text-lg sm:text-xl font-bold tracking-tight text-[#f4f4f5] flex items-center gap-2.5">
          <span
            className="w-1 h-5 rounded-full bg-gradient-to-b from-[#7c3aed] to-[#06b6d4] inline-block"
            aria-hidden="true"
          />
          {title}
        </h2>

        {actionHref && (
          <Link
            href={actionHref}
            className="text-xs text-[#a1a1aa] hover:text-[#06b6d4] transition-colors flex items-center gap-1 font-medium"
          >
            {actionText ?? "Lihat Semua"}
            <span aria-hidden="true">→</span>
          </Link>
        )}
      </div>

      {children}
    </section>
  );
}
