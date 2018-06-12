import React from 'react'

import { PostLink } from './PostLink'

interface PostIndexProps {
  posts: Array<{
    node: PostExcerpt
  }>
}

export const PostIndex = ({ posts }: PostIndexProps) => {
  const Posts = posts.map((post: any) => (
    <PostLink key={post.node.id} post={post.node} />
  ))

  return <div>{Posts}</div>
}
