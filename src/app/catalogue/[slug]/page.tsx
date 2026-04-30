import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { addToCartAction } from "@/app/actions/shop";
import { getCurrentUser, getPublishedProductBySlug, formatPrice } from "@/lib/shop";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getPublishedProductBySlug(slug);
  if (!product) return { title: "Produit introuvable" };
  return {
    title: product.name,
    description: product.description || `Fiche produit: ${product.name}`,
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const [product, user] = await Promise.all([
    getPublishedProductBySlug(slug),
    getCurrentUser(),
  ]);

  if (!product) notFound();

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div className="mb-6">
        <Link
          href="/catalogue"
          className="text-sm font-semibold text-orange-600 hover:text-orange-700"
        >
          ← Retour à la boutique
        </Link>
      </div>

      <article className="grid gap-8 rounded-2xl border border-orange-100/90 bg-white/95 p-5 shadow-sm sm:p-7 lg:grid-cols-2">
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-orange-100 bg-orange-50/40">
          {product.imagePath ? (
            <Image
              src={product.imagePath}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-stone-500">
              Aucune image
            </div>
          )}
        </div>

        <div className="flex flex-col">
          <h1 className="text-2xl font-bold tracking-tight text-stone-800 sm:text-3xl">
            {product.name}
          </h1>
          <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-stone-600 sm:text-base">
            {product.description || "Description à venir."}
          </p>
          <p className="mt-6 text-2xl font-bold text-orange-600">
            {formatPrice(product.priceEur)}
          </p>
          <p className="mt-1 text-sm text-stone-500">
            Stock disponible : {Math.max(0, product.quantity)}
          </p>

          <div className="mt-6">
            {user ? (
              <form action={addToCartAction}>
                <input type="hidden" name="productId" value={product.id} />
                <input type="hidden" name="quantity" value="1" />
                <button
                  type="submit"
                  disabled={product.quantity < 1}
                  className="inline-flex rounded-full bg-orange-300 px-5 py-2.5 text-sm font-semibold text-orange-950 transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {product.quantity > 0 ? "Ajouter au panier" : "Rupture de stock"}
                </button>
              </form>
            ) : (
              <Link
                href="/compte"
                className="inline-flex rounded-full border border-orange-200 bg-white px-5 py-2.5 text-sm font-semibold text-stone-700 transition hover:bg-orange-50"
              >
                Connectez-vous pour commander
              </Link>
            )}
          </div>
        </div>
      </article>
    </main>
  );
}
