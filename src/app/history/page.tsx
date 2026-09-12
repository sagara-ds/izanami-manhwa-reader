import type { Metadata } from "next";
import { HistoryView } from "@/components/HistoryView";

export const metadata: Metadata = { title: "Riwayat Baca — Izanami" };

export default function HistoryPage() {
  return <HistoryView />;
}
