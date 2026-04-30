"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  getOrCreateActiveCartId,
  requireAdmin,
  requireUser,
} from "@/lib/shop";

function normalizeImagePath(raw: string): string | null {
  const s = raw.trim();
  if (!s) return null;
  if (/^https?:\/\//i.test(s)) return s;
  let out = s
    .replace(/^(\.\.\/)+public\//i, "/")
    .replace(/^\.\/public\//i, "/")
    .replace(/^public\//i, "/");
  if (!out.startsWith("/")) out = `/${out}`;
  return out.replace(/\/{2,}/g, "/");
}

function slugify(text: string): string {
  return (
    text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "") || "produit"
  );
}

export async function signUpAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  if (!email || password.length < 6) {
    redirect("/compte?error=signup-invalid");
  }
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signUp({ email, password });
  if (error) redirect(`/compte?error=${encodeURIComponent(error.message)}`);
  redirect("/compte?message=verify-email");
}

export async function signInAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) redirect("/compte?error=login-failed");
  redirect("/catalogue");
}

export async function signOutAction() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function addToCartAction(formData: FormData) {
  const user = await requireUser();
  const productId = String(formData.get("productId") ?? "");
  const quantity = Math.max(1, Number(formData.get("quantity") ?? 1));
  const supabase = await createSupabaseServerClient();
  const cartId = await getOrCreateActiveCartId(user.id);
  if (!cartId || !productId) {
    redirect("/panier?error=add-failed");
  }

  const { data: existing } = await supabase
    .from("cart_items")
    .select("id, quantity")
    .eq("cart_id", cartId)
    .eq("product_id", productId)
    .maybeSingle();

  if (existing?.id) {
    await supabase
      .from("cart_items")
      .update({ quantity: existing.quantity + quantity })
      .eq("id", existing.id);
  } else {
    await supabase
      .from("cart_items")
      .insert({ cart_id: cartId, product_id: productId, quantity });
  }

  revalidatePath("/catalogue");
  revalidatePath("/panier");
  redirect("/panier");
}

export async function updateCartItemQuantityAction(formData: FormData) {
  const user = await requireUser();
  const itemId = String(formData.get("itemId") ?? "");
  const quantity = Math.max(1, Number(formData.get("quantity") ?? 1));
  const supabase = await createSupabaseServerClient();
  const cartId = await getOrCreateActiveCartId(user.id);
  if (!cartId) return;
  await supabase
    .from("cart_items")
    .update({ quantity })
    .eq("id", itemId)
    .eq("cart_id", cartId);
  revalidatePath("/panier");
}

export async function removeCartItemAction(formData: FormData) {
  const user = await requireUser();
  const itemId = String(formData.get("itemId") ?? "");
  const supabase = await createSupabaseServerClient();
  const cartId = await getOrCreateActiveCartId(user.id);
  if (!cartId) return;
  await supabase.from("cart_items").delete().eq("id", itemId).eq("cart_id", cartId);
  revalidatePath("/panier");
}

export async function checkoutAction() {
  await requireUser();
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.rpc("checkout_cart");
  if (error) redirect("/panier?error=stock");
  revalidatePath("/panier");
  revalidatePath("/catalogue");
  revalidatePath("/admin");
  redirect("/panier?message=order-created");
}

export async function createProductAction(formData: FormData) {
  await requireAdmin();
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const slugInput = String(formData.get("slug") ?? "").trim();
  const priceEur = Number(formData.get("priceEur") ?? 0);
  const quantity = Math.max(0, Number(formData.get("quantity") ?? 0));
  const imagePath = normalizeImagePath(String(formData.get("imagePath") ?? ""));
  const published = String(formData.get("published") ?? "") === "on";

  if (!name) return;
  const supabase = await createSupabaseServerClient();
  await supabase.from("products").insert({
    slug: slugInput ? slugify(slugInput) : slugify(name),
    name,
    description,
    price_eur: Number.isFinite(priceEur) ? priceEur : 0,
    quantity,
    image_path: imagePath,
    published,
  });
  revalidatePath("/catalogue");
  revalidatePath("/admin");
}

export async function updateProductAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const slugInput = String(formData.get("slug") ?? "").trim();
  const priceEur = Number(formData.get("priceEur") ?? 0);
  const quantity = Math.max(0, Number(formData.get("quantity") ?? 0));
  const imagePath = normalizeImagePath(String(formData.get("imagePath") ?? ""));
  const published = String(formData.get("published") ?? "") === "on";
  if (!id || !name) return;

  const supabase = await createSupabaseServerClient();
  await supabase
    .from("products")
    .update({
      slug: slugInput ? slugify(slugInput) : slugify(name),
      name,
      description,
      price_eur: Number.isFinite(priceEur) ? priceEur : 0,
      quantity,
      image_path: imagePath,
      published,
    })
    .eq("id", id);
  revalidatePath("/catalogue");
  revalidatePath("/admin");
}

export async function deleteProductAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  const supabase = await createSupabaseServerClient();
  await supabase.from("products").delete().eq("id", id);
  revalidatePath("/catalogue");
  revalidatePath("/admin");
}
