import Link from 'gatsby-link'
import React from 'react'
import { Layout } from '../components/Layout/Layout'
import { Wrapper } from '../components/Layout/Wrapper'

interface PageProps {
  location: {
    pathname: string
  }
}

export default ({ location: { pathname } }: PageProps) => (
  <Layout path={pathname}>
    <Wrapper padding="2em">
      <h1>Page not found</h1>
      <Link to="/">Home</Link>
    </Wrapper>
  </Layout>
)
