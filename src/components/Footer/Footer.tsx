import React from 'react';
import { Link } from 'gatsby';
import styled from '@emotion/styled';
import logo from './2767.svg';
import { Rule } from './FooterRule';
import { FooterSocial } from './FooterSocial';

const Logo = styled.img`
  height: 4rem;
`;

const CenteredWrapper = styled.div`
  text-align: center;
`;

const Footer: React.FC<{}> = () => (
  <CenteredWrapper>
    <Rule />
    <Link to="/">
      <Logo src={logo} alt="2767" />
    </Link>
    <FooterSocial />
    <p>
      <small>Stryke Force © 2018 - 2019</small>
    </p>
  </CenteredWrapper>
);

export default Footer;
