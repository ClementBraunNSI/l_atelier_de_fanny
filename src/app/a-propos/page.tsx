import type { Metadata } from "next";
import Link from "next/link";
import { company } from "@/lib/company";

export const metadata: Metadata = {
  title: "À propos",
  description:
    "L'Atelier de Fanny à Courrières : mercerie, couture sur mesure, ameublement textile et accessoires faits main dans les Hauts-de-France.",
};

const prestations = [
  {
    titre: "Couture & vêtements",
    texte:
      "Créations sur mesure, retouches et ajustements : du pantalon à la robe, en passant par les pièces qui demandent finesse et tenue.",
  },
  {
    titre: "Ameublement & sièges",
    texte:
      "Couture d’ameublement, coussins, textiles de décoration, restauration ou habillage de fauteuils et sièges — pour redonner du confort et du style à vos meubles.",
  },
  {
    titre: "Découpe & prestation",
    texte:
      "Service de découpe et de montage pour vos projets perso, associations ou petites séries : vous gagnez du temps, l’atelier assure la précision.",
  },
  {
    titre: "Mercerie & accessoires",
    texte:
      "Mercerie, petites créations et accessoires en tissu : bananes, sacs, pochettes, idées cadeaux… Souvent sur commande, toujours avec le souci du détail.",
  },
] as const;

const engagements = [
  {
    titre: "Qualité avant tout",
    texte:
      "Choix des tissus, finitions nettes, tenue dans le temps : chaque pièce doit mériter d’être portée, utilisée ou exposée.",
  },
  {
    titre: "Des délais qu’on respecte",
    texte:
      "Un planning annoncé clairement dès le devis — la confiance se joue aussi sur la ponctualité.",
  },
  {
    titre: "Une vraie écoute",
    texte:
      "On prend le temps du cahier des charges : usages, contraintes, budget. L’objectif, c’est un résultat qui colle à votre vie, pas à un catalogue générique.",
  },
] as const;

const etapes = [
  {
    pas: "01",
    titre: "On en parle",
    texte:
      "Rendez-vous sur le profil Instagram, puis utilisez le bouton « Message » : décrivez votre idée, vos contraintes ou envoyez des photos. On peut ensuite convenir d’un rendez-vous à l’atelier si le projet le demande.",
  },
  {
    pas: "02",
    titre: "Devis & validation",
    texte:
      "Proposition chiffrée, délai indicatif, choix des matières. Rien ne part en fabrication sans votre accord.",
  },
  {
    pas: "03",
    titre: "Création & retrait",
    texte:
      "Travail à l’atelier, points d’étape si besoin, puis remise sur place (souvent sur rendez-vous) ou envoi selon ce qui est convenu.",
  },
] as const;

export default function AboutPage() {
  return (
    <main className="flex-1">
      <section className="border-b border-orange-100/70 bg-white/70">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-500">
            À propos · {company.adresse.ville} ({company.adresse.codePostal})
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-stone-800 sm:text-5xl">
            Du fil à la pièce, avec exigence et bonne humeur.
          </h1>
          <p className="mt-5 text-lg font-medium leading-relaxed text-stone-700 sm:text-xl">
            Bienvenue chez <strong>{company.enseigne}</strong> : un atelier où la
            mercerie rencontre la couture sur mesure, l’ameublement textile et
            les accessoires faits main — pour les particuliers, les familles et
            les petits projets pros qui cherchent du sur-mesure, pas du
            standardisé.
          </p>
          <p className="mt-4 text-base leading-relaxed text-stone-600">
            Installée dans les{" "}
            <strong className="text-stone-700">Hauts-de-France</strong>, Fanny
            met son savoir-faire au service de vos envies : que vous passiez
            pour une retouche urgente, un fauteuil à rafraîchir ou une série de
            sacs pour une occasion, l’idée reste la même — du travail propre, des
            matières choisies avec soin, et une finition dont on peut être fière.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={company.instagram.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center justify-center rounded-full bg-orange-300 px-6 text-sm font-semibold text-orange-950 shadow-sm transition hover:bg-orange-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-300"
            >
              Devis — profil Instagram
            </Link>
            <Link
              href="/catalogue"
              className="inline-flex h-11 items-center justify-center rounded-full border border-orange-200/90 bg-white/90 px-6 text-sm font-semibold text-stone-700 shadow-sm transition hover:border-orange-300 hover:bg-orange-50/80"
            >
              Voir la boutique
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="rounded-2xl border border-orange-100/90 bg-gradient-to-br from-amber-50/95 via-orange-50/50 to-orange-50/70 p-6 text-lg font-medium leading-relaxed text-stone-700 sm:p-8 sm:text-xl">
          À l’atelier, on met le cap sur une seule chose : transformer une idée
          — parfois floue au départ — en objet qu’on garde longtemps. Un
          vêtement qui tombe juste, un siège qui retrouve du confort, un
          accessoire qu’on sort tous les jours sans se lasser.
        </div>
      </section>

      <section className="border-y border-orange-100/70 bg-white/60 py-12 sm:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-500">
            Prestations
          </h2>
          <p className="mt-2 text-2xl font-bold tracking-tight text-stone-800 sm:text-3xl">
            Tout ce que l’atelier peut faire pour vous
          </p>
          <p className="mt-3 max-w-2xl text-stone-600">
            Une mercerie qui vit, une couture qui s’adapte à votre quotidien, et
            des prestations pour les projets un peu plus techniques — tout au
            même endroit.
          </p>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:gap-5">
            {prestations.map((p) => (
              <li
                key={p.titre}
                className="rounded-2xl border border-orange-100/90 bg-gradient-to-br from-orange-50/50 to-white p-6 shadow-sm"
              >
                <h3 className="text-lg font-bold text-stone-800">{p.titre}</h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-600">
                  {p.texte}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-500">
          Engagements
        </h2>
        <p className="mt-2 text-2xl font-bold tracking-tight text-stone-800 sm:text-3xl">
          Trois promesses, non négociables
        </p>
        <ul className="mt-10 grid gap-6 lg:grid-cols-3">
          {engagements.map((e) => (
            <li
              key={e.titre}
              className="relative rounded-2xl border border-orange-100/90 bg-white/90 p-6 pt-8 shadow-sm"
            >
              <span
                aria-hidden
                className="absolute left-6 top-0 -translate-y-1/2 rounded-full bg-orange-300 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-orange-950"
              >
                +
              </span>
              <h3 className="text-lg font-bold text-stone-800">{e.titre}</h3>
              <p className="mt-2 text-sm leading-relaxed text-stone-600">
                {e.texte}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="border-t border-orange-100/70 bg-gradient-to-br from-amber-200/45 via-orange-200/40 to-orange-200/35 py-12 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-600">
            Coulisses
          </h2>
          <p className="mt-2 text-2xl font-bold tracking-tight text-stone-800 sm:text-3xl">
            Suivez l’atelier au quotidien
          </p>
          <p className="mt-4 text-stone-600">
            Sur Instagram, vous trouvez les dernières pièces terminées, les
            tissus du moment, les avant/après qui donnent envie — et parfois la
            preuve qu’un vieux fauteuil méritait une seconde jeunesse.
          </p>
          <Link
            href={company.instagram.profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex h-11 items-center justify-center rounded-full bg-white/95 px-6 text-sm font-semibold text-stone-800 shadow-sm ring-1 ring-orange-100/80 transition hover:bg-white"
          >
            Profil @{company.instagram.handle} (Message)
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-500">
          Démarche
        </h2>
        <p className="mt-2 text-2xl font-bold tracking-tight text-stone-800 sm:text-3xl">
          Comment ça se passe, concrètement ?
        </p>
        <ol className="mt-10 space-y-6">
          {etapes.map((e) => (
            <li
              key={e.pas}
              className="flex gap-4 rounded-2xl border border-orange-100/90 bg-white/90 p-5 shadow-sm sm:gap-6 sm:p-6"
            >
              <span className="shrink-0 font-mono text-2xl font-bold tabular-nums text-orange-500 sm:text-3xl">
                {e.pas}
              </span>
              <div>
                <h3 className="text-lg font-bold text-stone-800">{e.titre}</h3>
                <p className="mt-1 text-sm leading-relaxed text-stone-600 sm:text-base">
                  {e.texte}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="border-t border-orange-100/70 bg-gradient-to-b from-amber-50/85 to-orange-50/40 py-12 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight text-stone-800 sm:text-3xl">
            L’atelier vous attend
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-stone-600">
            {company.enseigne} — {company.adresse.numeroEtVoie},{" "}
            {company.adresse.codePostal} {company.adresse.ville}.
            <span className="mt-2 block text-sm text-stone-500">
              Retrait et rendez-vous en général sur créneaux convenus ensemble.
            </span>
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href={company.instagram.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center justify-center rounded-full bg-orange-300 px-7 text-sm font-semibold text-orange-950 shadow-sm transition hover:bg-orange-400"
            >
              Instagram — devis
            </Link>
            <Link
              href="/mentions-legales"
              className="inline-flex h-11 items-center justify-center rounded-full border border-orange-200/90 bg-white/90 px-7 text-sm font-semibold text-stone-700 transition hover:bg-white"
            >
              Infos légales
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
