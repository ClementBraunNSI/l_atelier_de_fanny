import type { Metadata } from "next";
import Link from "next/link";
import { PageHeading } from "@/components/page-heading";
import { company } from "@/lib/company";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contacter L'Atelier de Fanny pour un devis : rendez-vous sur le profil Instagram.",
};

export default function ContactPage() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <PageHeading
        title="Contact"
        description="Pour un devis, une idée de sur-mesure ou une question sur une prestation, tout passe par le profil Instagram."
      />

      <div className="rounded-2xl border border-rose-100/90 bg-gradient-to-br from-rose-50/95 via-violet-50/30 to-amber-50/50 p-6 shadow-sm sm:p-8">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-rose-600">
          Devis &amp; demandes
        </h2>
        <p className="mt-3 text-base leading-relaxed text-stone-700">
          Ouvrez le{" "}
          <strong className="text-stone-800">profil public</strong>{" "}
          <strong className="text-stone-800">@{company.instagram.handle}</strong>
          , puis utilisez le bouton <strong className="text-stone-800">Message</strong>{" "}
          (sur l’application ou le site Instagram). Vous pouvez y envoyer des
          photos, des dimensions et votre demande — c’est le seul canal utilisé
          pour discuter d’un projet avant devis.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href={company.instagram.profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 items-center justify-center rounded-full bg-rose-300 px-6 text-sm font-semibold text-rose-950 shadow-sm transition hover:bg-rose-400"
          >
            Ouvrir le profil Instagram
          </Link>
        </div>
        <p className="mt-4 text-sm text-stone-600">
          Un compte Instagram est nécessaire pour envoyer un message depuis le
          profil.
        </p>
      </div>

      <div className="mt-10 rounded-2xl border border-rose-100/80 bg-white/90 p-6 shadow-sm sm:p-8">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-rose-400">
          Atelier
        </h2>
        <p className="mt-3 text-base font-medium text-stone-800">
          {company.enseigne}
        </p>
        <p className="mt-2 text-stone-600">
          {company.adresse.numeroEtVoie}
          <br />
          {company.adresse.codePostal} {company.adresse.ville}
        </p>
        <p className="mt-4 text-xs text-stone-500">
          SIRET {company.siretSiege} ·{" "}
          <a
            href={company.lienPappers}
            className="font-medium text-rose-600 underline-offset-2 hover:text-rose-700 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Fiche entreprise (Pappers)
          </a>
        </p>
      </div>

      <div className="prose-page mt-10 space-y-4">
        <p>
          <strong>E-mail ou téléphone</strong> : vous pourrez les ajouter ici
          plus tard si vous souhaitez un second canal (hors devis Instagram).
        </p>
      </div>
    </main>
  );
}
