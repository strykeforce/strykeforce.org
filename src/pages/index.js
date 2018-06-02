import React from 'react'
import Link from 'gatsby-link'
import Layout from '../components/Layout/Layout'
import Wrapper from '../components/Layout/Wrapper'
import Banner from '../components/Banner/Banner'

const IndexPage = () => (
  <Layout>
    <Banner />
    <Wrapper>
      <h1>Stryke Force</h1>
      <p>Welcome to the new React site!</p>
      <Link to="/about/">About</Link>
    </Wrapper>
  </Layout>
)

export default IndexPage
