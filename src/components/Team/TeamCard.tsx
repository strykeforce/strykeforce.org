import React from 'react';
import Img from 'gatsby-image';
import styled from 'react-emotion';
import { CardWrapper } from '../CardGallery/CardWrapper';
import { TeamQuote } from './TeamQuote';
import { TeamSchool } from './TeamSchool';

const Wrapper = styled.div`
  background: white;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  width: 16em;
  height: 24em;
`;

const Description = styled.div`
  padding: 0 1em;
`;

const Head = styled.h2`
  margin-top: 0.25em;
  margin-bottom: 0.25em;
`;

export const TeamCard: React.FC<{ member: TeamMember }> = ({ member }) => (
  <CardWrapper>
    <Wrapper>
      <Img fixed={member.photo.childImageSharp.fixed} />
      <Description>
        <Head>{member.displayName}</Head>
        <TeamSchool grade={member.grade ? member.grade : 0} school={member.school ? member.school : 'Unknown'} />
        <TeamQuote quote={member.quote} />
      </Description>
    </Wrapper>
  </CardWrapper>
);
