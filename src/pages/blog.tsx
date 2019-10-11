import { graphql } from 'gatsby';
import React from 'react';
import Helmet from 'react-helmet';
import { Layout } from '../components/Layout/Layout';
import { PostIndex } from '../components/Post/PostIndex';

interface BlogIndexPageProps {
  location: { pathname: string };
  data: {
    allMarkdownRemark: {
      edges: PostExcerptNode[];
    };
  };
}

const BlogIndexPage: React.FC<BlogIndexPageProps> = ({
  location: { pathname },
  data: {
    allMarkdownRemark: { edges },
  },
}): React.ReactElement => {
  return (
    <Layout path={pathname}>
      <Helmet title="Blog">
        <meta
          name="description"
          content="News from Stryke Force Team 2767, a FIRST Robotics Team from Kalamazoo, Michigan."
        />
      </Helmet>
      <h2>
        Sign up for our <a href="http://eepurl.com/bBlRN1">monthly newsletter</a>!
      </h2>
      <PostIndex posts={edges.filter((post): boolean => !!post.node.frontmatter.date)} />
    </Layout>
  );
};

export default BlogIndexPage;

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
            author
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
`;
