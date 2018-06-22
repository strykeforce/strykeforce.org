import { graphql } from 'gatsby'
import React from 'react'
import Helmet from 'react-helmet'
import { Layout } from '../components/Layout/Layout'
import { Wrapper } from '../components/Layout/Wrapper'
import { PostIndex } from '../components/Post/PostIndex'

// prettier-ignore
interface BlogIndexPageProps {
  location: { pathname: string }; // tslint:disable-line:semicolon
  data: {
    allMarkdownRemark: {
      edges: PostExcerptNode[];
    }
  }
}

const BlogIndexPage: React.SFC<BlogIndexPageProps> = ({
  location: { pathname },
  data: {
    allMarkdownRemark: { edges },
  },
}) => {
  return (
    <Layout path={pathname}>
      <Helmet title="Blog" />
      <Wrapper>
        <PostIndex posts={edges.filter(post => !!post.node.frontmatter.date)} />
      </Wrapper>
    </Layout>
  )
}

export default BlogIndexPage

export const pageQuery = graphql`
  query BlogIndexQuery {
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
            image {
              childImageSharp {
                fluid(maxWidth: 640) {
                  ...GatsbyImageSharpFluid_noBase64
                }
              }
            }
          }
        }
      }
    }
  }
`
