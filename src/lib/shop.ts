import { cache } from "react";
import { redirect } from "next/navigation";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  priceEur: number;
  quantity: number;
  imagePath?: string;
  published: boolean;
};

export type CartItem = {
  id: string;
  productId: string;
  productName: string;
  productImagePath?: string;
  unitPriceEur: number;
  quantity: number;
  subtotalEur: number;
  availableQuantity: number;
};

export type CartSummary = {
  items: CartItem[];
  totalEur: number;
};

function normalizePublicImagePath(imagePath: string | null): string | undefined {
  if (!imagePath) return undefined;
  let s = imagePath.trim();
  if (!s) return undefined;
  if (/^https?:\/\//i.test(s)) return s;
  s = s
    .replace(/^(\.\.\/)+public\//i, "/")
    .replace(/^\.\/public\//i, "/")
    .replace(/^public\//i, "/");
  if (!s.startsWith("/")) s = `/${s}`;
  return s.replace(/\/{2,}/g, "/");
}

export const getCurrentUser = cache(async () => {
  if (!hasSupabaseEnv()) return null;
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});

export const getCurrentProfile = cache(async () => {
  if (!hasSupabaseEnv()) return null;
  const user = await getCurrentUser();
  if (!user) return null;
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("profiles")
    .select("user_id, email, role")
    .eq("user_id", user.id)
    .maybeSingle();
  return data;
});

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/compte");
  return user;
}

export async function requireAdmin() {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "admin") redirect("/compte");
  return profile;
}

export async function listPublishedProducts(): Promise<Product[]> {
  if (!hasSupabaseEnv()) return [];
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("products")
    .select("id, slug, name, description, price_eur, quantity, image_path, published")
    .eq("published", true)
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    description: p.description ?? "",
    priceEur: Number(p.price_eur),
    quantity: p.quantity ?? 0,
    imagePath: normalizePublicImagePath(p.image_path),
    published: p.published ?? false,
  }));
}

export async function getPublishedProductBySlug(
  slug: string,
): Promise<Product | null> {
  if (!hasSupabaseEnv()) return null;
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("products")
    .select("id, slug, name, description, price_eur, quantity, image_path, published")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (error || !data) return null;
  return {
    id: data.id,
    slug: data.slug,
    name: data.name,
    description: data.description ?? "",
    priceEur: Number(data.price_eur),
    quantity: data.quantity ?? 0,
    imagePath: normalizePublicImagePath(data.image_path),
    published: data.published ?? false,
  };
}

export async function listAllProductsForAdmin(): Promise<Product[]> {
  if (!hasSupabaseEnv()) return [];
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("products")
    .select("id, slug, name, description, price_eur, quantity, image_path, published")
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return data.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    description: p.description ?? "",
    priceEur: Number(p.price_eur),
    quantity: p.quantity ?? 0,
    imagePath: normalizePublicImagePath(p.image_path),
    published: p.published ?? false,
  }));
}

export async function getOrCreateActiveCartId(userId: string): Promise<string | null> {
  if (!hasSupabaseEnv()) return null;
  const supabase = await createSupabaseServerClient();
  const { data: existing } = await supabase
    .from("carts")
    .select("id")
    .eq("user_id", userId)
    .eq("status", "active")
    .maybeSingle();
  if (existing?.id) return existing.id;

  const { data: created, error } = await supabase
    .from("carts")
    .insert({ user_id: userId, status: "active" })
    .select("id")
    .single();
  if (error) return null;
  return created.id;
}

export async function getCartSummary(userId: string): Promise<CartSummary> {
  if (!hasSupabaseEnv()) return { items: [], totalEur: 0 };
  const cartId = await getOrCreateActiveCartId(userId);
  if (!cartId) return { items: [], totalEur: 0 };

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("cart_items")
    .select(
      "id, quantity, product_id, products:product_id(id, name, price_eur, quantity, image_path)",
    )
    .eq("cart_id", cartId);

  if (error || !data) return { items: [], totalEur: 0 };

  const items = data.flatMap((row): CartItem[] => {
      const product = Array.isArray(row.products) ? row.products[0] : row.products;
      if (!product) return [];
      const unitPriceEur = Number(product.price_eur ?? 0);
      const qty = row.quantity ?? 0;
      return [
        {
          id: row.id,
          productId: row.product_id,
          productName: product.name,
          productImagePath: normalizePublicImagePath(product.image_path),
          unitPriceEur,
          quantity: qty,
          subtotalEur: unitPriceEur * qty,
          availableQuantity: product.quantity ?? 0,
        },
      ];
    });

  return {
    items,
    totalEur: items.reduce((acc, item) => acc + item.subtotalEur, 0),
  };
}

export async function getCurrentUserCartCount(): Promise<number> {
  const user = await getCurrentUser();
  if (!user) return 0;
  const summary = await getCartSummary(user.id);
  return summary.items.reduce((acc, item) => acc + item.quantity, 0);
}

export async function listOrdersForUser(userId: string) {
  if (!hasSupabaseEnv()) return [];
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("orders")
    .select("id, total_eur, status, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return data;
}

export async function listOrdersForAdmin() {
  if (!hasSupabaseEnv()) return [];
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("orders")
    .select("id, user_id, total_eur, status, created_at")
    .order("created_at", { ascending: false })
    .limit(100);
  if (error || !data) return [];
  return data;
}

export function formatPrice(euros: number): string {
  if (!Number.isFinite(euros)) return "—";
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(euros);
}
