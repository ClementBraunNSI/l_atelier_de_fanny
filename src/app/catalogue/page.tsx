import type { Metadata } from "next";
import Link from "next/link";
import { addToCartAction } from "@/app/actions/shop";
import { PageHeading } from "@/components/page-heading";
import { ProductCard } from "@/components/product-card";
import { getCurrentUser, listPublishedProducts } from "@/lib/shop";

export const metadata: Metadata = {
  title: "Boutique",
  description:
    "Mercerie et créations de l’atelier — catalogue connecté à la base Supabase.",
};

export default async function CataloguePage() {
  const [products, user] = await Promise.all([
    listPublishedProducts(),
    getCurrentUser(),
  ]);

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <PageHeading
        title="Boutique"
        description="Sélection d’articles et créations. Ajoutez des articles au panier puis validez votre commande."
      />

      {products.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-orange-200/90 bg-white/90 p-8 text-center">
          <p className="text-sm font-medium text-stone-800">
            Aucun produit publié pour le moment
          </p>
          <p className="mx-auto mt-2 max-w-md text-sm text-stone-600">
            Aucun article publié pour l’instant.
          </p>
        </div>
      ) : (
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {products.map((product) => (
            <li key={product.id}>
              <Link
                href={`/catalogue/${product.slug}`}
                className="group block rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-300"
              >
                <div className="transition group-hover:-translate-y-0.5 group-hover:shadow-md">
                  <ProductCard product={product} />
                </div>
              </Link>
              <div className="mt-3 flex flex-wrap gap-2">
                <Link
                  href={`/catalogue/${product.slug}`}
                  className="inline-flex rounded-full border border-orange-200 bg-white px-4 py-2 text-sm font-semibold text-stone-700 transition hover:bg-orange-50"
                >
                  En savoir plus
                </Link>
                {user ? (
                  <form action={addToCartAction}>
                    <input type="hidden" name="productId" value={product.id} />
                    <input type="hidden" name="quantity" value="1" />
                    <button
                      type="submit"
                      disabled={product.quantity < 1}
                      className="inline-flex rounded-full bg-orange-300 px-4 py-2 text-sm font-semibold text-orange-950 transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {product.quantity > 0 ? "Ajouter au panier" : "Rupture de stock"}
                    </button>
                  </form>
                ) : (
                  <Link
                    href="/compte"
                    className="inline-flex rounded-full border border-orange-200 bg-white px-4 py-2 text-sm font-semibold text-stone-700 transition hover:bg-orange-50"
                  >
                    Connectez-vous pour commander
                  </Link>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
