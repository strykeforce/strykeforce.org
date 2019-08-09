import { Link } from 'gatsby'
import React from 'react'
import { Layout } from '../components/Layout/Layout'

interface NotFoundPageProps {
  location: {
    pathname: string;
  };
}

const NotFoundPage: React.SFC<NotFoundPageProps> = ({
  location: { pathname },
}) => (
  <Layout path={pathname}>
    <h1>Page not found</h1>
    <Link to="/">Home</Link>
  </Layout>
)

export default NotFoundPage
