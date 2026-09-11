import type { Metadata } from "next";
import { Inter, DM_Sans } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Izanami — Platform Baca Manga, Manhwa & Manhua Indonesia",
  description: "Platform baca komik online terlengkap berbahasa Indonesia dengan dark mode default dan high-density reader.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      className={`${inter.variable} ${dmSans.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#0d0d0d] text-[#f4f4f5] font-sans selection:bg-[#7c3aed]/30 selection:text-[#ddd6fe]">
        {children}
      </body>
    </html>
  );
}
