const items = [
  {
    title: "Fait main",
    text: "Pièces confectionnées à l'atelier, finitions soignées.",
    icon: (
      <svg viewBox="0 0 24 24" className="size-6" fill="none" aria-hidden>
        <path
          d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          d="M5 19h14M8 19v-2m8 2v-2"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    title: "Fabriqué en France",
    text: "Atelier basé dans les Hauts-de-France.",
    icon: (
      <svg viewBox="0 0 24 24" className="size-6" fill="none" aria-hidden>
        <path
          d="M4 10l8-6 8 6v9a1 1 0 01-1 1h-5v-6H10v6H5a1 1 0 01-1-1v-9z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: "Sur-mesure",
    text: "Couture, retouches et projets à la demande.",
    icon: (
      <svg viewBox="0 0 24 24" className="size-6" fill="none" aria-hidden>
        <path
          d="M4 7h16M4 12h10M4 17h16"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle cx="18" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    title: "Paiement sécurisé",
    text: "Règlement par carte via Stripe (Checkout) — aucune donnée bancaire stockée sur ce site.",
    icon: (
      <svg viewBox="0 0 24 24" className="size-6" fill="none" aria-hidden>
        <rect
          x="5"
          y="11"
          width="14"
          height="10"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M8 11V9a4 4 0 018 0v2"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
] as const;

export function TrustStrip() {
  return (
    <section
      aria-label="Nos engagements"
      className="border-y border-orange-100/70 bg-white/70"
    >
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:gap-8 lg:px-8 lg:py-10">
        {items.map((item) => (
          <div
            key={item.title}
            className="flex gap-4 rounded-2xl border border-orange-100/80 bg-gradient-to-br from-amber-50/90 to-orange-50/50 p-4 lg:flex-col lg:border-0 lg:bg-transparent lg:p-0"
          >
            <div className="shrink-0 text-orange-500">{item.icon}</div>
            <div>
              <p className="font-semibold text-stone-800">{item.title}</p>
              <p className="mt-1 text-sm leading-snug text-stone-600">
                {item.text}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
