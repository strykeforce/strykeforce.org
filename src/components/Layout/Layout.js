import React from 'react'
import Helmet from 'react-helmet'
import { injectGlobal } from 'styled-components'

import Header from '../Header/Header'
import Footer from '../Footer/Footer'

/* eslint no-unused-expressions: "off" */
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

a:hover {
  text-decoration: underline;
}
`

const description =
  'This is the Stryke Force Web Site. Stryke Force is ' +
  'a community FIRST robotics team based in Kalamazoo, ' +
  'Michigan. We are FRC 2767, FTC 7228 and FTC  8553.'

const Layout = ({ children }) => (
  <div>
    <Helmet
      title="Stryke Force"
      meta={[
        {
          name: 'description',
          content: description,
        },
        { name: 'keywords', content: 'FRC, robots' },
      ]}
    />
    <Header />
    {children}
    <Footer />
  </div>
)

export default Layout
