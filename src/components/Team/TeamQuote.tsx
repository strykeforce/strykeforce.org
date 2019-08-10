import React from 'react';
import styled from '@emotion/styled';

const Quote = styled.p`
  height: 6em;
  font-style: italic;
  color: gray;
  overflow: hidden;
`;

export const TeamQuote: React.FC<{ quote?: string }> = ({ quote }) => <Quote>{quote}</Quote>;
