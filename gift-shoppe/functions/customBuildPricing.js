const BASE_ITEM_PRICES = {
  '3d-sphere': 500,
  'infinity-frame': 600,
  'mosaic-stand': 700,
  'premium-watch': 1200,
};

const MATERIAL_MULTIPLIERS = {
  wood: 1,
  acrylic: 1.2,
  crystal: 1.5,
  'gold-plated': 2.5,
};

const ENGRAVING_SURCHARGE = 100;

function calculateCustomBuildPrice({ baseItem, material, engraving }) {
  const basePrice = BASE_ITEM_PRICES[baseItem] ?? BASE_ITEM_PRICES['3d-sphere'];
  const multiplier = MATERIAL_MULTIPLIERS[material] ?? 1;
  const engravingFee = engraving ? ENGRAVING_SURCHARGE : 0;
  return Math.round(basePrice * multiplier + engravingFee);
}

function getExpectedCustomItemPrice(metadata = {}) {
  if (!metadata.baseItem) return null;
  return calculateCustomBuildPrice({
    baseItem: metadata.baseItem,
    material: metadata.material || 'wood',
    engraving: metadata.engraving,
  });
}

module.exports = {
  calculateCustomBuildPrice,
  getExpectedCustomItemPrice,
};
