import type { Metadata } from "next";
import Link from "next/link";
import { PageHeading } from "@/components/page-heading";
import { ResetPasswordForm } from "@/components/reset-password-form";

export const metadata: Metadata = {
  title: "Réinitialiser le mot de passe",
  description: "Définir un nouveau mot de passe après avoir cliqué sur le lien reçu.",
};

export default function ResetPasswordPage() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <PageHeading
        title="Réinitialiser le mot de passe"
        description="Après avoir ouvert le lien envoyé par e-mail, choisissez un nouveau mot de passe."
      />

      <section className="rounded-2xl border border-orange-100/90 bg-white/95 p-6 shadow-sm">
        <p className="text-sm text-stone-700">
          Si vous arrivez ici depuis l'e-mail Supabase, ce formulaire appliquera
          automatiquement le nouveau mot de passe à votre compte.
        </p>
        <ResetPasswordForm />
        <Link
          href="/compte"
          className="mt-5 inline-flex text-sm font-semibold text-orange-600 hover:text-orange-700"
        >
          Retour à la connexion
        </Link>
      </section>
    </main>
  );
}
