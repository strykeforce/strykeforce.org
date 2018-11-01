import Img from 'gatsby-image'
import React from 'react'
import styled from 'react-emotion'
import { PostByline } from './PostByline'
import { PostMoreButton } from './PostMoreButton'

export const Post = styled.article`
  margin: auto;
`

export const Title = styled.h2`
  margin-bottom: 0;
`

export const PostLink: React.SFC<{ post: PostExcerpt }> = ({ post }) => (
  <Post>
    <Title>{post.frontmatter.title}</Title>
    <PostByline date={post.frontmatter.date} author={post.frontmatter.author} />
    {post.frontmatter.image && (
      <Img fluid={post.frontmatter.image.childImageSharp.fluid} />
    )}
    <p>{post.excerpt}</p>
    <PostMoreButton to={post.frontmatter.path} />
  </Post>
)
