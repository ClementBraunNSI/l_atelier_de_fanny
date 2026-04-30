import type { Metadata } from "next";
import {
  createProductAction,
  deleteProductAction,
  updateProductAction,
} from "@/app/actions/shop";
import { ImagePathField } from "@/components/image-path-field";
import { PageHeading } from "@/components/page-heading";
import {
  formatPrice,
  listAllProductsForAdmin,
  listOrdersForAdmin,
  requireAdmin,
} from "@/lib/shop";
import { getErrorMessage, getSuccessMessage } from "@/lib/ui-messages";

export const metadata: Metadata = {
  title: "Admin",
  description: "Gestion des produits et suivi des commandes.",
};

type Props = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminPage({ searchParams }: Props) {
  const params = (await searchParams) ?? {};
  const messageCode = typeof params.message === "string" ? params.message : null;
  const errorCode = typeof params.error === "string" ? params.error : null;
  const message = getSuccessMessage(messageCode);
  const error = getErrorMessage(errorCode);

  await requireAdmin();
  const products = await listAllProductsForAdmin();
  const orders = await listOrdersForAdmin();

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <PageHeading
        title="Administration boutique"
        description="Ajouter/éditer les produits et suivre les dernières commandes."
      />
      {message ? (
        <p className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {message}
        </p>
      ) : null}
      {error ? (
        <p className="mb-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </p>
      ) : null}

      <section className="rounded-2xl border border-orange-100/90 bg-white/95 p-5 shadow-sm sm:p-6">
        <h2 className="text-lg font-semibold text-stone-800">Ajouter un produit</h2>
        <form action={createProductAction} className="mt-4 grid gap-3 sm:grid-cols-2">
          <input
            required
            name="name"
            placeholder="Nom"
            className="rounded-lg border border-orange-200 px-3 py-2 text-sm"
          />
          <input
            name="slug"
            placeholder="Slug (optionnel)"
            className="rounded-lg border border-orange-200 px-3 py-2 text-sm"
          />
          <input
            required
            type="number"
            step="0.01"
            min="0"
            name="priceEur"
            placeholder="Prix €"
            className="rounded-lg border border-orange-200 px-3 py-2 text-sm"
          />
          <input
            required
            type="number"
            min="0"
            name="quantity"
            placeholder="Quantité"
            className="rounded-lg border border-orange-200 px-3 py-2 text-sm"
          />
          <ImagePathField
            name="imagePath"
            className="sm:col-span-2"
            inputClassName="w-full rounded-lg border border-orange-200 px-3 py-2 text-sm"
            hint="Cliquez sur Parcourir pour pré-remplir le chemin image. Ensuite placez le fichier dans public/boutique/."
          />
          <textarea
            name="description"
            placeholder="Description"
            className="sm:col-span-2 min-h-20 rounded-lg border border-orange-200 px-3 py-2 text-sm"
          />
          <label className="inline-flex items-center gap-2 text-sm text-stone-700">
            <input type="checkbox" name="published" className="size-4" />
            Produit publié
          </label>
          <div>
            <button
              type="submit"
              className="rounded-full bg-orange-300 px-5 py-2 text-sm font-semibold text-orange-950 transition hover:bg-orange-400"
            >
              Ajouter
            </button>
          </div>
        </form>
      </section>

      <section className="mt-8 rounded-2xl border border-orange-100/90 bg-white/95 p-5 shadow-sm sm:p-6">
        <h2 className="text-lg font-semibold text-stone-800">Produits</h2>
        <div className="mt-4 space-y-4">
          {products.length === 0 ? (
            <p className="text-sm text-stone-600">Aucun produit enregistré.</p>
          ) : (
            products.map((product) => (
              <form
                key={product.id}
                action={updateProductAction}
                className="rounded-xl border border-orange-100 bg-orange-50/20 p-4"
              >
                <input type="hidden" name="id" value={product.id} />
                <div className="grid gap-3 sm:grid-cols-2">
                  <input
                    required
                    name="name"
                    defaultValue={product.name}
                    className="rounded-lg border border-orange-200 px-3 py-2 text-sm"
                  />
                  <input
                    name="slug"
                    defaultValue={product.slug}
                    className="rounded-lg border border-orange-200 px-3 py-2 text-sm"
                  />
                  <input
                    required
                    type="number"
                    min="0"
                    step="0.01"
                    name="priceEur"
                    defaultValue={product.priceEur}
                    className="rounded-lg border border-orange-200 px-3 py-2 text-sm"
                  />
                  <input
                    required
                    type="number"
                    min="0"
                    name="quantity"
                    defaultValue={product.quantity}
                    className="rounded-lg border border-orange-200 px-3 py-2 text-sm"
                  />
                  <ImagePathField
                    name="imagePath"
                    defaultValue={product.imagePath ?? ""}
                    className="sm:col-span-2"
                    inputClassName="w-full rounded-lg border border-orange-200 px-3 py-2 text-sm"
                  />
                  <textarea
                    name="description"
                    defaultValue={product.description}
                    className="sm:col-span-2 min-h-16 rounded-lg border border-orange-200 px-3 py-2 text-sm"
                  />
                  <label className="inline-flex items-center gap-2 text-sm text-stone-700">
                    <input
                      type="checkbox"
                      name="published"
                      defaultChecked={product.published}
                      className="size-4"
                    />
                    Publié
                  </label>
                  <p className="text-sm text-stone-500">
                    Prix affiché: {formatPrice(product.priceEur)}
                  </p>
                </div>
                <div className="mt-4 flex gap-2">
                  <button
                    type="submit"
                    className="rounded-full bg-stone-800 px-4 py-1.5 text-sm font-semibold text-white hover:bg-stone-700"
                  >
                    Enregistrer
                  </button>
                  <button
                    formAction={deleteProductAction}
                    className="rounded-full border border-rose-200 bg-white px-4 py-1.5 text-sm font-semibold text-rose-700 hover:bg-rose-50"
                  >
                    Supprimer
                  </button>
                </div>
              </form>
            ))
          )}
        </div>
      </section>

      <section className="mt-8 rounded-2xl border border-orange-100/90 bg-white/95 p-5 shadow-sm sm:p-6">
        <h2 className="text-lg font-semibold text-stone-800">Dernières commandes</h2>
        {orders.length === 0 ? (
          <p className="mt-3 text-sm text-stone-600">Aucune commande pour le moment.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {orders.map((order) => (
              <li
                key={order.id}
                className="rounded-xl border border-orange-100 bg-orange-50/30 px-4 py-3 text-sm text-stone-700"
              >
                <p className="font-medium">
                  {order.id.slice(0, 8)} · {formatPrice(Number(order.total_eur))}
                </p>
                <p className="mt-0.5 text-xs text-stone-500">
                  Client: {order.user_id} · Statut: {order.status} ·{" "}
                  {new Date(order.created_at).toLocaleString("fr-FR")}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
