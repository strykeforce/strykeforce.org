import { graphql } from 'gatsby'
import React from 'react'
import Helmet from 'react-helmet'
import { Layout } from '../components/Layout/Layout'
import { Post } from '../components/Post/Post'
import { Facebook } from '../components/SEO/Facebook'
import { Twitter } from '../components/SEO/Twitter'

// prettier-ignore
interface BlogTemplateProps {
  location: {
    pathname: string;
  }; // tslint:disable-line:semicolon
  data: {
    post: PostDetail;
  }
}

const BlogTemplate: React.SFC<BlogTemplateProps> = ({
  location: { pathname },
  data: { post },
}) => (
  <Layout path={pathname}>
    <Helmet>
      <title>{`${post.frontmatter.title} | Blog`}</title>
      <meta name="description" content={post.frontmatter.description} />
    </Helmet>
    <Post {...post} />
    <Twitter {...post} />
    <Facebook {...post} />
  </Layout>
)

export default BlogTemplate

export const pageQuery = graphql`
  query BlogPostByPath($path: String!) {
    post: markdownRemark(frontmatter: { path: { eq: $path } }) {
      html
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
        path
        title
        author
        description
        image {
          childImageSharp {
            original {
              src
              width
              height
            }
          }
        }
      }
    }
  }
`
