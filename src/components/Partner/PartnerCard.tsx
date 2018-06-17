import React from 'react'
import styled from 'react-emotion'
import { CardWrapper } from '../CardGallery/CardWrapper'

const Logo = styled.img`
  width: 100%;
  height: auto;
`

export const PartnerCard: React.SFC<{ item: Sponsor }> = ({ item }) => (
  <CardWrapper>
    <a href={item.url} target="_blank" rel="noopener noreferrer">
      <Logo src={item.logo.childImageSharp.original.src} alt={item.name} />
    </a>
  </CardWrapper>
)
