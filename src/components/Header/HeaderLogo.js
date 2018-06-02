import React from 'react'
import Link from 'gatsby-link'
import styled from 'styled-components'

import logo from './logo.svg'

const Logo = styled.img`
  padding: 1em 1em 0.39em;
  height: 3rem;
`

const HeaderLogo = () => (
  <Link to="/">
    <Logo src={logo} alt="Stryke Force Logo" />
  </Link>
)

export default HeaderLogo
