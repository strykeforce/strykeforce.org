import React from 'react'

import { PostLink } from './PostLink'

interface PostIndexProps {
  posts: PostExcerptNode[]
}

export const PostIndex = ({ posts }: PostIndexProps) => {
  const Posts = posts.map((post: PostExcerptNode) => (
    <PostLink key={post.node.id} post={post.node} />
  ))

  return <div>{Posts}</div>
}
