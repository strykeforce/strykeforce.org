import React from 'react'
import styled from 'styled-components'

import hero from './hero_image.jpg'

const Div = styled.div`
  flex: 1 100%;
  height: 40vh;
  background-image: url(${hero});
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
`

const Banner = () => <Div />

export default Banner
