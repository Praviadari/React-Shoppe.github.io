export const BASE_ITEM_PRICES = {
  '3d-sphere': 500,
  'infinity-frame': 600,
  'mosaic-stand': 700,
  'premium-watch': 1200,
};

export const MATERIAL_MULTIPLIERS = {
  wood: 1,
  acrylic: 1.2,
  crystal: 1.5,
  'gold-plated': 2.5,
};

export const ENGRAVING_SURCHARGE = 100;

export const MATERIAL_LABELS = {
  wood: 'Premium Teak Wood',
  acrylic: 'Clear Acrylic',
  crystal: 'Solid Crystal',
  'gold-plated': '24k Gold Plated',
};

export function normalizeMaterialKey(material) {
  if (MATERIAL_MULTIPLIERS[material]) return material;
  const match = Object.entries(MATERIAL_LABELS).find(([, label]) => label === material);
  return match ? match[0] : material;
}

export function calculateCustomBuildPrice({ baseItem, material, engraving }) {
  const basePrice = BASE_ITEM_PRICES[baseItem] ?? BASE_ITEM_PRICES['3d-sphere'];
  const multiplier = MATERIAL_MULTIPLIERS[normalizeMaterialKey(material)] ?? 1;
  const engravingFee = engraving ? ENGRAVING_SURCHARGE : 0;
  return Math.round(basePrice * multiplier + engravingFee);
}

export function getExpectedCustomItemPrice(metadata = {}) {
  if (!metadata.baseItem) return null;
  return calculateCustomBuildPrice({
    baseItem: metadata.baseItem,
    material: metadata.material || 'wood',
    engraving: metadata.engraving,
  });
}
