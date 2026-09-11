export function Announcement({ text }: { text?: string }) {
  return (
    <aside
      aria-label="Pengumuman"
      className="animate-shimmer w-full py-2 px-4 sm:px-8 bg-gradient-to-r from-[#3b0764] via-[#155e75] to-[#0e7490] border-b border-white/10 text-center text-xs sm:text-sm font-medium text-white tracking-wide flex items-center justify-center gap-2"
    >
      <span className="inline-block" aria-hidden="true">
        📢
      </span>
      <span>
        {text ??
          "API Shinigami terhubung — baca komik Indonesia resmi, cepat, dan tanpa iklan mengganggu."}
      </span>
    </aside>
  );
}
