import React from 'react';
import { Helmet } from 'react-helmet-async';
import { SITE_NAME } from '../../config/site';
import { buildAbsoluteUrl, buildPageTitle } from '../../utils/seo';

function JsonLd({ data }) {
  const graphs = Array.isArray(data) ? data : [data];

  return (
    <Helmet>
      {graphs.map((graph, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(graph)}
        </script>
      ))}
    </Helmet>
  );
}

function SeoHead({
  title = SITE_NAME,
  description,
  path = '/',
  image,
  type = 'website',
  noindex = false,
  jsonLd,
}) {
  const pageTitle = buildPageTitle(title);
  const canonicalUrl = buildAbsoluteUrl(path);
  const ogImage = buildAbsoluteUrl(image || '/img/Products/f1.jpg');

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        {description && <meta name="description" content={description} />}
        <link rel="canonical" href={canonicalUrl} />
        {noindex && <meta name="robots" content="noindex,nofollow" />}

        <meta property="og:site_name" content={SITE_NAME} />
        <meta property="og:title" content={pageTitle} />
        {description && <meta property="og:description" content={description} />}
        <meta property="og:type" content={type} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content={ogImage} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        {description && <meta name="twitter:description" content={description} />}
        <meta name="twitter:image" content={ogImage} />
      </Helmet>
      {jsonLd && <JsonLd data={jsonLd} />}
    </>
  );
}

export default SeoHead;
