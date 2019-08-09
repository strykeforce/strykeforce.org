import { Link } from 'gatsby';
import React from 'react';
import styled from 'react-emotion';

const Wrapper = styled.div`
  padding-top: 0.39em;
  padding-bottom: 0.618em;
`;

const Button = styled(Link)`
  display: inline-block;
  background-color: white;
  color: rgb(241, 186, 27);
  padding: 0.39em 0.618em;
  border: 1px solid rgb(241, 186, 27);
  border-radius: 4px;
  text-decoration: none !important;
  cursor: pointer;

  &:hover {
    transform: scale(1.05, 1.05);
  }
`;

export const PostMoreButton: React.SFC<{ to: string }> = ({ to }) => (
  <Wrapper>
    <Button to={to}>Read More</Button>
  </Wrapper>
);
