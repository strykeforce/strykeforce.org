import { graphql } from 'gatsby';
import React from 'react';
import Helmet from 'react-helmet';
import { Layout } from '../../components/Layout/Layout';
import { TeamGallery } from '../../components/Team/TeamGallery';

// prettier-ignore
interface StudentsPageProps {
  location: {
    pathname: string;
  }; // tslint:disable-line:semicolon
  data: {
    allTeamToml: {
      edges: {
        node: {
          students: TeamMember[];
        };
      }[];
    };
  };
}

const StudentsPage: React.SFC<StudentsPageProps> = ({ location: { pathname }, data }) => {
  const students = data.allTeamToml.edges[0].node.students;
  return (
    <Layout path={pathname}>
      <Helmet title="Students">
        <meta name="description" content="Photographs and quotes from the Stryke Force students." />
      </Helmet>

      <h1>Stryke Force Students</h1>
      <TeamGallery members={students} />
    </Layout>
  );
};

export default StudentsPage;

export const studentsQuery = graphql`
  query StudentsQuery {
    allTeamToml {
      edges {
        node {
          students {
            id
            name
            displayName
            grade
            school
            quote
            photo {
              childImageSharp {
                fixed(width: 256, height: 192, quality: 80) {
                  ...GatsbyImageSharpFixed
                }
              }
            }
          }
        }
      }
    }
  }
`;
