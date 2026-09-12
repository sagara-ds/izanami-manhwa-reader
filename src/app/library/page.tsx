import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { ButtonCorner } from "@/components/ButtonCorner";
import { BookmarkIcon, HistoryIcon, InfoIcon } from "@/components/icons";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Perpustakaan Saya — Izanami",
  description: "Bookmark, riwayat baca, dan info akun lokal kamu di Izanami.",
};

const HUB = [
  {
    name: "Bookmark",
    desc: "Judul yang kamu simpan di browser ini.",
    href: "/bookmark",
    Icon: BookmarkIcon,
  },
  {
    name: "Riwayat Baca",
    desc: "Lanjutkan chapter terakhir yang kamu buka.",
    href: "/history",
    Icon: HistoryIcon,
  },
  {
    name: "Info & Data Lokal",
    desc: "Statistik, privasi, dan hapus data lokal.",
    href: "/info",
    Icon: InfoIcon,
  },
];

export default function LibraryPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#09090b] text-white">
      <Nav />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="font-display text-2xl font-extrabold tracking-tight mb-2 flex items-center gap-2.5">
          <span className="w-1 h-6 rounded-full bg-[#3b82f6]" aria-hidden="true" />
          Perpustakaan
        </h1>
        <p className="text-xs text-zinc-500 mb-8">
          Semua tersimpan lokal di browser — tanpa akun, tanpa sinkron server.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {HUB.map(({ name, desc, href, Icon }) => (
            <Link
              key={href}
              href={href}
              className="group bg-[#141417] rounded-2xl border border-zinc-800/60 hover:border-[#3b82f6]/40 p-5 transition-all"
            >
              <Icon className="w-6 h-6 text-[#3b82f6] mb-3" />
              <p className="font-bold text-sm mb-1 group-hover:text-[#3b82f6] transition-colors">{name}</p>
              <p className="text-xs text-zinc-500 leading-relaxed">{desc}</p>
            </Link>
          ))}
        </div>
      </main>
      <ButtonCorner />
      <Footer />
    </div>
  );
}
