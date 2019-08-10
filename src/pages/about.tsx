/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { graphql } from 'gatsby';
import * as path from 'path';
import React from 'react';
import Helmet from 'react-helmet';
import { Layout } from '../components/Layout/Layout';
import { PostIndex, PostIndexDiv } from '../components/Post/PostIndex';
import { Post, Title } from '../components/Post/PostLink';
import { PostMoreButton } from '../components/Post/PostMoreButton';

interface AboutIndexPageProps {
  location: { pathname: string };
  data: {
    about: { childMarkdownRemark: { html: string } };
    partners: { childPartnersToml: { description: string } };
    allMarkdownRemark: { edges: PostExcerptNode[] };
  };
}

const AboutIndexPage: React.FC<AboutIndexPageProps> = ({ location: { pathname }, data }): React.ReactElement => {
  const about = data.about.childMarkdownRemark.html;
  const partners = data.partners.childPartnersToml.description;
  const postNodes: PostExcerptNode[] = data.allMarkdownRemark.edges;

  return (
    <Layout path={pathname}>
      <Helmet title="About">
        <meta
          name="description"
          content="Founded in 2009, Stryke Force is a FIRST Robotics Team from Kalamazoo, Michigan. Learn more about our team, students and partners."
        />
      </Helmet>

      <PostIndexDiv>
        <h1>About Stryke Force</h1>
        <Post>
          <div dangerouslySetInnerHTML={{ __html: about }} />
        </Post>
        <Post>
          <Title>Stryke Force Partners</Title>
          <p>{partners}</p>
          <PostMoreButton to="/about/partners/" />
        </Post>
        <Post>
          <Title>Stryke Force FRC Students</Title>
          <p>Meet the FRC team for the 2019 FRC season.</p>
          <PostMoreButton to="/about/students/" />
        </Post>
        <Post>
          <Title>Stryke Force FTC Students</Title>
          <p>Meet the FTC team for the 2018-2019 FTC season.</p>
          <PostMoreButton to="/about/team/ftc/" />
        </Post>
      </PostIndexDiv>
      <PostIndex posts={postNodes.filter(({ node }) => !path.basename(node.fileAbsolutePath).startsWith('_'))} />
      <Post>
        <a href="https://strykeforce.smugmug.com" target="_blank" rel="noopener noreferrer">
          <img
            src="/smugmug.svg"
            alt="SmugMug"
            css={css`
              width: 35%;
              padding-top: 1em;
            `}
          />
        </a>
        <p>Visit Stryke Force on SmugMug to view, download or purchase team photos.</p>
      </Post>
      <Post>
        <a href="https://www.youtube.com/channel/UCf1qXXCYeVqUYSJApcr7RRg" target="_blank" rel="noopener noreferrer">
          <img
            src="/youtube.svg"
            alt="YouTube"
            css={css`
              width: 28%;
              padding-top: 1em;
            `}
          />
        </a>
        <p>Visit Stryke Force on YouTube to view team highlight and training videos.</p>
      </Post>
    </Layout>
  );
};

export default AboutIndexPage;

export const pageQuery = graphql`
  query AboutIndexQuery {
    allMarkdownRemark(
      filter: { fileAbsolutePath: { glob: "**/content/about/**" } }
      sort: { fields: frontmatter___date }
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
`;
