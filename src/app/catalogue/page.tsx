import type { Metadata } from "next";
import { PageHeading } from "@/components/page-heading";
import { ProductCard } from "@/components/product-card";
import { getPublishedProducts } from "@/lib/products";

export const metadata: Metadata = {
  title: "Boutique",
  description:
    "Mercerie et créations de l’atelier — pièces ajoutées depuis l’outil de gestion.",
};

export default function CataloguePage() {
  const products = getPublishedProducts();

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <PageHeading
        title="Boutique"
        description="Sélection d’articles et créations. Les fiches sont alimentées via l’application bureau (dossier tools/boutique-admin)."
      />

      {products.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-orange-200/90 bg-white/90 p-8 text-center">
          <p className="text-sm font-medium text-stone-800">
            Aucun produit publié pour le moment
          </p>
          <p className="mx-auto mt-2 max-w-md text-sm text-stone-600">
            Utilisez l’outil Python pour ajouter des articles et cochez « Publié »
            pour qu’ils s’affichent ici après enregistrement du fichier JSON.
          </p>
        </div>
      ) : (
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {products.map((product) => (
            <li key={product.id}>
              <ProductCard product={product} />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
