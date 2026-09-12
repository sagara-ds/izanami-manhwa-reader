import type { Metadata } from "next";
import { BrowseView } from "@/components/BrowseView";

export const metadata: Metadata = { title: "Update Terbaru — Izanami" };
export const revalidate = 120;

export default async function UpdatesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; format?: string }>;
}) {
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page ?? "1", 10) || 1);
  const format = ["all", "manhwa", "manga", "manhua"].includes(sp.format ?? "") ? sp.format! : "all";
  return <BrowseView kind="updates" page={page} format={format} basePath="/updates" />;
}
