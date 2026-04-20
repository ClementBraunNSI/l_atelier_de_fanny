import Link from "next/link";

const nav = [
  { href: "/", label: "Accueil" },
  { href: "/catalogue", label: "Boutique" },
  { href: "/a-propos", label: "À propos" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-stone-200/90 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4 sm:h-16 sm:gap-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="min-w-0 shrink text-[0.95rem] font-bold tracking-tight text-stone-900 sm:text-base"
        >
          L&apos;Atelier de Fanny
        </Link>
        <nav
          aria-label="Navigation principale"
          className="flex items-center gap-0.5 sm:gap-1"
        >
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-lg px-2 py-1.5 text-[13px] font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500 sm:px-2.5 sm:text-sm ${
                item.href === "/catalogue"
                  ? "bg-rose-50 text-rose-900 hover:bg-rose-100"
                  : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
