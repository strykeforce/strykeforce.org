import { Link } from 'gatsby'
import React from 'react'
import styled from 'react-emotion'
import logo from './2767.svg'
import { Rule } from './FooterRule'
import { FooterSocial } from './FooterSocial'

const Logo = styled.img`
  height: 4rem;
`

const CenteredWrapper = styled.div`
  text-align: center;
`

const Footer: React.SFC<{}> = () => (
  <CenteredWrapper>
    <Rule />
    <Link to="/">
      <Logo src={logo} alt="2767" />
    </Link>
    <FooterSocial />
    <p>
      <small>Stryke Force © 2018</small>
    </p>
  </CenteredWrapper>
)

export default Footer
