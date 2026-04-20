import type { Metadata } from "next";
import Link from "next/link";
import { LegalSection } from "@/components/legal-section";
import { PageHeading } from "@/components/page-heading";
import { adresseUneLigne, company } from "@/lib/company";

export const metadata: Metadata = {
  title: "Conditions générales de vente",
  description: "CGV pour les ventes de produits et prestations en ligne.",
};

export default function TermsPage() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <PageHeading
        title="Conditions générales de vente"
        description="Modèle à adapter (délais sur commande, exceptions de rétractation, médiation). Faites relire par un juriste avant mise en production."
      />

      <div className="mt-10 space-y-12">
        <LegalSection title="Article 1 — Champ d'application">
          <p>
            Les présentes CGV s&apos;appliquent aux ventes conclues entre{" "}
            <strong>{company.dirigeante}</strong>,{" "}
            {company.formeJuridique} — enseigne <strong>{company.enseigne}</strong>{" "}
            —, dont le siège est situé {adresseUneLigne()}, immatriculée sous le
            numéro SIRET <strong>{company.siretSiege}</strong> (« le Vendeur »),
            et toute personne physique aguant à titre non professionnel (« le
            Client »), sur le présent site internet.
          </p>
        </LegalSection>

        <LegalSection title="Article 2 — Commandes">
          <p>
            Toute commande vaut acceptation des prix et descriptions des produits
            ou prestations. Le Vendeur peut refuser une commande en cas de litige
            antérieur relatif au paiement.
          </p>
        </LegalSection>

        <LegalSection title="Article 3 — Prix et paiement">
          <p>
            Prix en euros (TTC ou HT selon affichage), frais de livraison ou de
            prestation précisés avant validation. Paiement par carte bancaire via
            Stripe (Checkout), et le cas échéant virement sur devis lorsque cela
            est convenu par écrit entre les parties.
          </p>
        </LegalSection>

        <LegalSection title="Article 4 — Livraison / retrait">
          <p>
            Délais communiqués à la commande ou par e-mail. Transfert des
            risques à la remise au transporteur ou au retrait en atelier.
          </p>
        </LegalSection>

        <LegalSection title="Article 5 — Droit de rétractation">
          <p>
            Délai légal de 14 jours pour le consommateur, sous réserves
            d&apos;exceptions légales (personnalisation, biens confectionnés sur
            mesure, etc. — à lister selon le catalogue réel).
          </p>
          <p>Modalités de retour et formulaire type : à compléter.</p>
        </LegalSection>

        <LegalSection title="Article 6 — Garanties légales">
          <p>
            Garantie légale de conformité et garantie des vices cachés, dans les
            conditions du Code de la consommation et du Code civil.
          </p>
        </LegalSection>

        <LegalSection title="Article 7 — Données personnelles">
          <p>
            Traitements décrits dans les{" "}
            <Link href="/mentions-legales">mentions légales</Link>.
          </p>
        </LegalSection>

        <LegalSection title="Article 8 — Litiges">
          <p>
            Recherche d&apos;une solution amiable préalable. Médiation de la
            consommation selon les mentions légales.
          </p>
        </LegalSection>
      </div>
    </main>
  );
}
