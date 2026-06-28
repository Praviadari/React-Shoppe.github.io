import {
  buildAbsoluteUrl,
  buildBreadcrumbJsonLd,
  buildItemListJsonLd,
  buildOrganizationJsonLd,
  buildPageTitle,
  buildProductJsonLd,
  buildWebSiteJsonLd,
} from './seo';
import { getProductSlug } from './productHelpers';

describe('seo utilities', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv, REACT_APP_SITE_URL: 'https://giftshoppe.example.com' };
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { ...window.location, origin: 'https://giftshoppe.example.com' },
    });
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('buildPageTitle formats branded titles', () => {
    expect(buildPageTitle('Shop')).toBe('Shop | GiftShoppe');
    expect(buildPageTitle('GiftShoppe')).toBe('GiftShoppe | Premium curated global gifting');
  });

  it('buildAbsoluteUrl uses configured site origin', () => {
    expect(buildAbsoluteUrl('/shop')).toBe('https://giftshoppe.example.com/shop');
  });

  it('buildProductJsonLd includes offer details', () => {
    const product = {
      id: 'f1',
      name: 'Infinity Photo Frame',
      slug: 'infinity-photo-frame-f1',
      price: 500,
      image: '/img/Products/f1.jpg',
      description: 'A premium frame.',
    };

    const schema = buildProductJsonLd(product);
    expect(schema['@type']).toBe('Product');
    expect(schema.offers.price).toBe(500);
    expect(schema.offers.priceCurrency).toBe('INR');
    expect(schema.offers.url).toContain(getProductSlug(product));
  });

  it('buildBreadcrumbJsonLd creates ordered list items', () => {
    const schema = buildBreadcrumbJsonLd([
      { name: 'Home', path: '/' },
      { name: 'Shop', path: '/shop' },
    ]);

    expect(schema.itemListElement).toHaveLength(2);
    expect(schema.itemListElement[1].position).toBe(2);
  });

  it('buildItemListJsonLd maps products to list entries', () => {
    const schema = buildItemListJsonLd(
      [{ id: 'f1', name: 'Infinity Photo Frame', slug: 'infinity-photo-frame-f1' }],
      'Featured'
    );

    expect(schema.itemListElement[0].name).toBe('Infinity Photo Frame');
  });

  it('buildOrganizationJsonLd and buildWebSiteJsonLd include site name', () => {
    expect(buildOrganizationJsonLd().name).toBe('GiftShoppe');
    expect(buildWebSiteJsonLd().name).toBe('GiftShoppe');
  });
});
