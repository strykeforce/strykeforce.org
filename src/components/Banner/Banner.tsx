import React from 'react';
import styled from 'react-emotion';
import heroDesktop from './hero_image.jpg';
import heroMobile from './hero_image@0,5x.jpg';

const Div = styled.div`
  flex: 1 100%;
  height: 40vh;
  background-image: url(${heroDesktop});
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;

  @media (max-width: 414px) {
    background-image: url(${heroMobile});
  }
`;

export const Banner: React.FC<{}> = () => <Div />;
