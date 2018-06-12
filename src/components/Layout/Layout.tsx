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
`

const description = `This is the Stryke Force Web Site. Stryke Force is 
  a community FIRST robotics team based in Kalamazoo,
  Michigan. We are FRC 2767, FTC 7228 and FTC  8553.`

export const Layout = ({ children, path }: LayoutProps) => (
  <div>
    <Helmet
      defaultTitle="Stryke Force"
      titleTemplate="%s | Stryke Force"
      meta={[
        {
          content: description,
          name: 'description',
        },
        { name: 'keywords', content: 'FRC, robots' },
      ]}
    />
    <SEOOrganization />
    <Header path={path} />
    {children}
    <Footer />
  </div>
)
