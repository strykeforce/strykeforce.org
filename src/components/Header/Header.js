import React from 'react'
import styled from 'styled-components'

import Wrapper from '../Layout/Wrapper'
import HeaderLogo from './HeaderLogo'
import HeaderNav from './HeaderNav'

const Background = styled.div`
  background-color: rgb(241, 186, 27);
`

const Navigation = Wrapper.extend`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const Header = () => (
  <Background>
    <Navigation>
      <HeaderLogo />
      <HeaderNav />
    </Navigation>
  </Background>
)

export default Header
