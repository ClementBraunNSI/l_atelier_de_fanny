import productsJson from "@/data/products.json";

export type Product = {
  /** Identifiant stable (slug), utilisé comme clé React. */
  id: string;
  name: string;
  description: string;
  /** Prix affiché en euros (nombre décimal autorisé). */
  priceEuro: number;
  /**
   * Chemin public commençant par /, ex. /boutique/pochette.webp
   * (fichier placé dans public/boutique/…).
   */
  image?: string;
  /** Si false, le produit n’apparaît pas sur le site. Défaut : true. */
  published?: boolean;
};

function asList(data: unknown): Product[] {
  if (!Array.isArray(data)) return [];
  return data as Product[];
}

/**
 * next/image attend une URL (chemin absolu depuis la racine du site ou http(s)).
 * Les chemins type ../public/boutique/… provoquent une erreur au runtime.
 */
function normalizePublicImageSrc(
  image: string | undefined,
): string | undefined {
  if (image == null) return undefined;
  let s = image.trim();
  if (!s) return undefined;
  if (/^https?:\/\//i.test(s)) return s;
  s = s
    .replace(/^(\.\.\/)+public\//i, "/")
    .replace(/^\.\/public\//i, "/")
    .replace(/^public\//i, "/");
  if (!s.startsWith("/")) s = `/${s}`;
  return s.replace(/\/{2,}/g, "/");
}

function withNormalizedImage(p: Product): Product {
  const image = normalizePublicImageSrc(p.image);
  return image === undefined ? { ...p, image: undefined } : { ...p, image };
}

export function getAllProducts(): Product[] {
  return asList(productsJson).map(withNormalizedImage);
}

export function getPublishedProducts(): Product[] {
  return getAllProducts().filter((p) => p.published !== false);
}
