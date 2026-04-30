import Image from "next/image";
import { formatPrice, type Product } from "@/lib/shop";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const hasImage = Boolean(product.imagePath?.trim());

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-orange-100/90 bg-white/95 shadow-sm ring-1 ring-orange-50/80">
      <div className="relative aspect-[4/3] w-full bg-orange-50/40">
        {hasImage ? (
          <Image
            src={product.imagePath as string}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full min-h-[10rem] flex-col items-center justify-center bg-gradient-to-br from-orange-50/80 via-white to-amber-50/60 px-4 text-center">
            <div
              aria-hidden
              className="flex size-11 items-center justify-center rounded-full bg-white/85 text-orange-400 ring-1 ring-orange-100"
            >
              <svg
                viewBox="0 0 24 24"
                className="size-5"
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
            <p className="mt-3 text-xs font-medium text-stone-500">
              Image à renseigner dans l’espace admin
            </p>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4 sm:p-5">
        <h2 className="text-lg font-semibold tracking-tight text-stone-800">
          {product.name}
        </h2>
        <p className="flex-1 text-sm leading-relaxed text-stone-600">
          {product.description}
        </p>
        <p className="text-base font-semibold text-orange-600">
          {formatPrice(product.priceEur)}
        </p>
        <p className="text-xs text-stone-500">
          Stock disponible : {Math.max(0, product.quantity)}
        </p>
      </div>
    </article>
  );
}
