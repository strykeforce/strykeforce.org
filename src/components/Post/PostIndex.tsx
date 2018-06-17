import React from 'react'

import { PostLink } from './PostLink'

export const PostIndex: React.SFC<{ posts: PostExcerptNode[] }> = ({
  posts,
}) => {
  const Posts = posts.map((post: PostExcerptNode) => (
    <PostLink key={post.node.id} post={post.node} />
  ))

  return <div>{Posts}</div>
}
