import { Link } from 'gatsby'
import React from 'react'
import { Layout } from '../components/Layout/Layout'
import { Wrapper } from '../components/Layout/Wrapper'

interface NotFoundPageProps {
  location: {
    pathname: string
  }
}

const NotFoundPage: React.SFC<NotFoundPageProps> = ({
  location: { pathname },
}) => (
  <Layout path={pathname}>
    <Wrapper padding="2em">
      <h1>Page not found</h1>
      <Link to="/">Home</Link>
    </Wrapper>
  </Layout>
)

export default NotFoundPage
