import Link from "next/link";
import { company } from "@/lib/company";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-orange-100/80 bg-gradient-to-b from-white to-amber-50/50">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-3 lg:px-8">
        <div>
          <p className="text-base font-bold text-stone-800">{company.enseigne}</p>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-stone-600">
            Mercerie, couture, broderie sur tissu, ameublement textile et
            accessoires faits main.
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-orange-400">
            Siège
          </p>
          <p className="mt-2 text-sm text-stone-600">
            {company.adresse.numeroEtVoie}
            <br />
            {company.adresse.codePostal} {company.adresse.ville}
          </p>
          <p className="mt-3 text-xs text-stone-500">
            SIRET {company.siretSiege}
          </p>
        </div>
        <div className="flex flex-col gap-2 text-sm text-stone-600 lg:items-start">
          <Link
            href={company.instagram.profileUrl}
            className="w-fit rounded-md font-medium text-orange-600 underline-offset-2 hover:text-orange-700 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Instagram — devis &amp; messages (@{company.instagram.handle})
          </Link>
          <Link
            href="/mentions-legales"
            className="w-fit rounded-md font-medium text-orange-600 underline-offset-2 hover:text-orange-700 hover:underline"
          >
            Mentions légales
          </Link>
          <Link
            href="/cgv"
            className="w-fit rounded-md font-medium text-orange-600 underline-offset-2 hover:text-orange-700 hover:underline"
          >
            CGV
          </Link>
        </div>
      </div>
      <div className="border-t border-orange-100/60 py-4 text-center text-xs text-stone-500">
        © {new Date().getFullYear()} {company.enseigne}
      </div>
    </footer>
  );
}
