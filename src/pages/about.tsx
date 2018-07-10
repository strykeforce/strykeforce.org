import { graphql } from 'gatsby'
import * as path from 'path'
import React from 'react'
import Helmet from 'react-helmet'
import { Layout } from '../components/Layout/Layout'
import { Wrapper } from '../components/Layout/Wrapper'
import { PostIndex } from '../components/Post/PostIndex'
import { Post, Title } from '../components/Post/PostLink'
import { PostMoreButton } from '../components/Post/PostMoreButton'

// prettier-ignore
interface AboutIndexPageProps {
  location: { pathname: string }; // tslint:disable-line:semicolon
  data: any
}

const AboutIndexPage: React.SFC<AboutIndexPageProps> = ({
  location: { pathname },
  data,
}) => {
  const about: string = data.about.childMarkdownRemark.html
  const partners: string = data.partners.childPartnersToml.description
  const posts: any = data.allMarkdownRemark.edges

  return (
    <Layout path={pathname}>
      <Helmet title="About">
        <meta
          name="description"
          content="Founded in 2009, Stryke Force is a FIRST Robotics Team from Kalamazoo, Michigan. Learn more about our team, students and partners."
        />
      </Helmet>

      <Wrapper maxWidth="40em">
        <h1>About Stryke Force</h1>
        <Post>
          <div dangerouslySetInnerHTML={{ __html: about }} />
        </Post>
        <Post>
          <Title>Stryke Force Students</Title>
          <p>Meet the team for the 2019 FRC season.</p>
          <PostMoreButton to="/about/students/" />
        </Post>
        <Post>
          <Title>Stryke Force Partners</Title>
          <p>{partners}</p>
          <PostMoreButton to="/about/partners/" />
        </Post>
        <PostIndex
          posts={posts.filter(
            ({ node }: any) =>
              !path.basename(node.fileAbsolutePath).startsWith('_')
          )}
        />
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
          fileAbsolutePath
          excerpt
          frontmatter {
            title
            date(formatString: "MMMM DD, YYYY")
            path
            description
            author
          }
        }
      }
    }
    about: file(relativePath: { eq: "about/_about.md" }) {
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
