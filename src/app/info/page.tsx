import type { Metadata } from "next";
import { InfoView } from "@/components/InfoView";

export const metadata: Metadata = {
  title: "Info — Izanami",
  description: "Tentang Izanami, data lokal kamu, dan cara mendukung.",
};

export default function InfoPage() {
  return <InfoView />;
}
