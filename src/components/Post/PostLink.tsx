import Img from 'gatsby-image'
import React from 'react'
import styled from 'react-emotion'
import { PostMoreButton } from './PostMoreButton'

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

export const PostLink: React.SFC<{ post: PostExcerpt }> = ({ post }) => (
  <Post>
    <Title>{post.frontmatter.title}</Title>
    <Date>
      <small>{post.frontmatter.date}</small>
    </Date>
    {post.frontmatter.image && (
      <Img fluid={post.frontmatter.image.childImageSharp.fluid} />
    )}
    <p>{post.excerpt}</p>
    <PostMoreButton to={post.frontmatter.path} />
  </Post>
)
