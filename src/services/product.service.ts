import { SupabaseClient } from "@supabase/supabase-js";

export interface ProductQueryParams {
  search?: string;
  category?: string;
  brand?: string;
  sort?: string;
  stock?: string;
  page: number;
  limit: number;
}

export async function getProducts(
  supabase: SupabaseClient,
  params: ProductQueryParams,
) {
  const offset = (params.page - 1) * params.limit;
  let query = supabase
    .from("products")
    .select("*, seller:users(id, full_name, shop_name)", { count: "exact" });

  if (params.search) {
    query = query.ilike("title", `%${params.search}%`);
  }

  if (params.category) {
    query = query.eq("category", params.category);
  }

  if (params.brand) {
    query = query.ilike("brand", params.brand);
  }

  if (params.stock) {
    if (params.stock === "out_of_stock") {
      query = query.eq("stock", 0);
    } else if (params.stock === "low_stock") {
      query = query.gt("stock", 0).lt("stock", 10);
    } else if (params.stock === "in_stock") {
      query = query.gte("stock", 10);
    }
  }

  // Apply sorting
  if (params.sort === "price_asc") {
    query = query.order("price", { ascending: true });
  } else if (params.sort === "price_desc") {
    query = query.order("price", { ascending: false });
  } else if (params.sort === "stock_asc") {
    query = query.order("stock", { ascending: true });
  } else if (params.sort === "stock_desc") {
    query = query.order("stock", { ascending: false });
  } else {
    query = query.order("created_at", { ascending: false });
  }

  query = query.range(offset, offset + params.limit - 1);
  return await query;
}

export async function getCategories(supabase: SupabaseClient) {
  const { data } = await supabase
    .from("categories")
    .select("name, slug")
    .order("name", { ascending: true });
  return data || [];
}

export async function getCategoryCounts(supabase: SupabaseClient) {
  const { data: allProducts } = await supabase
    .from("products")
    .select("category");
  const counts: Record<string, number> = {};
  let total = 0;

  if (allProducts) {
    for (const p of allProducts) {
      if (p.category) {
        counts[p.category] = (counts[p.category] || 0) + 1;
        total++;
      }
    }
  }
  return { counts, total };
}

export async function getBrandCounts(
  supabase: SupabaseClient,
  category?: string,
) {
  let query = supabase.from("products").select("brand");
  if (category) {
    query = query.eq("category", category);
  }

  const { data: brandProducts } = await query;
  const counts: Record<string, number> = {};
  let total = 0;

  if (brandProducts) {
    for (const p of brandProducts) {
      if (p.brand) {
        counts[p.brand] = (counts[p.brand] || 0) + 1;
        total++;
      }
    }
  }
  return { counts, total, uniqueBrands: Object.keys(counts).sort() };
}

export async function getAdminProductStats(supabase: SupabaseClient) {
  const { data: allStats } = await supabase
    .from("products")
    .select("price, stock");
  const totalProducts = allStats?.length || 0;
  const outOfStock = allStats?.filter((p) => p.stock === 0).length || 0;
  const lowStock =
    allStats?.filter((p) => p.stock > 0 && p.stock < 10).length || 0;
  const totalStockSum =
    allStats?.reduce((sum, p) => sum + (p.stock || 0), 0) || 0;

  return { totalProducts, outOfStock, lowStock, totalStockSum };
}
