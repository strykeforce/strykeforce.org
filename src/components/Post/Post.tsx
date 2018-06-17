import React from 'react'
import styled from 'react-emotion'

const Div = styled.div`
  max-width: 40em;
  margin: auto;
`

const Date = styled.h2`
  color: #aaa;
  font-size: 1em;
  font-weight: normal;
  margin-top: -0.75em;
`

export const Post: React.SFC<PostDetail> = ({ frontmatter, html }) => (
  <Div>
    <h1>{frontmatter.title}</h1>
    <Date>{frontmatter.date}</Date>
    <div dangerouslySetInnerHTML={{ __html: html }} />
  </Div>
)
