import Link from 'gatsby-link'
import React from 'react'
import styled from 'react-emotion'

import logo from './logo.svg'

const Logo = styled.img`
  padding: 1em 1em 0.39em;
  height: 3rem;
`

export const HeaderLogo = () => (
  <Link to="/">
    <Logo src={logo} alt="Stryke Force Logo" />
  </Link>
)