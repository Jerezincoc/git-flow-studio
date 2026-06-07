import { Helmet } from 'react-helmet-async';

const SITE_NAME = 'GitDoc';
const OG_IMAGE = 'https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/72f634ba-bfcd-4e55-938a-0bcc8a5e9a26/id-preview-28556496--8f98da48-4764-409a-9d16-0d3bc6a30bec.lovable.app-1771776222497.png';
export const DEFAULT_DESCRIPTION = 'Aprenda Git de forma visual e interativa. Referência completa de 31 comandos com flags, exemplos práticos, cheat sheet, conventional commits e soluções para os erros mais comuns.';

interface SEOProps {
  title?: string;
  description?: string;
  path?: string;
}

export function SEO({ title, description = DEFAULT_DESCRIPTION, path = '' }: SEOProps) {
  const fullTitle = title
    ? `${title} | ${SITE_NAME}`
    : `${SITE_NAME} — Aprenda Git de forma visual e interativa`;
  const url = typeof window !== 'undefined'
    ? `${window.location.origin}${path}`
    : path;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={OG_IMAGE} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
    </Helmet>
  );
}
