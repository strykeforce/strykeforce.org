import React from 'react'
import Helmet from 'react-helmet'
import { Layout } from '../components/Layout/Layout'
import { Wrapper } from '../components/Layout/Wrapper'
import { Post } from '../components/Post/Post'

// prettier-ignore
interface BlogTemplateProps {
  location: {
    pathname: string;
  }; // tslint:disable-line:semicolon
  data: {
    post: PostDetail;
  }
}

const BlogTemplate = ({
  location: { pathname },
  data: { post },
}: BlogTemplateProps) => (
  <Layout path={pathname}>
    <Helmet title={`${post.frontmatter.title} | Blog`} />
    <Wrapper>
      <Post post={post} />
    </Wrapper>
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
      }
    }
  }
`