import React from 'react';
import { css, injectGlobal } from 'emotion';
import styled from 'react-emotion';
import Helmet from 'react-helmet';
import { Banner } from '../Banner/Banner';
import Footer from '../Footer/Footer';
import Header from '../Header/Header';
import { SEOOrganization } from '../SEO/SEOOrganization';
import SideBar from './SideBar';

interface LayoutProps {
  banner?: boolean;
  path: string;
}

interface ContentProps {
  path: string;
}

injectGlobal`
body {
  font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";
  padding: 0;
  margin: 0;
  position: relative;
  font-size: 1rem;
}

a {
  color: #1b75bb;
  text-decoration: none;
}

a img{
    border: 0px;
}

a:hover {
  text-decoration: underline;
}

.gatsby-resp-image-figcaption {
  font-size: 0.875em;
  color: #666;
  line-height: 1.2em;
  padding-top: 0.25em;
}
`;

const description = `Stryke Force 4-H FIRST Robotics Team 2767 is
  a community robotics team based in Kalamazoo,
  Michigan. We are FRC 2767, FTC 7228 and FTC  8553.`;

const Row = styled.div`
  display: flex;
  flex-wrap: nowrap;
  justify-content: center;

  @media (max-width: 480px) {
    flex-flow: column;
  }
`;

// change order to 1 to have the calendar appear at the top of the home page
const mobileContentDivIndex = css`
  padding-left: 1.5em;

  @media (max-width: 480px) {
    order: 0;
  }
`;
const contentDiv = css`
  padding-left: 1.5em;
`;

const Content: React.FC<ContentProps> = ({ path, children }) => (
  <div className={path === '/' ? mobileContentDivIndex : contentDiv}>{children}</div>
);

export const Layout: React.FC<LayoutProps> = ({ children, banner, path }) => (
  <div>
    <Helmet
      defaultTitle="Stryke Force"
      titleTemplate="%s | Stryke Force"
      meta={[
        {
          content: description,
          name: 'description',
        },
      ]}
    />
    <SEOOrganization />
    <Header path={path} />
    {banner ? <Banner /> : null}
    <Row>
      <Content path={path}>{children}</Content>
      <SideBar />
    </Row>
    <Footer />
  </div>
);
