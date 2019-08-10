import React from 'react';
import styled from 'react-emotion';
import { CardWrapper } from '../CardGallery/CardWrapper';

const PartnerDiv = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4em;
  width: auto;

  @media (max-width: 480px) {
    flex-flow: column;
    width: auto;
  }
`;

const Logo = styled.img`
  max-width: 100%;
  height: auto;
`;

const Blurb = styled.p`
  text-align: left;
  padding-left: 2em;
  max-width: 50%;

  @media (max-width: 480px) {
    padding-left: 0;
    max-width: 100%;
  }
`;

export const PartnerCard: React.FC<{ item: Partner }> = ({ item }) => (
  <CardWrapper>
    <PartnerDiv>
      <a href={item.url} target="_blank" rel="noopener noreferrer">
        <Logo src={item.logo.childImageSharp.original.src} />
      </a>
      <Blurb>{item.text}</Blurb>
    </PartnerDiv>
  </CardWrapper>
);
