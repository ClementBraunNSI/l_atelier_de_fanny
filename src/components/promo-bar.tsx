import { company } from "@/lib/company";

/**
 * Bandeau type boutique (livraison, retrait, actu).
 * Inspiré des e-commerces artisanaux (ex. bandeau promo en tête de page).
 */
export function PromoBar() {
  return (
    <div className="border-b border-orange-200/40 bg-gradient-to-r from-amber-100/90 via-orange-100/80 to-orange-100/90 px-4 py-2.5 text-center text-[13px] font-medium text-stone-600 sm:text-sm">
      <span>
        {`Devis et projets : profil Instagram @${company.instagram.handle} (bouton Message) · retrait à l’atelier sur rendez-vous à Courrières`}
      </span>
    </div>
  );
}
