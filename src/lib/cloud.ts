import { createClient } from "@/lib/supabase/client";

async function userId(): Promise<string | null> {
  try {
    const supabase = createClient();
    const { data } = await supabase.auth.getUser();
    return data.user?.id ?? null;
  } catch {
    return null;
  }
}

async function ensureProfile(): Promise<string | null> {
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;
  if (!user) return null;
  await supabase.from("users").upsert(
    { id: user.id, email: user.email ?? null },
    { onConflict: "id" },
  );
  return user.id;
}

export async function isCloudAvailable(): Promise<boolean> {
  return (await userId()) !== null;
}

export async function cloudGetFavorites(): Promise<{ series_slug: string; title: string; cover: string }[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("favorites")
    .select("series_slug, title, cover")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function cloudAddFavorite(seriesSlug: string, title: string, cover: string): Promise<void> {
  const uid = await ensureProfile();
  if (!uid) throw new Error("not authenticated");
  const supabase = createClient();
  const { error } = await supabase.from("favorites").upsert(
    { user_id: uid, series_slug: seriesSlug, title, cover },
    { onConflict: "user_id,series_slug" },
  );
  if (error) throw error;
}

export async function cloudRemoveFavorite(seriesSlug: string): Promise<void> {
  const uid = await userId();
  if (!uid) throw new Error("not authenticated");
  const supabase = createClient();
  const { error } = await supabase
    .from("favorites")
    .delete()
    .eq("user_id", uid)
    .eq("series_slug", seriesSlug);
  if (error) throw error;
}

export async function cloudGetHistory(): Promise<{ series_slug: string; chapter_id: string; page: number }[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("history")
    .select("series_slug, chapter_id, page")
    .order("updated_at", { ascending: false })
    .limit(50);
  if (error) throw error;
  return data ?? [];
}

export async function cloudSaveHistory(seriesSlug: string, chapterId: string, page = 1): Promise<void> {
  const uid = await ensureProfile();
  if (!uid) throw new Error("not authenticated");
  const supabase = createClient();
  const { error } = await supabase.from("history").upsert(
    { user_id: uid, series_slug: seriesSlug, chapter_id: chapterId, page, updated_at: new Date().toISOString() },
    { onConflict: "user_id,series_slug" },
  );
  if (error) throw error;
}
