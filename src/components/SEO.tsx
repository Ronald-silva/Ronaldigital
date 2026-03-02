import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
}

const BASE_URL = 'https://www.ronaldigital.tech';
const DEFAULT_IMAGE = `${BASE_URL}/og-image.png`;

export function SEO({ title, description, canonical, ogImage = DEFAULT_IMAGE }: SEOProps) {
  const fullTitle = title
    ? `${title} | RonalDigital`
    : 'RonalDigital | Agentes de IA e Sites em Fortaleza';

  const metaDescription =
    description ??
    'Agentes de IA que vendem por você 24h e sites de alta conversão para negócios em Fortaleza. Landing Pages a partir de R$500. Atendimento remoto.';

  const canonicalUrl = canonical ? `${BASE_URL}${canonical}` : BASE_URL;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      <link rel="canonical" href={canonicalUrl} />

      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={ogImage} />

      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  );
}
