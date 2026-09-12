"use client";
/* eslint-disable react-hooks/set-state-in-effect -- sync localStorage once on mount */

import { useEffect, useState } from "react";
import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { ButtonCorner } from "@/components/ButtonCorner";
import { BookmarkIcon, HistoryIcon, InfoIcon } from "@/components/icons";
import { getLocalStats, wipeLocalData } from "@/lib/storage";

const CARDS = [
  {
    id: "mission",
    title: "Tentang Izanami",
    body: [
      "Izanami adalah pembaca manga, manhwa, dan manhua berbahasa Indonesia — cepat dan tanpa iklan yang mengganggu.",
      "Semua judul dimuat langsung dari penyedia pihak ketiga. Kami tidak meng-host, menyimpan, atau mendistribusikan file gambar apa pun di server sendiri.",
    ],
  },
  {
    id: "privacy",
    title: "Data & Privasi",
    body: [
      "Izanami tidak memiliki sistem akun dan tidak mengirim data kamu ke mana pun.",
      "Bookmark, riwayat baca, dan tanda chapter yang sudah dibaca semuanya disimpan di localStorage browser kamu sendiri. Membersihkan data situs akan menghapusnya secara permanen.",
    ],
  },
  {
    id: "rules",
    title: "Aturan Komunitas",
    body: [
      "Dukung penulis dan penerbit aslinya bila judul yang kamu baca sudah tersedia resmi di wilayahmu.",
      "Jangan menjual ulang, membingkai ulang, atau mengklaim konten dari situs ini sebagai milikmu.",
    ],
  },
  {
    id: "support",
    title: "Dukung Pengembang",
    body: [
      "Izanami dikembangkan sebagai proyek pribadi dan open-source.",
      "Cara terbaik untuk mendukung: laporkan bug, sarankan fitur, atau bagikan ke sesama pembaca.",
    ],
  },
];

export function InfoView() {
  const [open, setOpen] = useState("mission");
  const [stats, setStats] = useState({ bookmarks: 0, history: 0, read: 0 });

  function readStats() {
    setStats(getLocalStats());
  }

  useEffect(() => {
    readStats();
  }, []);

  const tiles = [
    { label: "Bookmark", value: stats.bookmarks, href: "/bookmark", Icon: BookmarkIcon },
    { label: "Riwayat", value: stats.history, href: "/history", Icon: HistoryIcon },
    { label: "Chapter dibaca", value: stats.read, href: null as string | null, Icon: InfoIcon },
  ];

  return (
    <div className="bg-[#09090b] text-white min-h-screen flex flex-col">
      <Nav />
      <main className="max-w-3xl mx-auto px-3 sm:px-4 py-6 flex-1 w-full flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <span className="w-1 h-9 bg-[#3b82f6] rounded-full flex-shrink-0" />
          <div>
            <h1 className="text-lg sm:text-xl font-black tracking-tight">Info</h1>
            <p className="text-zinc-500 text-[11px] sm:text-xs mt-0.5">
              Tentang aplikasi, data kamu, dan cara mendukung
            </p>
          </div>
          <span className="ml-auto px-2.5 py-1 bg-[#3b82f6]/15 text-[#3b82f6] border border-[#3b82f6]/25 rounded-lg text-[10px] font-black">
            v0.1.0
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          {tiles.map(({ label, value, href, Icon }) => {
            const inner = (
              <>
                <Icon className="w-4 h-4 text-[#3b82f6]" />
                <span className="text-lg sm:text-xl font-black leading-none">{value}</span>
                <span className="text-[10px] text-zinc-500 text-center leading-tight">{label}</span>
              </>
            );
            return href ? (
              <Link
                key={label}
                href={href}
                className="flex flex-col items-center gap-1 p-3 sm:p-4 bg-[#141417] rounded-xl border border-zinc-800/60 transition-all hover:border-[#3b82f6]/40"
              >
                {inner}
              </Link>
            ) : (
              <div
                key={label}
                className="flex flex-col items-center gap-1 p-3 sm:p-4 bg-[#141417] rounded-xl border border-zinc-800/60"
              >
                {inner}
              </div>
            );
          })}
        </div>

        <div className="flex flex-col gap-2.5">
          {CARDS.map((c) => {
            const isOpen = open === c.id;
            return (
              <div
                key={c.id}
                className={`bg-[#141417] rounded-xl border overflow-hidden transition-colors ${
                  isOpen ? "border-[#3b82f6]/40" : "border-zinc-800/60"
                }`}
              >
                <button
                  onClick={() => setOpen(isOpen ? "" : c.id)}
                  className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-white/[0.03] transition-colors cursor-pointer"
                >
                  <span className="font-bold text-sm flex-1">{c.title}</span>
                  <span className={`text-[10px] text-zinc-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}>
                    ▾
                  </span>
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 pt-0 flex flex-col gap-2 border-t border-zinc-800/60">
                    {c.body.map((p, i) => (
                      <p key={i} className="text-zinc-400 text-xs leading-relaxed pt-2">
                        {p}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="bg-[#141417] rounded-xl border border-zinc-800/60 p-4 flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm">Hapus data lokal</p>
            <p className="text-zinc-500 text-[11px] mt-0.5 leading-relaxed">
              Menghapus semua bookmark, riwayat, dan tanda chapter dibaca dari browser ini.
            </p>
          </div>
          <button
            onClick={() => {
              if (!confirm("Hapus semua bookmark, riwayat, dan tanda chapter dibaca?")) return;
              wipeLocalData();
              readStats();
            }}
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-[#3b82f6]/10 text-[#3b82f6] border border-[#3b82f6]/30 hover:bg-[#3b82f6] hover:text-white transition-all cursor-pointer flex-shrink-0"
          >
            Hapus semua
          </button>
        </div>

        <p className="text-center text-[10px] text-zinc-600 leading-relaxed">
          Izanami tidak meng-host file media apa pun. Seluruh konten disediakan oleh layanan pihak ketiga.
        </p>
      </main>
      <ButtonCorner />
      <Footer />
    </div>
  );
}
