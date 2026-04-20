import Image from "next/image";
import Link from "next/link";
import { PhotoPlaceholder } from "@/components/photo-placeholder";
import { TrustStrip } from "@/components/trust-strip";
import { UniversCards } from "@/components/univers-cards";
import { company } from "@/lib/company";

const services = [
  {
    title: "Couture & vêtements",
    text: "Créations, retouches et pièces sur mesure, finitions nettes et tenue dans le temps.",
  },
  {
    title: "Ameublement",
    text: "Couture et restauration de sièges, fauteuils et textiles de décoration.",
  },
  {
    title: "Découpe & prestation",
    text: "Découpe et montage pour vos projets couture ou petites séries.",
  },
  {
    title: "Accessoires en tissu",
    text: "Bananes, sacs, petite maroquinerie textile et accessoires sur commande.",
  },
  {
    title: "Broderie sur tissu",
    text: "Sur demande : logos, monogrammes ou motifs brodés selon votre fichier ou votre idée — vêtements, accessoires, linge, petites séries ou goodies. Devis après échange sur le projet.",
  },
] as const;

export default function Home() {
  return (
    <main className="flex-1">
      <section className="relative overflow-hidden border-b border-orange-100/60 bg-white/60">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-24 size-[28rem] rounded-full bg-gradient-to-br from-orange-100/70 via-amber-50/50 to-transparent blur-2xl sm:size-[32rem]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-32 -left-24 size-[22rem] rounded-full bg-gradient-to-tr from-orange-100/70 to-amber-50/50 blur-2xl"
        />
        <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:grid lg:grid-cols-12 lg:items-center lg:gap-10 lg:px-8 lg:py-20">
          <div className="lg:col-span-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-500">
              Mercerie · Atelier · {company.adresse.ville}
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-stone-800 sm:text-5xl lg:text-[3.25rem] lg:leading-[1.08]">
              L&apos;Atelier de Fanny
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-stone-600 sm:text-lg">
              Objets et prestations autour du fil et du tissu : mercerie,
              couture, broderie personnalisée, ameublement et accessoires faits
              main — navigation simple,
              univers clairs, infos visibles dès l&apos;accueil.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/catalogue"
                className="inline-flex h-11 items-center justify-center rounded-full bg-orange-300 px-7 text-sm font-semibold text-orange-950 shadow-sm transition hover:bg-orange-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-300"
              >
                Boutique
              </Link>
              <Link
                href="/a-propos"
                className="inline-flex h-11 items-center justify-center rounded-full border border-orange-200/90 bg-white/90 px-7 text-sm font-semibold text-stone-700 shadow-sm transition hover:border-orange-300 hover:bg-orange-50/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-300"
              >
                L&apos;atelier
              </Link>
            </div>
          </div>

          <div className="relative mt-10 lg:col-span-6 lg:mt-0">
            <div className="flex flex-col gap-3 sm:gap-4">
              <div className="relative overflow-hidden rounded-2xl border border-orange-100/80 shadow-sm ring-1 ring-orange-50/60">
                <span className="absolute right-3 top-3 z-10 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-stone-600 shadow-sm ring-1 ring-orange-100 backdrop-blur">
                  Nouveautés bientôt
                </span>
                <div className="relative aspect-[4/3] min-h-[200px] w-full sm:min-h-[240px]">
                  <Image
                    src="/images/siege.jpg"
                    alt="Siège restauré : bois noir, assise velours bleu-vert et dossier tapissé d’un motif perroquet, finition clous décoratifs."
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="relative aspect-square overflow-hidden rounded-2xl border border-orange-100/80 shadow-sm ring-1 ring-orange-50/60">
                  <Image
                    src="/images/broderie.jpg"
                    alt="Détail couture : machine à broder posant un appliqué cœur en tissu Liberty sur support vert d’eau."
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 50vw, 25vw"
                  />
                </div>
                <PhotoPlaceholder
                  caption="L’atelier en photo — à venir"
                  aspectClass="aspect-square min-h-0"
                />
              </div>
              <Link
                href={company.instagram.profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex text-sm font-semibold text-orange-600 hover:text-orange-700"
              >
                Un projet sur mesure ? Profil Instagram →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <TrustStrip />

      <UniversCards />

      <section
        id="prestations"
        className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8"
      >
        <div className="flex flex-col gap-4 border-b border-orange-100/80 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-500">
              Prestations
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-stone-800 sm:text-3xl">
              Tout ce que l&apos;atelier propose
            </h2>
            <p className="mt-2 max-w-xl text-sm text-stone-600 sm:text-base">
              Détail des savoir-faire — chaque carte peut plus tard mener vers
              une page dédiée ou une catégorie catalogue.
            </p>
          </div>
          <Link
            href={company.instagram.profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-orange-600 hover:text-orange-700"
          >
            Devis &amp; questions (profil Instagram) →
          </Link>
        </div>

        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:gap-5">
          {services.map((s, i) => (
            <li
              key={s.title}
              className="flex flex-col rounded-2xl border border-orange-100/90 bg-white/90 p-6 shadow-sm transition hover:border-orange-200/90 hover:shadow-md sm:p-7"
            >
              <span className="text-xs font-bold tabular-nums text-orange-500">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-2 text-lg font-bold text-stone-800">{s.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-stone-600">
                {s.text}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="border-t border-orange-100/70 bg-gradient-to-br from-amber-200/50 via-orange-200/45 to-orange-200/40">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-4 py-12 sm:flex-row sm:items-center sm:px-6 lg:px-8">
          <div>
            <p className="text-sm font-semibold text-stone-800">
              {company.enseigne} — {company.adresse.ville}
            </p>
            <p className="mt-1 text-sm text-stone-600">
              {company.adresse.numeroEtVoie}, {company.adresse.codePostal}{" "}
              {company.adresse.ville}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href={company.instagram.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-white/95 px-5 py-2.5 text-sm font-semibold text-stone-800 shadow-sm ring-1 ring-orange-100/80 transition hover:bg-white"
            >
              Profil Instagram — devis &amp; actus
            </Link>
            <Link
              href="/catalogue"
              className="inline-flex items-center justify-center rounded-full border border-white/80 bg-white/30 px-5 py-2.5 text-sm font-semibold text-stone-800 backdrop-blur-sm transition hover:bg-white/50"
            >
              Boutique
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
