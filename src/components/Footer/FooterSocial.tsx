import React from 'react'
import styled from 'react-emotion'

import facebook from './facebook.svg'
import github from './github.svg'
import instagram from './instagram.svg'
import twitter from './twitter.svg'

const data = [
  {
    img: twitter,
    name: 'Twitter',
    url: 'https://twitter.com/2767StrykeForce',
  },
  {
    img: facebook,
    name: 'Facebook',
    url: 'https://facebook.com/2767strykeforce',
  },
  {
    img: instagram,
    name: 'Instagram',
    url: 'https://instagram.com/2767strykeforce',
  },
  {
    img: github,
    name: 'GitHub',
    url: 'https://github.com/strykeforce',
  },
]

const List = styled.ul`
  display: flex;
  height: auto;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 0;
  margin: 0;
`

const Item = styled.li`
  list-style: none;
`

const Icon = styled.img`
  height: 2em;
  padding-left: 1em;
  padding-right: 1em;
`

export const FooterSocial = () => (
  <List>
    {data.map(s => (
      <Item key={s.name}>
        <a href={s.url} target="_blank" rel="noopener noreferrer">
          <Icon src={s.img} alt={s.name} />
        </a>
      </Item>
    ))}
  </List>
)
