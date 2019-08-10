import React from 'react';
import { graphql } from 'gatsby';
import Helmet from 'react-helmet';
import { Layout } from '../../components/Layout/Layout';
import { PartnerGallery } from '../../components/Partner/PartnerGallery';

interface PartnerPageProps {
  location: { pathname: string };
  data: { allPartnersCsv: { edges: { node: Partner }[] } };
}

const PartnerPage: React.FC<PartnerPageProps> = ({ location: { pathname }, data }) => {
  const partners = data.allPartnersCsv;
  // partners.edges.forEach(edge => console.log(edge.node.name))
  return (
    <Layout path={pathname}>
      <Helmet title="Partners">
        <meta
          name="description"
          content="These organizations provide generous financial support, materials and services to Stryke Force Team 2767, a FIRST Robotics team from Kalamazoo, Michigan."
        />
      </Helmet>

      <h1>Stryke Force Partners</h1>
      <p>
        We are grateful to our Stryke Force partners who have helped us make an impact on our students every year. The
        organizations listed below provide generous financial support, materials and services to make our program
        possible.
      </p>

      <PartnerGallery partners={partners.edges} />
    </Layout>
  );
};

export default PartnerPage;

export const partnerQuery = graphql`
  query PartnersQuery {
    allPartnersCsv {
      edges {
        node {
          name
          text
          url
          logo {
            childImageSharp {
              id
              original {
                src
              }
            }
          }
        }
      }
    }
  }
`;
