import Link from "next/link";

const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "Explore", href: "/explore" },
  { name: "Terpopuler", href: "/popular" },
  { name: "Rating Tertinggi", href: "/top" },
  { name: "Update Terbaru", href: "/updates" },
  { name: "Komik Tamat", href: "/completed" },
];

const INFO_LINKS = [
  { name: "Daftar Genre", href: "/genres" },
  { name: "Bookmark", href: "/bookmark" },
  { name: "Riwayat Baca", href: "/history" },
  { name: "Info & Privasi", href: "/info" },
];

export function Footer() {
  return (
    <footer className="bg-[#111116] border-t border-zinc-800/50 mt-auto w-full">
      <div className="max-w-screen-2xl mx-auto px-4 py-8 md:py-10">
        <div className="flex flex-col md:flex-row md:justify-between gap-6 md:gap-8">
          <div className="max-w-xs">
            <Link href="/" className="flex items-center gap-2.5 mb-3">
              <span className="text-lg font-bold text-white">
                Iza<span className="text-[#3b82f6]">nami</span>
              </span>
            </Link>
            <p className="text-zinc-500 text-sm leading-relaxed">
              Baca manga, manhwa, dan manhua berbahasa Indonesia. Dark mode default,
              update cepat setiap hari.
            </p>
          </div>

          <div className="flex gap-8 sm:gap-16 md:contents">
            <div className="flex flex-col gap-3">
              <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Navigasi
              </p>
              <ul className="flex flex-col gap-2">
                {NAV_LINKS.map((item) => (
                  <li key={`${item.href}-${item.name}`}>
                    <Link
                      href={item.href}
                      className="text-zinc-500 text-sm hover:text-[#3b82f6] transition-colors duration-200"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-3">
              <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Info
              </p>
              <ul className="flex flex-col gap-2">
                {INFO_LINKS.map((item) => (
                  <li key={`${item.href}-${item.name}`}>
                    <Link
                      href={item.href}
                      className="text-zinc-500 text-sm hover:text-[#3b82f6] transition-colors duration-200"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <hr className="my-6 md:my-8 border-zinc-800/50" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs text-zinc-600">
            © 2026 Izanami. All Rights Reserved.
          </span>
          <span className="text-[11px] text-zinc-700">
            Content-first, dark-mode native, high density reader.
          </span>
        </div>
      </div>
    </footer>
  );
}
