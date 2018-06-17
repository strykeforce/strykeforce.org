import React from 'react'
import styled from 'react-emotion'
import { CardGallery } from '../CardGallery/CardGallery'
import { PartnerCard } from './PartnerCard'

const Gallery = styled.div`
  text-align: center;
`

export const PartnerGallery: React.SFC<{ level: SponsorLevel }> = ({
  level,
}) => (
  <Gallery>
    <h1>{level.name}</h1>
    <CardGallery>
      {level.sponsors.map(s => (
        <PartnerCard item={s} key={s.logo.childImageSharp.id} />
      ))}
    </CardGallery>
  </Gallery>
)
