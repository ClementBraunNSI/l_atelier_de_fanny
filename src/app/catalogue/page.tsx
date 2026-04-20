import type { Metadata } from "next";
import { PageHeading } from "@/components/page-heading";

export const metadata: Metadata = {
  title: "Boutique",
  description: "Catalogue mercerie et créations — en construction.",
};

export default function CataloguePage() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <PageHeading
        title="Boutique"
        description="Le catalogue sera relié à une base (ex. Supabase) et à une interface d’administration simple."
      />

      <div className="rounded-2xl border border-dashed border-stone-300 bg-white p-8 text-center">
        <p className="text-sm font-medium text-stone-900">Bientôt disponible</p>
        <p className="mx-auto mt-2 max-w-md text-sm text-stone-600">
          Fiches produit (catégorie, matière, options, prix), paiement par carte
          via Stripe Checkout, facture PDF après commande validée.
        </p>
      </div>
    </main>
  );
}
