import React from 'react';
import styled from '@emotion/styled';

const Date = styled.p`
  color: #666;
  margin-top: 0;
`;

export const PostByline: React.FC<{ date: string; author: string }> = ({ date, author }) =>
  author !== null ? (
    <Date>
      <small>
        Posted on {date} by {author}
      </small>
    </Date>
  ) : null;
