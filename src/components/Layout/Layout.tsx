import { injectGlobal } from 'emotion'
import React from 'react'
import Helmet from 'react-helmet'
import Footer from '../Footer/Footer'
import Header from '../Header/Header'
import { SEOOrganization } from '../SEO/SEOOrganization'

interface LayoutProps {
  children?: any
  path: string
}

// tslint:disable-next-line:no-unused-expression
injectGlobal`
body {
  font-family: Roboto, -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica,
    Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
  padding: 0;
  margin: 0;
  position: relative;
  font-size: 1rem;
}

a {
  color: #1b75bb;
  text-decoration: none;
}

a img{
    border: 0px;
}

a:hover {
  text-decoration: underline;
}

.gatsby-resp-image-figcaption {
  font-size: 0.875em;
  color: #666;
  line-height: 1.2em;
  padding-top: 0.25em;
}
`

const description = `Stryke Force 4-H FIRST Robotics Team 2767 is 
  a community robotics team based in Kalamazoo,
  Michigan. We are FRC 2767, FTC 7228 and FTC  8553.`

export const Layout: React.SFC<LayoutProps> = ({ children, path }) => (
  <div>
    <Helmet
      defaultTitle="Stryke Force"
      titleTemplate="%s | Stryke Force"
      meta={[
        {
          content: description,
          name: 'description',
        },
      ]}
    />
    <SEOOrganization />
    <Header path={path} />
    {children}
    <Footer />
  </div>
)
