import React from 'react'
import Link from 'gatsby-link'
import styled from 'styled-components'
import media from '../../util/media'

import PayPalButton from './PayPalButton'

const List = styled.ul`
  display: flex;
  flex-direction: row;
  width: auto;
  padding: 0;
  margin: 0;

  ${media.phone`flex-direction: column;`};
`
const Item = styled.li`
  list-style: none;
  padding: 0 1em;

  ${media.phone`padding: 0 0 0.618em`};
`

const ItemLink = styled(Link)`
  text-decoration: none !important;
  font-weight: bold;
  font-size: 120%;
  color: #333;
`

const HeaderNav = () => (
  <List>
    {['About', 'Blog', 'Contact'].map(it => (
      <Item key={it}>
        <ItemLink to={`/${it.toLowerCase()}/`}>{it}</ItemLink>
      </Item>
    ))}
    <Item>
      <PayPalButton />
    </Item>
  </List>
)

export default HeaderNav
