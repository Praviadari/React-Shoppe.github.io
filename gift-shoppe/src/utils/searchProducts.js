export function searchProducts(products, query) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return [];

  return products.filter((product) => {
    const haystack = [
      product.name,
      product.description,
      product.category,
      product.id,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    return haystack.includes(normalized);
  });
}
