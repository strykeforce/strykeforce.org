import React from 'react'
import styled from 'react-emotion'
import { CardGallery } from '../CardGallery/CardGallery'
import { PartnerCard } from './PartnerCard'

interface PartnerGalleryProps {
  level: SponsorLevel
}

const Gallery = styled.div`
  text-align: center;
`

export const PartnerGallery = ({ level }: PartnerGalleryProps) => (
  <Gallery>
    <h1>{level.name}</h1>
    <CardGallery>
      {level.sponsors.map(s => (
        <PartnerCard item={s} key={s.logo.childImageSharp.id} />
      ))}
    </CardGallery>
  </Gallery>
)
