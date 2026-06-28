/**
 * Post-build static HTML prerender for crawlers that do not execute JavaScript.
 * Run after `react-scripts build` via `npm run prerender`.
 */
const fs = require('fs');
const path = require('path');

const SITE_NAME = 'GiftShoppe';
const SITE_TAGLINE = 'Premium curated global gifting';
const DEFAULT_DESCRIPTION =
  'Discover meaningful gifts from GiftShoppe — curated photo frames, bespoke watches, custom builds, and worldwide delivery.';
const DEFAULT_OG_IMAGE = '/img/Products/f1.jpg';
const DEFAULT_CURRENCY = 'INR';

const SITE_URL = (process.env.REACT_APP_SITE_URL || 'https://giftshoppe.com').replace(/\/$/, '');
const PUBLIC_URL = (process.env.PUBLIC_URL || '').replace(/\/$/, '');

const STATIC_PAGES = {
  '/': {
    title: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
    image: DEFAULT_OG_IMAGE,
    heading: SITE_NAME,
    body: DEFAULT_DESCRIPTION,
  },
  '/shop': {
    title: 'Shop',
    description: 'Browse GiftShoppe\'s full catalog of curated photo frames, watches, and bespoke gift ideas.',
    heading: 'The Global Shop',
    body: 'Browse our exclusive catalog of premium gifts.',
  },
  '/collections': {
    title: 'Collections',
    description: 'Explore curated GiftShoppe collections — featured gifts, new arrivals, and signature items.',
    heading: 'Collections',
    body: 'Curated gift collections for every occasion.',
  },
  '/build': {
    title: 'Custom Gift Builder',
    description: 'Design a bespoke GiftShoppe piece — choose materials, engraving, and typography.',
    heading: 'Bespoke Gift Studio',
    body: 'Design a one-of-a-kind custom gift.',
  },
  '/about': {
    title: 'Our Story',
    description: 'Learn how GiftShoppe curates premium global gifts with master artisans worldwide.',
    heading: 'Our Story',
    body: 'GiftShoppe was founded on the idea that gifting should be an experience.',
  },
  '/concierge': {
    title: 'Gift Concierge',
    description: 'Personalized gift recommendations from GiftShoppe\'s concierge team.',
    heading: 'Gift concierge',
    body: 'Tell us about the recipient and we will curate recommendations.',
  },
  '/corporate': {
    title: 'Corporate Gifting',
    description: 'Bulk gifting, branded packaging, and scheduled delivery for teams and clients.',
    heading: 'Corporate gifting',
    body: 'Premium corporate gifting at scale.',
  },
  '/faq': {
    title: 'FAQ',
    description: 'Frequently asked questions about GiftShoppe delivery, returns, and personalization.',
    heading: 'Frequently asked questions',
    body: 'Answers about ordering, delivery, and our premium services.',
  },
  '/shipping': {
    title: 'Shipping & Returns',
    description: 'GiftShoppe shipping rates, delivery timelines, and return policy.',
    heading: 'Shipping & returns',
    body: 'Worldwide shipping with complimentary gift wrapping.',
  },
  '/contact': {
    title: 'Contact Us',
    description: 'Get in touch with GiftShoppe support for orders, returns, and gifting advice.',
    heading: 'Contact us',
    body: 'We are here to help with your gifting needs.',
  },
  '/support': {
    title: '24/7 Support',
    description: 'GiftShoppe customer support — FAQ, order tracking, contact, and concierge services.',
    heading: '24/7 Support',
    body: 'Find help with orders, delivery, and gifting advice.',
  },
};

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function getProductSlug(product) {
  return `${slugify(product.name)}-${product.id}`;
}

function toAbsoluteUrl(routePath) {
  const normalizedPath = routePath.startsWith('/') ? routePath : `/${routePath}`;
  const basePath = PUBLIC_URL.replace(/\/$/, '');
  const fullPath = `${basePath}${normalizedPath}` || '/';
  return `${SITE_URL}${fullPath}`;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function parseProducts(source) {
  const products = [];
  const pattern =
    /\{\s*id:\s*'([^']+)',\s*name:\s*'((?:\\'|[^'])*)',\s*price:\s*(\d+),\s*image:\s*'([^']+)',\s*category:\s*'([^']+)'/g;
  let match = pattern.exec(source);

  while (match) {
    products.push({
      id: match[1],
      name: match[2].replace(/\\'/g, "'"),
      price: Number(match[3]),
      image: match[4],
      category: match[5],
      slug: getProductSlug({ id: match[1], name: match[2].replace(/\\'/g, "'") }),
      description: `Shop ${match[2].replace(/\\'/g, "'")} — a premium ${match[5].toLowerCase()} gift from GiftShoppe.`,
    });
    match = pattern.exec(source);
  }

  return products;
}

function buildPageTitle(pageTitle) {
  if (!pageTitle || pageTitle === SITE_NAME) {
    return `${SITE_NAME} | ${SITE_TAGLINE}`;
  }
  return `${pageTitle} | ${SITE_NAME}`;
}

function buildProductJsonLd(product) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: [toAbsoluteUrl(product.image)],
    sku: product.id,
    brand: { '@type': 'Brand', name: SITE_NAME },
    offers: {
      '@type': 'Offer',
      url: toAbsoluteUrl(`/shop/${product.slug}`),
      priceCurrency: DEFAULT_CURRENCY,
      price: product.price,
      availability: 'https://schema.org/InStock',
    },
  };
}

function buildHeadTags({ title, description, path, image, type = 'website', jsonLd }) {
  const pageTitle = buildPageTitle(title);
  const canonical = toAbsoluteUrl(path);
  const ogImage = toAbsoluteUrl(image || DEFAULT_OG_IMAGE);
  const jsonLdBlock = jsonLd
    ? `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`
    : '';

  return `
    <title>${escapeHtml(pageTitle)}</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <link rel="canonical" href="${escapeHtml(canonical)}" />
    <meta property="og:site_name" content="${SITE_NAME}" />
    <meta property="og:title" content="${escapeHtml(pageTitle)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:type" content="${type}" />
    <meta property="og:url" content="${escapeHtml(canonical)}" />
    <meta property="og:image" content="${escapeHtml(ogImage)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(pageTitle)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    <meta name="twitter:image" content="${escapeHtml(ogImage)}" />
    ${jsonLdBlock}
  `;
}

function buildNoscript({ heading, body, extra = '' }) {
  return `
    <noscript>
      <main style="max-width:720px;margin:2rem auto;padding:0 1.5rem;font-family:Inter,sans-serif;line-height:1.7;color:#333;">
        <h1 style="font-weight:300;font-size:2rem;margin-bottom:1rem;">${escapeHtml(heading)}</h1>
        <p>${escapeHtml(body)}</p>
        ${extra}
        <p style="margin-top:1.5rem;color:#595959;">Enable JavaScript for the full GiftShoppe shopping experience.</p>
      </main>
    </noscript>
  `;
}

function applyPrerender(template, { headTags, noscript }) {
  let html = template;
  html = html.replace(/<title>[\s\S]*?<\/title>\s*/i, '');
  html = html.replace(/<meta\s+name="description"[\s\S]*?\/>\s*/i, '');
  html = html.replace(/<meta\s+property="og:[^"]+"[\s\S]*?\/>\s*/gi, '');
  html = html.replace(/<meta\s+name="twitter:[^"]+"[\s\S]*?\/>\s*/gi, '');
  html = html.replace('</head>', `    ${headTags.trim()}\n  </head>`);
  html = html.replace(/<noscript>[\s\S]*?<\/noscript>/, noscript.trim());
  return html;
}

function writeRouteHtml(buildDir, routePath, html) {
  if (routePath === '/') {
    fs.writeFileSync(path.join(buildDir, 'index.html'), html, 'utf8');
    return;
  }

  const segments = routePath.replace(/^\//, '').split('/');
  const dir = path.join(buildDir, ...segments);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf8');
}

function main() {
  const buildDir = path.join(__dirname, '../build');
  const templatePath = path.join(buildDir, 'index.html');

  if (!fs.existsSync(templatePath)) {
    console.error('[prerender] build/index.html not found. Run `npm run build` first.');
    process.exit(1);
  }

  const template = fs.readFileSync(templatePath, 'utf8');
  const productsFile = path.join(__dirname, '../src/data/products.js');
  const products = parseProducts(fs.readFileSync(productsFile, 'utf8'));

  let count = 0;

  Object.entries(STATIC_PAGES).forEach(([routePath, page]) => {
    const html = applyPrerender(template, {
      headTags: buildHeadTags({
        title: page.title,
        description: page.description,
        path: routePath,
        image: page.image,
      }),
      noscript: buildNoscript({
        heading: page.heading,
        body: page.body,
      }),
    });
    writeRouteHtml(buildDir, routePath, html);
    count += 1;
  });

  products.forEach((product) => {
    const routePath = `/shop/${product.slug}`;
    const html = applyPrerender(template, {
      headTags: buildHeadTags({
        title: product.name,
        description: product.description,
        path: routePath,
        image: product.image,
        type: 'product',
        jsonLd: buildProductJsonLd(product),
      }),
      noscript: buildNoscript({
        heading: product.name,
        body: product.description,
        extra: `<p><strong>₹${product.price}</strong> · ${escapeHtml(product.category)}</p>`,
      }),
    });
    writeRouteHtml(buildDir, routePath, html);
    count += 1;
  });

  console.log(`[prerender] Generated ${count} static HTML routes in build/`);
}

main();
