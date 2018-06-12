import React from 'react'
import { Banner } from '../components/Banner/Banner'
import { Layout } from '../components/Layout/Layout'
import { Wrapper } from '../components/Layout/Wrapper'
import { PostIndex } from '../components/Post/PostIndex'
import { SEOWebSite } from '../components/SEO/SEOWebSite'

// prettier-ignore
interface Data {
  allMarkdownRemark: {
    edges: Array<{
      node: PostExcerpt;
    }>;
  }
}

const IndexPage = (props: any) => {
  const pathname: string = props.location.pathname
  const data: Data = props.data
  const posts = data.allMarkdownRemark.edges

  return (
    <Layout path={pathname}>
      <Banner />
      <Wrapper>
        <PostIndex posts={posts.filter(post => !!post.node.frontmatter.date)} />
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
