import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { ComicGrid } from "@/components/ComicGrid";
import { MOCK_POPULAR_WEEKLY, MOCK_RECOMMENDATIONS } from "@/lib/mock-data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Perpustakaan Saya — Izanami",
  description: "Komik favorit dan riwayat bacaan Anda di Izanami.",
};

export default function LibraryPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0d0d0d]">
      <Nav />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="font-display text-2xl font-extrabold text-white tracking-tight mb-2 flex items-center gap-2.5">
          <span className="w-1 h-6 rounded-full bg-gradient-to-b from-[#7c3aed] to-[#06b6d4]" aria-hidden="true" />
          Perpustakaan
        </h1>
        <p className="text-xs text-[#71717a] mb-8">
          Sinkronisasi akun segera hadir — data lokal ditampilkan sebagai contoh.
        </p>

        <section aria-label="Lanjutkan Membaca" className="mb-10">
          <h2 className="font-display text-lg font-bold text-white mb-4">
            Lanjutkan Membaca
          </h2>
          <ComicGrid comics={MOCK_POPULAR_WEEKLY.slice(0, 6)} />
        </section>

        <section aria-label="Favorit">
          <h2 className="font-display text-lg font-bold text-white mb-4">
            Favorit
          </h2>
          <ComicGrid comics={MOCK_RECOMMENDATIONS.slice(0, 6)} />
        </section>
      </main>

      <Footer />
    </div>
  );
}
