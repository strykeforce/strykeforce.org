import React from 'react';
import styled from 'react-emotion';

import { HeaderLogo } from './HeaderLogo';
import { HeaderNav } from './HeaderNav';
import { HeaderProps } from './HeaderProps';

const Background = styled.div`
  background-color: rgb(241, 186, 27);
`;

const Navigation = styled.div`
  display: flex;
  align-items: top;
  justify-content: space-between;
`;

const Header: React.FC<HeaderProps> = ({ path }) => (
  <Background>
    <Navigation>
      <HeaderLogo />
      <HeaderNav path={path} />
    </Navigation>
  </Background>
);

export default Header;
