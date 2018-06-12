import React from 'react'
import styled from 'react-emotion'
import { PostMoreButton } from './PostMoreButton'

interface PostLinkProps {
  post: PostExcerpt
}

export const Post = styled.article`
  max-width: 40em;
  margin: auto;
`

export const Title = styled.h2`
  margin-bottom: 0;
`

const Date = styled.p`
  color: #666;
  margin-top: 0;
`

export const PostLink = ({ post }: PostLinkProps) => (
  <Post>
    <Title>{post.frontmatter.title}</Title>
    <Date>
      <small>{post.frontmatter.date}</small>
    </Date>
    <p>{post.excerpt}</p>
    <PostMoreButton to={post.frontmatter.path} />
  </Post>
)
