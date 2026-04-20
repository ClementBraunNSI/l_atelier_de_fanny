/**
 * Identité légale — source : API Recherche Entreprises (data.gouv),
 * vérification possible sur https://www.pappers.fr/entreprise/braun-fanny-942082702
 */
export const company = {
  enseigne: "L'Atelier de Fanny",
  /** Dénomination d'usage / nom commercial INSEE */
  nomCommercial: "L'ATELIER DE FANNY",
  /** Personne physique dirigeante */
  dirigeante: "Madame Fanny BRAUN (née NOEL)",
  formeJuridique: "Entrepreneur individuel",
  siren: "942082702",
  siretSiege: "94208270200013",
  adresse: {
    numeroEtVoie: "11 rue Antonio Vivaldi",
    codePostal: "62710",
    ville: "Courrières",
  },
  /** Code APE / NAF principal (révision 2) */
  codeApe: "14.13Z",
  libelleApe:
    "Fabrication de vêtements de dessus (activité principale déclarée à l'INSEE — prestations annexes éventuelles à préciser).",
  dateCreation: "2025-03-15",
  lienPappers: "https://www.pappers.fr/entreprise/braun-fanny-942082702",
  instagram: {
    handle: "l_atelier_de_fanny__",
    /** Profil public — les devis et demandes passent par la messagerie depuis cette page. */
    profileUrl: "https://www.instagram.com/l_atelier_de_fanny__/",
  },
} as const;

export function adresseUneLigne() {
  const { numeroEtVoie, codePostal, ville } = company.adresse;
  return `${numeroEtVoie}, ${codePostal} ${ville}`;
}
