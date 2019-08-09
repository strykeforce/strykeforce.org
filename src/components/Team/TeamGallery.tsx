import React from 'react';
import { CardGallery } from '../CardGallery/CardGallery';
import { TeamCard } from './TeamCard';

export const TeamGallery: React.SFC<{ members: TeamMember[] }> = ({ members }) => (
  <CardGallery>
    {members.map(s => (
      <TeamCard key={s.id} member={s} />
    ))}
  </CardGallery>
);
