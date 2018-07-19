import React from 'react'
import Helmet from 'react-helmet'

const ADDRESS = {
  '@context': 'http://schema.org',
  '@type': 'PostalAddress',
  addressCountry: 'USA',
  addressLocality: 'Kalamazoo',
  addressRegion: 'MI',
  postalCode: '49048',
  streetAddress: '3557 Midlink Dr',
}

export const NAME = 'Stryke Force 4-H FIRST Robotics Team 2767'
export const URL = 'https://www.strykeforce.org/'
export const LOGO = `${URL}logo.png`
export const ORGANIZATION_ID = `${URL}#organization`
export const STRYKE_FORCE = `Stryke Force 4-H FIRST Robotics Team 2767 is
    a community FIRST robotics team based in Kalamazoo,
    Michigan. We are FRC 2767, FTC 7228 and FTC  8553.`
export const ORGANIZATION = {
  '@context': 'http://schema.org',
  '@id': ORGANIZATION_ID,
  '@type': 'Organization',
  address: ADDRESS,
  description: STRYKE_FORCE,
  logo: LOGO,
  name: NAME,
  sameAs: [
    'https://twitter.com/2767StrykeForce',
    'https://facebook.com/2767strykeforce',
    'https://github.com/strykeforce',
    'https://instagram.com/2767strykeforce',
  ],
  url: URL,
}

export const SEOOrganization: React.SFC<{}> = () => (
  <Helmet>
    <script type="application/ld+json">{JSON.stringify(ORGANIZATION)}</script>
  </Helmet>
)
