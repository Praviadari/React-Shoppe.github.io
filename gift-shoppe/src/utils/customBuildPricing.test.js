import {
  BASE_ITEM_PRICES,
  MATERIAL_MULTIPLIERS,
  calculateCustomBuildPrice,
  getExpectedCustomItemPrice,
} from './customBuildPricing';

describe('customBuildPricing', () => {
  it('calculates base item with wood material', () => {
    expect(calculateCustomBuildPrice({ baseItem: '3d-sphere', material: 'wood' })).toBe(500);
    expect(calculateCustomBuildPrice({ baseItem: 'premium-watch', material: 'wood' })).toBe(1200);
  });

  it('applies material multipliers', () => {
    expect(calculateCustomBuildPrice({ baseItem: 'infinity-frame', material: 'crystal' })).toBe(900);
    expect(calculateCustomBuildPrice({ baseItem: 'infinity-frame', material: 'gold-plated' })).toBe(1500);
  });

  it('adds engraving surcharge', () => {
    expect(calculateCustomBuildPrice({
      baseItem: '3d-sphere',
      material: 'wood',
      engraving: 'Asha',
    })).toBe(600);
  });

  it('reads expected price from metadata', () => {
    expect(getExpectedCustomItemPrice({
      baseItem: 'infinity-frame',
      material: 'crystal',
      engraving: 'Asha',
    })).toBe(1000);
  });

  it('exports pricing tables for build page parity', () => {
    expect(BASE_ITEM_PRICES['infinity-frame']).toBe(600);
    expect(MATERIAL_MULTIPLIERS.crystal).toBe(1.5);
  });
});
