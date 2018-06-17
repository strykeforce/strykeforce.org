import React from 'react'
import styled from 'react-emotion'
import { Banner } from '../components/Banner/Banner'
import { Layout } from '../components/Layout/Layout'
import { Wrapper } from '../components/Layout/Wrapper'
import { LogoBand } from '../components/LogoBand/LogoBand'
import { PostIndex } from '../components/Post/PostIndex'
import { SEOWebSite } from '../components/SEO/SEOWebSite'

// prettier-ignore
interface IndexPageProps {
  location: { pathname: string }; // tslint:disable-line:semicolon
  data: {
    allMarkdownRemark: {
      edges: PostExcerptNode[];
    }
  }
}

const Blurb = styled.div`
  font-size: 1.5em;
  font-weight: 400;
  max-width: 40rem;
  margin: auto;
  padding-top: 2em;
`

const NewsHeading = styled.h1`
  max-width: 40rem;
  margin-left: auto;
  margin-right: auto;
  margin-top: 1.2em;
`

const IndexPage: React.SFC<IndexPageProps> = ({
  location: { pathname },
  data: {
    allMarkdownRemark: { edges },
  },
}) => {
  return (
    <Layout path={pathname}>
      <Banner />
      <Wrapper>
        <Blurb>
          Stryke Force is a community <i>FIRST</i> robotics team based in
          Kalamazoo, Michigan. We are FRC 2767, FTC 7228 and FTC 8553.
        </Blurb>
        <LogoBand />
        <NewsHeading>Team News</NewsHeading>
        <PostIndex posts={edges.filter(post => !!post.node.frontmatter.date)} />
      </Wrapper>
      <SEOWebSite />
    </Layout>
  )
}

export default IndexPage

export const indexPageQuery = graphql`
  query IndexQuery {
    allMarkdownRemark(
      filter: { fileAbsolutePath: { glob: "**/content/blog/**" } }
      sort: { order: DESC, fields: [frontmatter___date] }
    ) {
      edges {
        node {
          id
          excerpt(pruneLength: 250)
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            path
            title
          }
        }
      }
    }
  }
`
