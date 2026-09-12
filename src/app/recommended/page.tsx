import type { Metadata } from "next";
import { BrowseView } from "@/components/BrowseView";

export const metadata: Metadata = { title: "Rekomendasi — Izanami" };
export const revalidate = 180;

export default async function RecommendedPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; format?: string }>;
}) {
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page ?? "1", 10) || 1);
  const format = ["all", "manhwa", "manga", "manhua"].includes(sp.format ?? "") ? sp.format! : "manhwa";
  return <BrowseView kind="recommended" page={page} format={format} basePath="/recommended" />;
}
