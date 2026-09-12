"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  BookmarkIcon,
  CheckIcon,
  CloseIcon,
  CompassIcon,
  FireIcon,
  HistoryIcon,
  HomeIcon,
  InfoIcon,
  MenuIcon,
  SearchIcon,
  StarIcon,
  TagIcon,
} from "./icons";
import { SearchBox } from "./SearchBox";
import { LoginModal } from "./LoginModal";
import { isAuthConfigured, useAuth } from "./AuthProvider";

const MAIN_LINKS = [
  { name: "Home", href: "/", Icon: HomeIcon },
  { name: "Explore", href: "/explore", Icon: CompassIcon },
  { name: "Populer", href: "/popular", Icon: FireIcon },
  { name: "Top", href: "/top", Icon: StarIcon },
  { name: "Tamat", href: "/completed", Icon: CheckIcon },
  { name: "Genre", href: "/genres", Icon: TagIcon },
];

const LIB_LINKS = [
  { name: "Bookmark", href: "/bookmark", Icon: BookmarkIcon },
  { name: "Riwayat", href: "/history", Icon: HistoryIcon },
  { name: "Info", href: "/info", Icon: InfoIcon },
];

export function Nav() {
  const [open, setOpen] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const path = usePathname();
  const { user, loading, signOut } = useAuth();
  const isActive = (href: string) => (href === "/" ? path === "/" : path.startsWith(href));
  const initial = (user?.email?.[0] ?? user?.id?.[0] ?? "?").toUpperCase();

  return (
    <>
      <header className="sticky top-0 z-50 bg-[#09090b]/95 backdrop-blur-md border-b border-zinc-800/60">
        <div className="h-[3px] w-full bg-gradient-to-r from-[#3b82f6] via-[#1d4ed8] to-[#3b82f6]" />
        <div className="max-w-screen-2xl mx-auto flex items-center gap-3 px-3 sm:px-4 h-14">
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <span className="text-base sm:text-lg font-black tracking-tight text-white">
              Iza<span className="text-[#3b82f6]">nami</span>
            </span>
          </Link>

          <nav aria-label="Navigasi Utama" className="hidden lg:flex items-center gap-0.5 ml-2">
            {MAIN_LINKS.map(({ name, href, Icon }) => (
              <Link
                key={href}
                href={href}
                className={`relative flex items-center gap-1.5 px-3 py-2 text-[13px] font-semibold transition-colors ${
                  isActive(href) ? "text-[#3b82f6]" : "text-zinc-400 hover:text-white"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {name}
                {isActive(href) && (
                  <span className="absolute left-2 right-2 -bottom-px h-[2px] bg-[#3b82f6] rounded-full" />
                )}
              </Link>
            ))}
          </nav>

          <SearchBox className="relative hidden md:block flex-1 max-w-sm ml-auto" />

          <div className="flex items-center gap-1 ml-auto md:ml-0 flex-shrink-0">
            {LIB_LINKS.slice(0, 2).map(({ name, href, Icon }) => (
              <Link
                key={href}
                href={href}
                title={name}
                aria-label={name}
                className={`hidden sm:flex w-9 h-9 items-center justify-center rounded-lg transition-all ${
                  isActive(href)
                    ? "text-[#3b82f6] bg-[#3b82f6]/10"
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className="w-4 h-4" />
              </Link>
            ))}

            <button
              onClick={() => setShowSearch((p) => !p)}
              aria-label="Cari"
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
            >
              <SearchIcon className="w-4 h-4" />
            </button>

            <div className="relative">
              <button
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                aria-expanded={open}
                aria-haspopup="true"
                aria-label="Menu Pengguna"
                className="w-9 h-9 rounded-lg bg-[#3b82f6]/10 border border-[#3b82f6]/25 hidden sm:flex items-center justify-center text-xs font-bold text-[#3b82f6] cursor-pointer hover:bg-[#3b82f6]/20 transition-all"
              >
                {loading ? "…" : initial}
              </button>

              {open && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
                  <div className="absolute right-0 mt-2 w-48 bg-[#141417] border border-zinc-800 rounded-xl shadow-2xl py-1.5 text-xs text-white z-50">
                    <div className="px-3 py-2 border-b border-zinc-800">
                      <p className="font-semibold text-white truncate">
                        {user?.email ?? "Pembaca Izanami"}
                      </p>
                      <p className="text-[10px] text-zinc-500">
                        {user ? "Tersinkron ke cloud" : "Mode lokal"}
                      </p>
                    </div>
                    {user ? (
                      <>
                        <Link
                          href="/bookmark"
                          onClick={() => setOpen(false)}
                          className="block px-3 py-2 text-zinc-400 hover:text-white hover:bg-white/5"
                        >
                          Komik Favorit
                        </Link>
                        <Link
                          href="/history"
                          onClick={() => setOpen(false)}
                          className="block px-3 py-2 text-zinc-400 hover:text-white hover:bg-white/5"
                        >
                          Riwayat Baca
                        </Link>
                        <button
                          onClick={() => {
                            setOpen(false);
                            void signOut();
                          }}
                          className="w-full text-left px-3 py-2 text-zinc-400 hover:text-white hover:bg-white/5 cursor-pointer"
                        >
                          Keluar
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => {
                          setOpen(false);
                          setLoginOpen(true);
                        }}
                        className="w-full text-left block px-3 py-2 font-bold text-[#3b82f6] hover:bg-[#3b82f6]/10 cursor-pointer"
                      >
                        {isAuthConfigured() ? "Masuk" : "Masuk (env kosong)"}
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>

            <button
              onClick={() => setDrawer(true)}
              aria-label="Menu"
              className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 cursor-pointer"
            >
              <MenuIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        {showSearch && (
          <div className="md:hidden border-t border-zinc-800/60 px-3 py-2.5">
            <SearchBox
              autoFocus
              placeholder="Cari judul manhwa, manga, manhua…"
              onNavigate={() => setShowSearch(false)}
            />
          </div>
        )}
      </header>

      {drawer && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60] lg:hidden"
          onClick={() => setDrawer(false)}
        >
          <aside
            className="absolute right-0 top-0 h-full w-72 max-w-[85vw] bg-[#0e0e11] border-l border-zinc-800 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 h-14 border-b border-zinc-800">
              <span className="text-base font-black text-white">
                Iza<span className="text-[#3b82f6]">nami</span>
              </span>
              <button
                onClick={() => setDrawer(false)}
                aria-label="Tutup menu"
                className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 cursor-pointer"
              >
                <CloseIcon className="w-4 h-4" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto p-3 flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <p className="px-3 pb-1 text-[10px] font-bold uppercase tracking-widest text-zinc-600">
                  Jelajahi
                </p>
                {MAIN_LINKS.map(({ name, href, Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setDrawer(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all border ${
                      isActive(href)
                        ? "text-[#3b82f6] bg-[#3b82f6]/10 border-[#3b82f6]/25"
                        : "text-zinc-300 hover:text-white hover:bg-white/5 border-transparent"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {name}
                  </Link>
                ))}
              </div>
              <div className="flex flex-col gap-1">
                <p className="px-3 pb-1 text-[10px] font-bold uppercase tracking-widest text-zinc-600">
                  Koleksi
                </p>
                {LIB_LINKS.map(({ name, href, Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setDrawer(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all border ${
                      isActive(href)
                        ? "text-[#3b82f6] bg-[#3b82f6]/10 border-[#3b82f6]/25"
                        : "text-zinc-300 hover:text-white hover:bg-white/5 border-transparent"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {name}
                  </Link>
                ))}
              </div>
              <div className="flex flex-col gap-1">
                <p className="px-3 pb-1 text-[10px] font-bold uppercase tracking-widest text-zinc-600">
                  Akun
                </p>
                {user ? (
                  <button
                    onClick={() => {
                      setDrawer(false);
                      void signOut();
                    }}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-zinc-300 hover:text-white hover:bg-white/5 border border-transparent cursor-pointer text-left"
                  >
                    Keluar ({user.email ?? "user"})
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setDrawer(false);
                      setLoginOpen(true);
                    }}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-[#3b82f6] bg-[#3b82f6]/10 border border-[#3b82f6]/25 cursor-pointer text-left"
                  >
                    Masuk
                  </button>
                )}
              </div>
            </nav>
          </aside>
        </div>
      )}
      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  );
}
