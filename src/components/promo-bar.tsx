import { company } from "@/lib/company";

/**
 * Bandeau type boutique (livraison, retrait, actu).
 * Inspiré des e-commerces artisanaux (ex. bandeau promo en tête de page).
 */
export function PromoBar() {
  return (
    <div className="border-b border-rose-200/40 bg-gradient-to-r from-rose-100/90 via-violet-100/80 to-sky-100/90 px-4 py-2.5 text-center text-[13px] font-medium text-stone-600 sm:text-sm">
      <span>
        {`Devis et projets : profil Instagram @${company.instagram.handle} (bouton Message) · retrait à l’atelier sur rendez-vous à Courrières`}
      </span>
    </div>
  );
}
