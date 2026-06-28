const fs = require('fs');
const path = require('path');

const SITE_URL = (process.env.REACT_APP_SITE_URL || 'https://giftshoppe.com').replace(/\/$/, '');
const PUBLIC_URL = (process.env.PUBLIC_URL || '').replace(/\/$/, '');

const STATIC_ROUTES = [
  { loc: '/', changefreq: 'weekly', priority: '1.0' },
  { loc: '/shop', changefreq: 'daily', priority: '0.9' },
  { loc: '/collections', changefreq: 'weekly', priority: '0.9' },
  { loc: '/build', changefreq: 'monthly', priority: '0.8' },
  { loc: '/about', changefreq: 'monthly', priority: '0.6' },
];

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function getProductSlug(product) {
  return `${slugify(product.name)}-${product.id}`;
}

function parseProductsFromSource(source) {
  const products = [];
  const pattern = /\{\s*id:\s*'([^']+)',\s*name:\s*'((?:\\'|[^'])*)'/g;
  let match = pattern.exec(source);

  while (match) {
    products.push({
      id: match[1],
      name: match[2].replace(/\\'/g, "'"),
    });
    match = pattern.exec(source);
  }

  return products;
}

function toAbsolutePath(routePath) {
  return `${PUBLIC_URL}${routePath}`.replace(/\/{2,}/g, '/');
}

function buildUrl(routePath) {
  return `${SITE_URL}${toAbsolutePath(routePath)}`;
}

function buildSitemap(routes) {
  const today = new Date().toISOString().split('T')[0];
  const urls = routes
    .map(
      (route) => `  <url>
    <loc>${buildUrl(route.loc)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

function main() {
  const productsFile = path.join(__dirname, '../src/data/products.js');
  const source = fs.readFileSync(productsFile, 'utf8');
  const products = parseProductsFromSource(source);

  const productRoutes = products.map((product) => ({
    loc: `/shop/${getProductSlug(product)}`,
    changefreq: 'weekly',
    priority: '0.7',
  }));

  const sitemap = buildSitemap([...STATIC_ROUTES, ...productRoutes]);
  const outputPath = path.join(__dirname, '../public/sitemap.xml');
  fs.writeFileSync(outputPath, sitemap, 'utf8');

  const robots = `User-agent: *
Allow: /

Sitemap: ${SITE_URL}${toAbsolutePath('/sitemap.xml')}
`;
  fs.writeFileSync(path.join(__dirname, '../public/robots.txt'), robots, 'utf8');

  // eslint-disable-next-line no-console
  console.log(`Generated sitemap with ${STATIC_ROUTES.length + productRoutes.length} URLs → public/sitemap.xml`);
}

main();
