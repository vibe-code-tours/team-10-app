import { createAdminClient } from "@/lib/supabase/server";

// Memory cache fallback for fast response
let memoryImageMap: Record<string, string> | null = null;

export const DEFAULT_CATEGORY_IMAGES: Record<string, string> = {
  beauty: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=200&auto=format&fit=crop&q=80",
  clothing: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=200&auto=format&fit=crop&q=80",
  computer: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=200&auto=format&fit=crop&q=80",
  mobile: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200&auto=format&fit=crop&q=80",
  electronics: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=200&auto=format&fit=crop&q=80",
  gaming: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=200&auto=format&fit=crop&q=80",
  shoes: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&auto=format&fit=crop&q=80",
  watches: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=200&auto=format&fit=crop&q=80",
  health: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=200&auto=format&fit=crop&q=80",
  furniture: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200&auto=format&fit=crop&q=80",
  books: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=200&auto=format&fit=crop&q=80",
  traditional: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=200&auto=format&fit=crop&q=80",
  "yoe yar traditional": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=200&auto=format&fit=crop&q=80",
};

export function resolveCategoryImage(
  cat: { name: string; slug?: string; image_url?: string | null },
  categoryMap: Record<string, string>
): string {
  const slugKey = (cat.slug || "").toLowerCase();
  const nameKey = (cat.name || "").toLowerCase();

  if (slugKey && categoryMap[slugKey]) return categoryMap[slugKey];
  if (nameKey && categoryMap[nameKey]) return categoryMap[nameKey];
  if (cat.image_url) return cat.image_url;
  if (slugKey && DEFAULT_CATEGORY_IMAGES[slugKey]) return DEFAULT_CATEGORY_IMAGES[slugKey];
  if (nameKey && DEFAULT_CATEGORY_IMAGES[nameKey]) return DEFAULT_CATEGORY_IMAGES[nameKey];

  return "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=200&auto=format&fit=crop&q=80";
}

export async function getCategoryImageMap(): Promise<Record<string, string>> {
  try {
    const adminSupabase = createAdminClient();
    const { data, error } = await adminSupabase.storage
      .from("category-images")
      .download("category_map.json");

    if (!error && data) {
      const text = await data.text();
      const map = JSON.parse(text) || {};
      memoryImageMap = { ...memoryImageMap, ...map };
      return memoryImageMap!;
    }
  } catch (e) {
    console.warn("Error fetching category image map from storage:", e);
  }

  return memoryImageMap || {};
}

export async function setCategoryImage(slug: string, imageUrl: string | null): Promise<void> {
  const slugKey = slug.toLowerCase();
  const currentMap = await getCategoryImageMap();

  if (imageUrl) {
    currentMap[slugKey] = imageUrl;
  } else {
    delete currentMap[slugKey];
  }

  memoryImageMap = { ...currentMap };

  try {
    const adminSupabase = createAdminClient();
    const buffer = Buffer.from(JSON.stringify(currentMap, null, 2));
    await adminSupabase.storage
      .from("category-images")
      .upload("category_map.json", buffer, {
        contentType: "application/json",
        upsert: true,
      });
  } catch (e) {
    console.warn("Failed to update category image map in storage:", e);
  }
}
