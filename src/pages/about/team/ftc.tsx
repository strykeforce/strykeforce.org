import React from 'react';
import { graphql } from 'gatsby';
import Helmet from 'react-helmet';
import { Layout } from '../../../components/Layout/Layout';
import { TeamGallery } from '../../../components/Team/TeamGallery';

interface StudentsPageProps {
  location: { pathname: string };
  data: { allFtcToml: { edges: { node: { students: TeamMember[] } }[] } };
}

const FtcStudentsPage: React.FC<StudentsPageProps> = ({ location: { pathname }, data }) => {
  const students = data.allFtcToml.edges[0].node.students;
  return (
    <Layout path={pathname}>
      <Helmet title="Students">
        <meta name="description" content="Photographs and quotes from the Stryke Force students." />
      </Helmet>

      <h1>Stryke Force FTC Students</h1>
      <TeamGallery members={students} />
    </Layout>
  );
};

export default FtcStudentsPage;

export const studentsQuery = graphql`
  query FtcStudentsQuery {
    allFtcToml {
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
