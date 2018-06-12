import React from 'react'
import styled from 'react-emotion'

interface TeamQuoteProps {
  quote?: string
}

const Quote = styled.p`
  height: 6em;
  font-style: italic;
  color: gray;
  overflow: hidden;
`

export const TeamQuote = ({ quote }: TeamQuoteProps) => <Quote>{quote}</Quote>
