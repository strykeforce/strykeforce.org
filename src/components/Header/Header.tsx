import * as React from 'react'
import styled from 'react-emotion'

import { HeaderLogo } from './HeaderLogo'
import { HeaderNav } from './HeaderNav'
import { HeaderProps } from './HeaderProps'

const Background = styled.div`
  background-color: rgb(241, 186, 27);
`

const Navigation = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const Header = ({ path }: HeaderProps) => (
  <Background>
    <Navigation>
      <HeaderLogo />
      <HeaderNav path={path} />
    </Navigation>
  </Background>
)

export default Header
