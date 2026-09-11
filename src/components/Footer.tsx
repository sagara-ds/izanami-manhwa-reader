import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-[#27272a] py-8 px-4 text-center text-xs text-[#52525b]">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="font-display">
          <span className="font-bold text-[#a1a1aa]">Izanami</span> — Platform
          Baca Manga, Manhwa &amp; Manhua Indonesia
        </p>

        <nav aria-label="Footer" className="flex items-center gap-4 text-[#71717a]">
          <Link href="/" className="hover:text-white">
            Home
          </Link>
          <Link href="/explore" className="hover:text-white">
            Explore
          </Link>
          <Link href="/library" className="hover:text-white">
            Library
          </Link>
          <a
            href="https://shinigamiscans.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#a1a1aa] hover:text-[#06b6d4]"
          >
            Data: Shinigami
          </a>
        </nav>
      </div>
      <p className="mt-4 text-[11px] text-[#3f3f46]">
        Content-first, dark-mode AMOLED native, high density reader.
      </p>
    </footer>
  );
}
