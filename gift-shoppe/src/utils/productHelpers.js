export function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function getProductSlug(product) {
  return `${slugify(product.name)}-${product.id}`;
}

const DEFAULT_DESCRIPTION =
  'A premium curated gift from GiftShoppe, crafted for meaningful moments and lasting memories.';

export function enrichProduct(product) {
  return {
    ...product,
    slug: product.slug || getProductSlug(product),
    description: product.description || DEFAULT_DESCRIPTION,
  };
}
