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
  if (error) {
    const msg = error.message.toLowerCase();
    if (msg.includes("rate limit")) {
      redirect("/compte?error=signup-email-rate-limit");
    }
    if (msg.includes("already registered") || msg.includes("already been registered")) {
      redirect("/compte?error=signup-email-already-registered");
    }
    redirect("/compte?error=signup-generic");
  }

  // En mode sans confirmation email, on connecte l'utilisateur juste après inscription.
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (signInError) {
    redirect("/compte?message=signup-success");
  }
  redirect("/catalogue?message=welcome");
}

export async function signInAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    const msg = error.message.toLowerCase();
    if (msg.includes("email not confirmed")) {
      redirect("/compte?error=login-email-not-confirmed");
    }
    if (msg.includes("rate limit") || msg.includes("too many requests")) {
      redirect("/compte?error=login-too-many-requests");
    }
    redirect("/compte?error=login-failed");
  }
  redirect("/catalogue");
}

export async function signOutAction() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function forgotPasswordAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  if (!email) redirect("/compte?error=forgot-password-invalid");
  // Flux temporaire sans envoi de mail.
  redirect("/compte?message=forgot-password-manual");
}

export async function addToCartAction(formData: FormData) {
  const user = await requireUser();
  const productId = String(formData.get("productId") ?? "");
  const quantity = Math.max(1, Number(formData.get("quantity") ?? 1));
  const supabase = await createSupabaseServerClient();
  const cartId = await getOrCreateActiveCartId(user.id);
  if (!cartId || !productId) {
    redirect("/panier?error=cart-add-failed");
  }

  const { data: existing } = await supabase
    .from("cart_items")
    .select("id, quantity")
    .eq("cart_id", cartId)
    .eq("product_id", productId)
    .maybeSingle();

  if (existing?.id) {
    const { error } = await supabase
      .from("cart_items")
      .update({ quantity: existing.quantity + quantity })
      .eq("id", existing.id);
    if (error) redirect("/panier?error=cart-add-failed");
  } else {
    const { error } = await supabase
      .from("cart_items")
      .insert({ cart_id: cartId, product_id: productId, quantity });
    if (error) redirect("/panier?error=cart-add-failed");
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
  if (!cartId) redirect("/panier?error=cart-update-failed");
  const { error } = await supabase
    .from("cart_items")
    .update({ quantity })
    .eq("id", itemId)
    .eq("cart_id", cartId);
  if (error) redirect("/panier?error=cart-update-failed");
  revalidatePath("/panier");
}

export async function removeCartItemAction(formData: FormData) {
  const user = await requireUser();
  const itemId = String(formData.get("itemId") ?? "");
  const supabase = await createSupabaseServerClient();
  const cartId = await getOrCreateActiveCartId(user.id);
  if (!cartId) redirect("/panier?error=cart-remove-failed");
  const { error } = await supabase
    .from("cart_items")
    .delete()
    .eq("id", itemId)
    .eq("cart_id", cartId);
  if (error) redirect("/panier?error=cart-remove-failed");
  revalidatePath("/panier");
}

export async function checkoutAction() {
  await requireUser();
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.rpc("checkout_cart");
  if (error) {
    const msg = error.message.toLowerCase();
    if (msg.includes("insufficient_stock")) redirect("/panier?error=checkout-stock");
    if (msg.includes("cart_empty")) redirect("/panier?error=checkout-empty");
    redirect("/panier?error=checkout-failed");
  }
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

  if (!name) redirect("/admin?error=product-name-required");
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("products").insert({
    slug: slugInput ? slugify(slugInput) : slugify(name),
    name,
    description,
    price_eur: Number.isFinite(priceEur) ? priceEur : 0,
    quantity,
    image_path: imagePath,
    published,
  });
  if (error) redirect("/admin?error=product-create-failed");
  revalidatePath("/catalogue");
  revalidatePath("/admin");
  redirect("/admin?message=product-created");
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
  if (!id || !name) redirect("/admin?error=product-update-invalid");

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
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
  if (error) redirect("/admin?error=product-update-failed");
  revalidatePath("/catalogue");
  revalidatePath("/admin");
  redirect("/admin?message=product-updated");
}

export async function deleteProductAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) redirect("/admin?error=product-delete-invalid");
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) redirect("/admin?error=product-delete-failed");
  revalidatePath("/catalogue");
  revalidatePath("/admin");
  redirect("/admin?message=product-deleted");
}
