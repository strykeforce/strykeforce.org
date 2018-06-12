import React from 'react'
import Helmet from 'react-helmet'
import { Layout } from '../components/Layout/Layout'
import { Wrapper } from '../components/Layout/Wrapper'
import { PostIndex } from '../components/Post/PostIndex'
import { Post, Title } from '../components/Post/PostLink'
import { PostMoreButton } from '../components/Post/PostMoreButton'

const AboutIndexPage = (props: any) => {
  const pathname: string = props.location.pathname
  const about: string = props.data.about.childMarkdownRemark.html
  const partners: string = props.data.partners.childPartnersToml.description
  const posts: any = props.data.allMarkdownRemark.edges

  return (
    <Layout path={pathname}>
      <Helmet title="About" />
      <Wrapper maxWidth="40em">
        <h1>About Stryke Force</h1>
        <Post>
          <div dangerouslySetInnerHTML={{ __html: about }} />
        </Post>
        {/* <Post>
          <Title>Stryke Force Students</Title>
          <p>Meet the team for the 2019 FRC season.</p>
          <PostMoreButton to="/about/students/" />
        </Post> */}
        <Post>
          <Title>Stryke Force Partners</Title>
          <p>{partners}</p>
          <PostMoreButton to="/about/partners/" />
        </Post>
        <PostIndex posts={posts} />
      </Wrapper>
    </Layout>
  )
}

export default AboutIndexPage

export const pageQuery = graphql`
  query AboutIndexQuery {
    allMarkdownRemark(
      filter: { fileAbsolutePath: { glob: "**/content/about/**" } }
    ) {
      edges {
        node {
          id
          excerpt
          frontmatter {
            title
            path
          }
        }
      }
    }
    about: file(relativePath: { eq: "about.md" }) {
      childMarkdownRemark {
        html
      }
    }
    partners: file(relativePath: { eq: "partners.toml" }) {
      childPartnersToml {
        description
      }
    }
  }
`
