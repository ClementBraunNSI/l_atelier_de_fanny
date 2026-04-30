import type { Metadata } from "next";
import Link from "next/link";
import {
  signInAction,
  signOutAction,
  signUpAction,
} from "@/app/actions/shop";
import { PageHeading } from "@/components/page-heading";
import { formatPrice, getCurrentUser, listOrdersForUser } from "@/lib/shop";

export const metadata: Metadata = {
  title: "Compte",
  description: "Créer un compte client, se connecter et consulter ses commandes.",
};

type Props = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ComptePage({ searchParams }: Props) {
  const params = (await searchParams) ?? {};
  const message = typeof params.message === "string" ? params.message : null;
  const error = typeof params.error === "string" ? params.error : null;

  const user = await getCurrentUser();
  const orders = user ? await listOrdersForUser(user.id) : [];

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <PageHeading
        title="Compte client"
        description="Inscription, connexion et suivi des commandes."
      />

      {message && (
        <p className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {message === "verify-email"
            ? "Compte créé. Vérifiez vos e-mails pour confirmer l’inscription."
            : "Action terminée."}
        </p>
      )}
      {error && (
        <p className="mb-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error === "login-failed"
            ? "Connexion impossible : vérifiez votre email/mot de passe."
            : decodeURIComponent(error)}
        </p>
      )}

      {user ? (
        <section className="space-y-8">
          <div className="rounded-2xl border border-orange-100/90 bg-white/95 p-6 shadow-sm">
            <p className="text-sm text-stone-600">Connecté en tant que</p>
            <p className="mt-1 font-semibold text-stone-800">{user.email}</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href="/panier"
                className="inline-flex rounded-full bg-orange-300 px-5 py-2 text-sm font-semibold text-orange-950 transition hover:bg-orange-400"
              >
                Voir le panier
              </Link>
              <form action={signOutAction}>
                <button
                  type="submit"
                  className="inline-flex rounded-full border border-orange-200 bg-white px-5 py-2 text-sm font-semibold text-stone-700 transition hover:bg-orange-50"
                >
                  Déconnexion
                </button>
              </form>
            </div>
          </div>

          <div className="rounded-2xl border border-orange-100/90 bg-white/95 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-stone-800">Mes commandes</h2>
            {orders.length === 0 ? (
              <p className="mt-3 text-sm text-stone-600">
                Aucune commande pour le moment.
              </p>
            ) : (
              <ul className="mt-4 space-y-3">
                {orders.map((order) => (
                  <li
                    key={order.id}
                    className="rounded-xl border border-orange-100 bg-orange-50/30 px-4 py-3 text-sm text-stone-700"
                  >
                    <p className="font-medium">
                      Commande {order.id.slice(0, 8)} — {formatPrice(Number(order.total_eur))}
                    </p>
                    <p className="mt-0.5 text-xs text-stone-500">
                      Statut: {order.status} · {new Date(order.created_at).toLocaleString("fr-FR")}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          <section className="rounded-2xl border border-orange-100/90 bg-white/95 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-stone-800">Créer un compte</h2>
            <form action={signUpAction} className="mt-4 space-y-3">
              <label className="block text-sm text-stone-700">
                Email
                <input
                  required
                  type="email"
                  name="email"
                  className="mt-1 w-full rounded-lg border border-orange-200 bg-white px-3 py-2 text-sm outline-none ring-orange-200 focus:ring-2"
                />
              </label>
              <label className="block text-sm text-stone-700">
                Mot de passe (6 caractères mini)
                <input
                  required
                  minLength={6}
                  type="password"
                  name="password"
                  className="mt-1 w-full rounded-lg border border-orange-200 bg-white px-3 py-2 text-sm outline-none ring-orange-200 focus:ring-2"
                />
              </label>
              <button
                type="submit"
                className="inline-flex rounded-full bg-orange-300 px-5 py-2 text-sm font-semibold text-orange-950 transition hover:bg-orange-400"
              >
                Créer mon compte
              </button>
            </form>
          </section>

          <section className="rounded-2xl border border-orange-100/90 bg-white/95 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-stone-800">Connexion</h2>
            <form action={signInAction} className="mt-4 space-y-3">
              <label className="block text-sm text-stone-700">
                Email
                <input
                  required
                  type="email"
                  name="email"
                  className="mt-1 w-full rounded-lg border border-orange-200 bg-white px-3 py-2 text-sm outline-none ring-orange-200 focus:ring-2"
                />
              </label>
              <label className="block text-sm text-stone-700">
                Mot de passe
                <input
                  required
                  type="password"
                  name="password"
                  className="mt-1 w-full rounded-lg border border-orange-200 bg-white px-3 py-2 text-sm outline-none ring-orange-200 focus:ring-2"
                />
              </label>
              <button
                type="submit"
                className="inline-flex rounded-full bg-stone-800 px-5 py-2 text-sm font-semibold text-white transition hover:bg-stone-700"
              >
                Me connecter
              </button>
            </form>
          </section>
        </div>
      )}
    </main>
  );
}
