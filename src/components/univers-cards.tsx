import Link from "next/link";
import { company } from "@/lib/company";

const univers = [
  {
    eyebrow: "Mercerie & créations",
    title: "Objets & petites séries",
    text: "Accessoires, mercerie et pièces prêtes à offrir.",
    href: "/catalogue",
    cta: "Voir la boutique",
    external: false,
    gradient: "from-violet-100/95 via-fuchsia-50/90 to-amber-50/95",
  },
  {
    eyebrow: "Couture & retouches",
    title: "Vêtements sur mesure",
    text: "Retouches, créations et prestations à cahier des charges.",
    href: company.instagram.profileUrl,
    cta: "Demander un devis",
    external: true,
    gradient: "from-sky-100/95 via-emerald-50/90 to-teal-50/95",
  },
  {
    eyebrow: "Ameublement",
    title: "Sièges & textile déco",
    text: "Restauration de fauteuils, coussins et travaux d’ameublement.",
    href: company.instagram.profileUrl,
    cta: "Parler du projet",
    external: true,
    gradient: "from-amber-100/95 via-orange-50/90 to-rose-50/95",
  },
] as const;

export function UniversCards() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-500">
          Univers
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-stone-800 sm:text-3xl">
          Trois façons d&apos;explorer l&apos;atelier
        </h2>
        <p className="mt-3 text-sm text-stone-600 sm:text-base">
          Comme sur les boutiques artisanales qui découpent l&apos;offre par
          univers (bébé, maison, sacs…), voici trois entrées claires vers vos
          services.
        </p>
      </div>

      <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
        {univers.map((u) => (
          <li key={u.title}>
            <Link
              href={u.href}
              {...(u.external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              className="group relative flex min-h-[220px] flex-col overflow-hidden rounded-3xl border border-rose-100/90 bg-white/90 p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-rose-200/90 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-300 sm:min-h-[260px] sm:p-7"
            >
              <div
                aria-hidden
                className={`pointer-events-none absolute inset-0 bg-gradient-to-br opacity-80 transition group-hover:opacity-100 ${u.gradient}`}
              />
              <div className="relative flex flex-1 flex-col">
                <p className="text-xs font-semibold uppercase tracking-wider text-stone-600/90">
                  {u.eyebrow}
                </p>
                <h3 className="mt-3 text-xl font-bold tracking-tight text-stone-800 sm:text-2xl">
                  {u.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-stone-600">
                  {u.text}
                </p>
                <span className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-rose-600 group-hover:gap-2">
                  {u.cta}
                  <span aria-hidden>→</span>
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
