import React from 'react'
import styled from 'styled-components'

import Wrapper from '../Layout/Wrapper'
import Rule from './FooterRule'
import FooterSocial from './FooterSocial'

import logo from './2767.svg'

const Logo = styled.img`
  height: 4rem;
`

const CenteredWrapper = Wrapper.extend`
  text-align: center;
`

const Footer = () => (
  <CenteredWrapper>
    <Rule />
    <Logo src={logo} alt="2767" />
    <FooterSocial />
    <p>
      <small>Stryke Force © 2018</small>
    </p>
  </CenteredWrapper>
)

export default Footer
