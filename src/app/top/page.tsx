import type { Metadata } from "next";
import { BrowseView } from "@/components/BrowseView";

export const metadata: Metadata = { title: "Rating Tertinggi — Izanami" };
export const revalidate = 180;

export default async function TopPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page ?? "1", 10) || 1);
  return <BrowseView kind="top" page={page} format="all" basePath="/top" />;
}
