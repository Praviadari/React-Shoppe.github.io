import {
  BASE_ITEM_PRICES,
  MATERIAL_MULTIPLIERS,
  calculateCustomBuildPrice,
  getExpectedCustomItemPrice,
} from './customBuildPricing';
import catalogPrices from '../data/catalogPrices.json';

export function getCatalogItemPrice(productId) {
  return catalogPrices[productId] ?? null;
}

export function getExpectedItemPrice(item) {
  if (item.type === 'custom') {
    return getExpectedCustomItemPrice(item.metadata);
  }
  return getCatalogItemPrice(item.id);
}

export function validateCartItems(items) {
  if (!Array.isArray(items) || items.length === 0) {
    return { valid: false, error: 'Cart is empty' };
  }

  let subtotal = 0;

  for (const item of items) {
    const expectedPrice = getExpectedItemPrice(item);
    if (expectedPrice === null) {
      return { valid: false, error: `Unknown item: ${item.id}` };
    }
    if (item.price !== expectedPrice) {
      return { valid: false, error: `Invalid price for ${item.name || item.id}` };
    }
    subtotal += expectedPrice * (item.quantity || 1);
  }

  const shipping = subtotal >= 2000 ? 0 : 99;
  return {
    valid: true,
    subtotal,
    shipping,
    total: subtotal + shipping,
  };
}

export { BASE_ITEM_PRICES, MATERIAL_MULTIPLIERS, calculateCustomBuildPrice };
