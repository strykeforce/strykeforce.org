import React from 'react';
import styled from 'react-emotion';
import { PostLink } from './PostLink';

export const PostIndexDiv = styled.div`
  max-width: 40rem;
  margin-left: auto;
`;

export const PostIndex: React.SFC<{ posts: PostExcerptNode[] }> = ({ posts }) => {
  const Posts = posts.map((post: PostExcerptNode) => <PostLink key={post.node.id} post={post.node} />);

  return <PostIndexDiv>{Posts}</PostIndexDiv>;
};
