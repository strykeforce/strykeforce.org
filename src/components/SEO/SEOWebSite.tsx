import React from 'react';
import Helmet from 'react-helmet';
import { LOGO, NAME, ORGANIZATION_ID, STRYKE_FORCE, URL } from './SEOOrganization';

const WEBSITE = {
  '@context': 'http://schema.org',
  '@type': 'WebSite',
  about: { '@id': ORGANIZATION_ID },
  description: `This is the Stryke Force Web Site. ${STRYKE_FORCE}`,
  image: LOGO,
  name: NAME,
  publisher: { '@id': ORGANIZATION_ID },
  url: URL,
};

export const SEOWebSite: React.FC<{}> = () => (
  <Helmet>
    <script type="application/ld+json">{JSON.stringify(WEBSITE)}</script>
  </Helmet>
);
