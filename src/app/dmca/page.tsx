import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "DMCA & Hak Cipta — Izanami",
  description:
    "Kebijakan hak cipta, atribusi sumber, dan prosedur takedown konten di Izanami.",
};

export default function DmcaPage() {
  return (
    <div className="bg-[#09090b] text-white min-h-screen flex flex-col">
      <Nav />
      <main className="max-w-3xl mx-auto px-4 py-8 flex-1 w-full flex flex-col gap-5">
        <div className="flex items-center gap-3">
          <span className="w-1 h-9 bg-[#3b82f6] rounded-full flex-shrink-0" />
          <div>
            <h1 className="text-xl font-black tracking-tight">DMCA & Hak Cipta</h1>
            <p className="text-zinc-500 text-xs mt-0.5">
              Atribusi sumber dan prosedur penghapusan konten
            </p>
          </div>
        </div>

        <section className="bg-[#141417] rounded-xl border border-zinc-800/60 p-5 flex flex-col gap-3 text-sm leading-relaxed text-zinc-300">
          <p>
            Izanami adalah agregator pembaca. Seluruh gambar komik, judul, dan metadata
            dimuat langsung dari penyedia pihak ketiga dan tetap menjadi milik
            penerbit / pemegang hak masing-masing.
          </p>
          <p>
            Kami tidak meng-host, menyimpan, atau mendistribusikan ulang file gambar
            di server kami. Kami tidak mengklaim kepemilikan atas konten tersebut.
          </p>
          <h2 className="font-bold text-white mt-2">Dukung rilis resmi</h2>
          <p className="text-xs text-zinc-400">
            Jika judul yang kamu baca sudah tersedia resmi di wilayahmu, dukung
            penulis dan penerbit aslinya dengan membaca / membeli versi resmi.
          </p>
          <h2 className="font-bold text-white mt-2">Prosedur takedown</h2>
          <ol className="list-decimal ml-5 text-xs text-zinc-400 flex flex-col gap-1.5">
            <li>Kirim judul + URL halaman Izanami yang dilaporkan + bukti kepemilikan hak.</li>
            <li>Kirim dari email domain resmi pemegang hak.</li>
            <li>Kami verifikasi dan hapus / blokir indeks dalam maks. 2×24 jam kerja.</li>
          </ol>
          <p className="text-xs text-zinc-400">
            Kontak takedown: cantumkan di sini email resmi kamu (mis.{" "}
            <span className="text-zinc-200 font-mono">dmca@domain-kamu.id</span>).
            Ganti dengan alamat aktif sebelum deploy ke produksi.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
