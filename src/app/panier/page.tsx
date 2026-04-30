import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  checkoutAction,
  removeCartItemAction,
  updateCartItemQuantityAction,
} from "@/app/actions/shop";
import { PageHeading } from "@/components/page-heading";
import { formatPrice, getCartSummary, requireUser } from "@/lib/shop";
import { getErrorMessage, getSuccessMessage } from "@/lib/ui-messages";

export const metadata: Metadata = {
  title: "Panier",
  description: "Panier client avec validation de commande.",
};

type Props = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function PanierPage({ searchParams }: Props) {
  const params = (await searchParams) ?? {};
  const messageCode = typeof params.message === "string" ? params.message : null;
  const errorCode = typeof params.error === "string" ? params.error : null;
  const message = getSuccessMessage(messageCode);
  const error = getErrorMessage(errorCode);

  const user = await requireUser();
  const summary = await getCartSummary(user.id);

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <PageHeading
        title="Panier"
        description="Vérifiez vos articles puis validez la commande."
      />

      {message && (
        <p className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {message}
        </p>
      )}
      {error && (
        <p className="mb-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </p>
      )}

      {summary.items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-orange-200/90 bg-white/90 p-8 text-center">
          <p className="text-sm font-medium text-stone-800">Votre panier est vide</p>
          <Link
            href="/catalogue"
            className="mt-4 inline-flex rounded-full bg-orange-300 px-5 py-2 text-sm font-semibold text-orange-950 transition hover:bg-orange-400"
          >
            Voir la boutique
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
          <ul className="space-y-4">
            {summary.items.map((item) => (
              <li
                key={item.id}
                className="rounded-2xl border border-orange-100/90 bg-white/95 p-4 shadow-sm sm:p-5"
              >
                <div className="flex gap-4">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-orange-100 bg-orange-50/40">
                    {item.productImagePath ? (
                      <Image
                        src={item.productImagePath}
                        alt={item.productName}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    ) : null}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-stone-800">{item.productName}</p>
                    <p className="mt-1 text-sm text-stone-600">
                      {formatPrice(item.unitPriceEur)} · Stock: {item.availableQuantity}
                    </p>
                    <p className="mt-1 text-sm font-medium text-orange-700">
                      Sous-total: {formatPrice(item.subtotalEur)}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <form action={updateCartItemQuantityAction} className="flex items-center gap-2">
                    <input type="hidden" name="itemId" value={item.id} />
                    <input
                      type="number"
                      min={1}
                      max={Math.max(1, item.availableQuantity)}
                      defaultValue={item.quantity}
                      name="quantity"
                      className="w-20 rounded-lg border border-orange-200 bg-white px-2 py-1.5 text-sm"
                    />
                    <button
                      type="submit"
                      className="rounded-full border border-orange-200 bg-white px-4 py-1.5 text-sm font-medium text-stone-700 hover:bg-orange-50"
                    >
                      Mettre à jour
                    </button>
                  </form>
                  <form action={removeCartItemAction}>
                    <input type="hidden" name="itemId" value={item.id} />
                    <button
                      type="submit"
                      className="rounded-full border border-rose-200 bg-white px-4 py-1.5 text-sm font-medium text-rose-700 hover:bg-rose-50"
                    >
                      Retirer
                    </button>
                  </form>
                </div>
              </li>
            ))}
          </ul>

          <aside className="h-fit rounded-2xl border border-orange-100/90 bg-white/95 p-5 shadow-sm">
            <p className="text-sm text-stone-600">Total</p>
            <p className="mt-1 text-2xl font-bold text-stone-800">
              {formatPrice(summary.totalEur)}
            </p>
            <form action={checkoutAction} className="mt-4">
              <button
                type="submit"
                className="w-full rounded-full bg-orange-300 px-5 py-2.5 text-sm font-semibold text-orange-950 transition hover:bg-orange-400"
              >
                Valider la commande
              </button>
            </form>
          </aside>
        </div>
      )}
    </main>
  );
}
