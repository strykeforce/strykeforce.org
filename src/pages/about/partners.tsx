import { graphql, Link } from 'gatsby'
import React from 'react'
import Helmet from 'react-helmet'
import { Layout } from '../../components/Layout/Layout'
import { Wrapper } from '../../components/Layout/Wrapper'
import { PartnerGallery } from '../../components/Partner/PartnerGallery'

// prettier-ignore
interface PartnerPageProps {
  location: {
    pathname: string;
  }; // tslint:disable-line:semicolon
  data: {
    partnersToml: {
      title: string;
      description: string;
      platinum: SponsorLevel;
      gold: SponsorLevel;
      silver: SponsorLevel;
      bronze: SponsorLevel;
    }
  }
}

const PartnerPage: React.SFC<PartnerPageProps> = ({
  location: { pathname },
  data,
}) => {
  const toml = data.partnersToml
  return (
    <Layout path={pathname}>
      <Helmet title="Partners" />
      <Wrapper padding="2em">
        <h1>{toml.title}</h1>
        <p>{toml.description}</p>

        <PartnerGallery level={toml.platinum} />
        <PartnerGallery level={toml.gold} />
        <PartnerGallery level={toml.silver} />
        <PartnerGallery level={toml.bronze} />

        <Link to="/">Home</Link>
      </Wrapper>
    </Layout>
  )
}

export default PartnerPage

export const partnerQuery = graphql`
  query PartnerQuery {
    partnersToml {
      title
      description
      platinum {
        name
        width
        height
        sponsors {
          name
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
      gold {
        name
        width
        height
        sponsors {
          name
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
      silver {
        name
        width
        height
        sponsors {
          name
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
      bronze {
        name
        width
        height
        sponsors {
          name
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
`
