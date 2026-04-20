import { company } from "@/lib/company";

/**
 * Bandeau type boutique (livraison, retrait, actu).
 * Inspiré des e-commerces artisanaux (ex. bandeau promo en tête de page).
 */
export function PromoBar() {
  return (
    <div className="border-b border-rose-200/60 bg-gradient-to-r from-rose-950 via-rose-900 to-rose-950 px-4 py-2.5 text-center text-[13px] font-medium text-rose-50 sm:text-sm">
      <span className="opacity-95">
        {`Devis et projets : profil Instagram @${company.instagram.handle} (bouton Message) · retrait à l’atelier sur rendez-vous à Courrières`}
      </span>
    </div>
  );
}
