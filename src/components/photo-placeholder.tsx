type PhotoPlaceholderProps = {
  /** Texte indicatif pour la personne qui remplira le visuel (remplacer par une image). */
  caption: string;
  /** Classes Tailwind pour le ratio, ex. aspect-[4/3], aspect-square, min-h-[…] */
  aspectClass?: string;
  className?: string;
};

/**
 * Bloc réservé à une future image (Next/Image ou balise img).
 * Remplacer le contenu par une vraie photo une fois les fichiers disponibles.
 */
export function PhotoPlaceholder({
  caption,
  aspectClass = "aspect-[4/3]",
  className = "",
}: PhotoPlaceholderProps) {
  return (
    <figure
      className={`relative flex w-full flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed border-orange-200/90 bg-gradient-to-br from-orange-50/70 via-white to-amber-50/50 text-center shadow-inner ${aspectClass} ${className}`}
    >
      <div
        aria-hidden
        className="flex size-12 items-center justify-center rounded-full bg-white/80 text-orange-400 ring-1 ring-orange-100"
      >
        <svg
          viewBox="0 0 24 24"
          className="size-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3A1.5 1.5 0 001.5 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008H12.75V8.25z"
          />
        </svg>
      </div>
      <figcaption className="mt-3 max-w-[90%] px-3 text-xs font-medium leading-snug text-stone-500">
        {caption}
      </figcaption>
    </figure>
  );
}
