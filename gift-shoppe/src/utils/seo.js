import { getProductSlug } from './productHelpers';
import {
  DEFAULT_CURRENCY,
  DEFAULT_DESCRIPTION,
  DEFAULT_OG_IMAGE,
  SITE_NAME,
  SITE_TAGLINE,
} from '../config/site';

export function getConfiguredSiteOrigin() {
  const configured = process.env.REACT_APP_SITE_URL;
  if (configured) {
    return configured.replace(/\/$/, '');
  }
  return '';
}

export function getSiteOrigin() {
  const configured = getConfiguredSiteOrigin();
  if (configured) {
    return configured;
  }
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin;
  }
  return '';
}

export function buildAbsoluteUrl(path = '/') {
  const origin = getSiteOrigin();
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const basePath = (process.env.PUBLIC_URL || '').replace(/\/$/, '');
  const fullPath = `${basePath}${normalizedPath}` || '/';
  return origin ? `${origin}${fullPath}` : fullPath;
}

export function buildPageTitle(pageTitle) {
  if (!pageTitle || pageTitle === SITE_NAME) {
    return `${SITE_NAME} | ${SITE_TAGLINE}`;
  }
  return `${pageTitle} | ${SITE_NAME}`;
}

export function buildOrganizationJsonLd() {
  const origin = getSiteOrigin();
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: origin || undefined,
    description: DEFAULT_DESCRIPTION,
    logo: buildAbsoluteUrl(DEFAULT_OG_IMAGE),
  };
}

export function buildWebSiteJsonLd() {
  const origin = getSiteOrigin();
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: origin || undefined,
    description: DEFAULT_DESCRIPTION,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${origin || ''}/shop?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function buildProductJsonLd(product) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description || DEFAULT_DESCRIPTION,
    image: [buildAbsoluteUrl(product.image)],
    sku: product.id,
    brand: {
      '@type': 'Brand',
      name: SITE_NAME,
    },
    offers: {
      '@type': 'Offer',
      url: buildAbsoluteUrl(`/shop/${product.slug || getProductSlug(product)}`),
      priceCurrency: DEFAULT_CURRENCY,
      price: product.price,
      availability: 'https://schema.org/InStock',
    },
  };
}

export function buildBreadcrumbJsonLd(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: buildAbsoluteUrl(item.path),
    })),
  };
}

export function buildItemListJsonLd(products, listName) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: listName,
    itemListElement: products.map((product, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: buildAbsoluteUrl(`/shop/${product.slug || getProductSlug(product)}`),
      name: product.name,
    })),
  };
}
