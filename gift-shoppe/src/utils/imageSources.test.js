import { getProductImageSources, getWebpPath, withPublicUrl } from './imageSources';

describe('imageSources', () => {
  it('builds webp path from jpeg', () => {
    expect(getWebpPath('/img/Products/f1.jpg')).toBe('/img/Products/f1.webp');
    expect(getWebpPath('/img/Items/p1.jpeg')).toBe('/img/Items/p1.webp');
  });

  it('returns null for non-jpeg paths', () => {
    expect(getWebpPath('/img/logo.png')).toBeNull();
    expect(getWebpPath('')).toBeNull();
  });

  it('prefixes public URL for app assets', () => {
    expect(withPublicUrl('/img/Products/f1.jpg', '/gift-shoppe')).toBe('/gift-shoppe/img/Products/f1.jpg');
  });

  it('exposes fallback and webp sources', () => {
    const sources = getProductImageSources('/img/Products/f1.jpg', '');
    expect(sources.fallback).toBe('/img/Products/f1.jpg');
    expect(sources.webp).toBe('/img/Products/f1.webp');
    expect(sources.hasWebp).toBe(true);
  });
});
