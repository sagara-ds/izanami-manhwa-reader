import type { Metadata } from "next";
import { BookmarkView } from "@/components/BookmarkView";

export const metadata: Metadata = { title: "Bookmark — Izanami" };

export default function BookmarkPage() {
  return <BookmarkView />;
}
