import React from 'react'
import Helmet from 'react-helmet'
import { Layout } from '../components/Layout/Layout'
import { Wrapper } from '../components/Layout/Wrapper'
import { PostIndex } from '../components/Post/PostIndex'

// prettier-ignore
interface Data {
  allMarkdownRemark: {
    edges: Array<{
      node: PostExcerpt;
    }>;
  }
}

const BlogIndexPage = (props: any) => {
  const pathname: string = props.location.pathname
  const data: Data = props.data
  const posts = data.allMarkdownRemark.edges
  return (
    <Layout path={pathname}>
      <Helmet title="Blog" />
      <Wrapper>
        <PostIndex posts={posts.filter(post => !!post.node.frontmatter.date)} />
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
          }
        }
      }
    }
  }
`
