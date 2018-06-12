import React from 'react'
import { CardGallery } from '../CardGallery/CardGallery'
import { TeamCard } from './TeamCard'

interface TeamGalleryProps {
  members: TeamMember[]
}

export const TeamGallery = ({ members }: TeamGalleryProps) => (
  <CardGallery>
    {members.map(s => <TeamCard key={s.id} member={s} />)}
  </CardGallery>
)
