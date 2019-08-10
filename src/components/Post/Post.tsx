import React from 'react';
import { injectGlobal } from 'emotion';
import styled from 'react-emotion';
import { PostByline } from './PostByline';

injectGlobal`
p > img {
    display: block;
    margin-left: auto;
    margin-right: auto;
}
`;

const Div = styled.div`
  margin: auto;
`;

const Header = styled.h1`
  margin-bottom: 0;
`;

export const Post: React.FC<PostDetail> = ({ frontmatter, html }) => (
  <Div>
    <Header>{frontmatter.title}</Header>
    <PostByline date={frontmatter.date} author={frontmatter.author} />
    <div dangerouslySetInnerHTML={{ __html: html }} />
  </Div>
);
