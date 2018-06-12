import React from 'react'
import styled from 'react-emotion'

const Div = styled.div`
  max-width: 40em;
  margin: auto;
`

const Date = styled.h2`
  color: #aaa;
  font-size: 1.25em;
  font-weight: normal;
  margin-top: -0.75em;
`

interface PostProps {
  post: PostDetail
}

export const Post = ({ post }: PostProps) => (
  <Div>
    <h1>{post.frontmatter.title}</h1>
    <Date>{post.frontmatter.date}</Date>
    <div dangerouslySetInnerHTML={{ __html: post.html }} />
  </Div>
)
