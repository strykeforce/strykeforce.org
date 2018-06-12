import Link from 'gatsby-link'
import React from 'react'
import styled from 'react-emotion'

import { HeaderProps } from './HeaderProps'
import { PayPalButton } from './PayPalButton'

const List = styled.ul`
  display: flex;
  flex-direction: row;
  width: auto;
  padding: 0;
  margin: 0;

  @media (max-width: 414px) {
    flex-direction: column;
  }
`
const Item = styled.li`
  list-style: none;
  padding: 0 1em;

  @media (max-width: 414px) {
    padding: 0 0 0.618em;
  }
`

interface ItemLinkProps {
  menu: string
  path: string
}

const ItemLink = styled(Link)`
  text-decoration: none !important;
  font-weight: bold;
  font-size: 120%;
  text-transform: capitalize;
  color: ${({ path, menu }: ItemLinkProps) =>
    path.startsWith(menu, 1) ? '#fff' : '#333'};
`

export const HeaderNav = ({ path }: HeaderProps) => (
  <List>
    {['about', 'blog', 'contact'].map(menu => (
      <Item key={menu}>
        <ItemLink to={`/${menu}/`} menu={menu} path={path}>
          {menu}
        </ItemLink>
      </Item>
    ))}
    <Item>
      <PayPalButton />
    </Item>
  </List>
)
