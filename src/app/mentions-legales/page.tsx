import type { Metadata } from "next";
import Link from "next/link";
import { LegalSection } from "@/components/legal-section";
import { PageHeading } from "@/components/page-heading";
import { adresseUneLigne, company } from "@/lib/company";

export const metadata: Metadata = {
  title: "Mentions légales",
  description:
    "Informations réglementaires sur l'éditeur, l'hébergement et les données personnelles.",
};

export default function LegalNoticePage() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <PageHeading
        title="Mentions légales"
        description="Informations issues du répertoire Sirene (API entreprise.data.gouv). Faites relire par un professionnel du droit avant mise en ligne définitive."
      />

      <div className="mt-10 space-y-12">
        <LegalSection title="1. Éditeur du site">
          <p>
            Le site est édité par <strong>{company.dirigeante}</strong>,{" "}
            <strong>{company.formeJuridique}</strong>, exploitant
            l&apos;enseigne <strong>{company.enseigne}</strong> (
            {company.nomCommercial}).
          </p>
          <p>
            <strong>Siège :</strong> {adresseUneLigne()}.
          </p>
          <p>
            <strong>SIREN :</strong> {company.siren} —{" "}
            <strong>SIRET (siège) :</strong> {company.siretSiege}.
          </p>
          <p>
            <strong>Activité principale déclarée (code APE) :</strong>{" "}
            {company.codeApe} — {company.libelleApe}
          </p>
          <p>
            <strong>Immatriculation :</strong> entreprise créée le{" "}
            {new Date(company.dateCreation).toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
            . Synthèse publique :{" "}
            <a
              href={company.lienPappers}
              target="_blank"
              rel="noopener noreferrer"
            >
              fiche Pappers
            </a>
            .
          </p>
          <p>
            <strong>Directrice de la publication :</strong> Madame Fanny BRAUN.
          </p>
          <p>
            <strong>Contact :</strong> pour les demandes liées au site ou aux
            commandes, s&apos;adresser via le profil Instagram (
            <a
              href={company.instagram.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              @{company.instagram.handle}
            </a>
            , messagerie depuis la page du profil). E-mail et téléphone
            professionnels, le cas échéant, sur la page{" "}
            <Link href="/contact">Contact</Link>.
          </p>
          <p>
            <strong>TVA :</strong> mention à adapter selon votre situation
            réelle (ex. numéro de TVA intracommunautaire si assujetti, ou
            mention de franchise en base pour micro-entrepreneur éligible —
            valider avec votre comptable).
          </p>
        </LegalSection>

        <LegalSection title="2. Médiation et consommation">
          <p>
            Pour toute vente aux consommateurs : désigner un médiateur de la
            consommation et indiquer ses coordonnées ici, conformément aux
            articles L.612-1 et suivants du Code de la consommation.
          </p>
        </LegalSection>

        <LegalSection title="3. Hébergement">
          <p>
            Hébergeur : <strong>Vercel Inc.</strong>, 440 N Barranca Ave #4133,
            Covina, CA 91723, États-Unis —{" "}
            <a
              href="https://vercel.com/legal/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
            >
              Politique de confidentialité Vercel
            </a>
            .
          </p>
        </LegalSection>

        <LegalSection title="4. Propriété intellectuelle">
          <p>
            Les éléments du site (textes, images, structure, logo) sont la
            propriété de l&apos;éditeur ou font l&apos;objet d&apos;autorisations.
            Toute reproduction non autorisée est interdite (Code de la propriété
            intellectuelle).
          </p>
        </LegalSection>

        <LegalSection title="5. Données personnelles (RGPD)">
          <p>
            Traitements conformes au RGPD et à la loi « Informatique et Libertés
            ». <strong>Responsable du traitement :</strong> l&apos;éditeur, aux
            coordonnées ci-dessus.
          </p>
          <p>
            <strong>Finalités :</strong> réponses aux demandes, commandes,
            facturation, sécurité du site, mesure d&apos;audience le cas échéant.
          </p>
          <p>
            <strong>Droits :</strong> accès, rectification, effacement,
            limitation, opposition, réclamation auprès de la{" "}
            <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">
              CNIL
            </a>
            . Exercice : via les coordonnées publiées sur la page Contact.
          </p>
          <p>
            <strong>Sous-traitants :</strong> hébergeur (Vercel), prestataires de
            paiement (Stripe).
          </p>
        </LegalSection>

        <LegalSection title="6. Cookies">
          <p>
            Cookies strictement nécessaires au fonctionnement du site. Si des
            cookies analytics ou publicitaires sont ajoutés, un bandeau de
            consentement conforme aux recommandations de la CNIL sera affiché.
          </p>
        </LegalSection>

        <LegalSection title="7. Liens externes">
          <p>
            Les liens vers des sites tiers (ex. Instagram) n&apos;engagent pas la
            responsabilité de l&apos;éditeur quant à leur contenu.
          </p>
        </LegalSection>

        <LegalSection title="8. Litiges">
          <p>
            Droit français. Plateforme européenne RLL :{" "}
            <a
              href="https://ec.europa.eu/consumers/odr"
              target="_blank"
              rel="noopener noreferrer"
            >
              ec.europa.eu/consumers/odr
            </a>
            .
          </p>
        </LegalSection>

        <LegalSection title="9. Conditions de vente">
          <p>
            <Link href="/cgv">Conditions générales de vente</Link>.
          </p>
        </LegalSection>
      </div>
    </main>
  );
}
