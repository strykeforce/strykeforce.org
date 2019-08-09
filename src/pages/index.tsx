import { graphql } from 'gatsby';
import React from 'react';
import styled from 'react-emotion';

import { Layout } from '../components/Layout/Layout';
import { LogoBand } from '../components/LogoBand/LogoBand';
import { PostIndex } from '../components/Post/PostIndex';
import { SEOWebSite } from '../components/SEO/SEOWebSite';

// prettier-ignore
interface IndexPageProps {
  location: { pathname: string }; // tslint:disable-line:semicolon
  data: {
    allMarkdownRemark: {
      edges: PostExcerptNode[];
    };
  };
}

const Blurb = styled.div`
  font-size: 1.5em;
  font-weight: 400;
  max-width: 40rem;
  margin: auto;
  padding-top: 2em;
`;

const NewsHeading = styled.h1`
  margin-left: auto;
  margin-right: auto;
  margin-top: 1.2em;
`;

const IndexPage: React.SFC<IndexPageProps> = ({
  location: { pathname },
  data: {
    allMarkdownRemark: { edges },
  },
}) => {
  return (
    <Layout path={pathname} banner={true}>
      <Blurb>
        <p>
          Stryke Force 4-H <i>FIRST</i> Robotics Team 2767 is a community robotics team based in Kalamazoo, Michigan. We
          are FRC 2767, FTC 7228, FTC 8553 and FTC 15106.
        </p>
      </Blurb>
      <LogoBand />
      <NewsHeading>Team News</NewsHeading>
      <PostIndex posts={edges.filter(post => !!post.node.frontmatter.date)} />

      <SEOWebSite />
    </Layout>
  );
};

export default IndexPage;

export const indexPageQuery = graphql`
  query IndexQuery {
    allMarkdownRemark(
      limit: 5
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
