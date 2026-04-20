import Link from "next/link";

const nav = [
  { href: "/", label: "Accueil" },
  { href: "/catalogue", label: "Boutique" },
  { href: "/a-propos", label: "À propos" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-rose-100/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-center gap-2 px-4 sm:h-16 sm:gap-3 sm:px-6 lg:px-8">
        <nav
          aria-label="Navigation principale"
          className="flex flex-wrap items-center justify-center gap-0.5 sm:gap-1"
        >
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-lg px-2 py-1.5 text-[13px] font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-300 sm:px-2.5 sm:text-sm ${
                item.href === "/catalogue"
                  ? "bg-rose-200/70 text-rose-950 hover:bg-rose-200"
                  : "text-stone-600 hover:bg-rose-50 hover:text-stone-800"
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
