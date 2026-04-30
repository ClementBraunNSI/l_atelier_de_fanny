import type { Metadata } from "next";
import Link from "next/link";
import {
  forgotPasswordAction,
  signInAction,
  signOutAction,
  signUpAction,
} from "@/app/actions/shop";
import { PageHeading } from "@/components/page-heading";
import { getCurrentUser } from "@/lib/shop";
import { getErrorMessage, getSuccessMessage } from "@/lib/ui-messages";

export const metadata: Metadata = {
  title: "Compte",
  description: "Créer un compte client, se connecter et consulter ses commandes.",
};

type Props = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ComptePage({ searchParams }: Props) {
  const params = (await searchParams) ?? {};
  const messageCode = typeof params.message === "string" ? params.message : null;
  const errorCode = typeof params.error === "string" ? params.error : null;
  const mode = typeof params.mode === "string" ? params.mode : null;
  const message = getSuccessMessage(messageCode);
  const error = getErrorMessage(errorCode);

  const user = await getCurrentUser();

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <PageHeading
        title="Compte client"
        description="Créez votre compte puis connectez-vous pour commander."
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
      {mode === "forgot-password" && (
        <section className="mb-6 rounded-2xl border border-orange-200 bg-orange-50/70 p-4 sm:p-5">
          <h2 className="text-sm font-semibold text-stone-800">Mot de passe oublié</h2>
          <p className="mt-1 text-sm text-stone-700">
            Pour l&apos;instant, la réinitialisation se fait sans envoi d&apos;e-mail.
            Entrez votre e-mail pour enregistrer une demande puis contactez
            l&apos;administrateur.
          </p>
          <form action={forgotPasswordAction} className="mt-3 flex flex-wrap items-end gap-2">
            <label className="w-full max-w-sm text-sm text-stone-700">
              E-mail du compte
              <input
                required
                type="email"
                name="email"
                className="mt-1 w-full rounded-lg border border-orange-200 bg-white px-3 py-2 text-sm outline-none ring-orange-200 focus:ring-2"
              />
            </label>
            <button
              type="submit"
              className="inline-flex rounded-full bg-orange-300 px-5 py-2 text-sm font-semibold text-orange-950 transition hover:bg-orange-400"
            >
              Envoyer la demande
            </button>
          </form>
        </section>
      )}

      {user ? (
        <section className="rounded-2xl border border-orange-100/90 bg-white/95 p-6 shadow-sm">
          <p className="text-sm text-stone-600">Connecté en tant que</p>
          <p className="mt-1 font-semibold text-stone-800">{user.email}</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/catalogue"
              className="inline-flex rounded-full bg-orange-300 px-5 py-2 text-sm font-semibold text-orange-950 transition hover:bg-orange-400"
            >
              Aller à la boutique
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
              <div>
                <Link
                  href="/compte?mode=forgot-password"
                  className="text-xs font-medium text-orange-600 hover:text-orange-700 hover:underline"
                >
                  Mot de passe oublié ?
                </Link>
              </div>
            </form>
          </section>
        </div>
      )}
    </main>
  );
}
