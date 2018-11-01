import React from 'react'
import styled from 'react-emotion'
import { PostByline } from './PostByline'

const Div = styled.div`
  margin: auto;
`

const Header = styled.h1`
  margin-bottom: 0;
`

export const Post: React.SFC<PostDetail> = ({ frontmatter, html }) => (
  <Div>
    <Header>{frontmatter.title}</Header>
    <PostByline date={frontmatter.date} author={frontmatter.author} />
    <div dangerouslySetInnerHTML={{ __html: html }} />
  </Div>
)
