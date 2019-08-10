import React from 'react';
import styled from '@emotion/styled';
import { PartnerCard } from './PartnerCard';

const Gallery = styled.div`
  text-align: center;
`;

const PartnersGalleryUl = styled.ul`
  display: flex;
  flex-flow: row wrap;
  justify-content: space-around;
  align-items: center;
  padding: 0;
  margin: 0;
`;

export const PartnerGallery: React.FC<{ partners: { node: Partner }[] }> = ({ partners }) => (
  <Gallery>
    <PartnersGalleryUl>
      {partners.map(p => (
        <PartnerCard item={p.node} key={p.node.logo.childImageSharp.id} />
      ))}
    </PartnersGalleryUl>
  </Gallery>
);
