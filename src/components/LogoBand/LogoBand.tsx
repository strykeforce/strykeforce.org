import { Link } from 'gatsby'
import * as React from 'react'
import styled, { css } from 'react-emotion'
import frc2767 from './frc2767.svg'
import ftc15106 from './ftc15106.svg'
import ftc7228 from './ftc7228.svg'
import ftc8553 from './ftc8553.svg'

const Wrapper = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: space-around;
  max-width: 40rem;
  margin: auto;
`

const Team = styled.div`
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
`

const TeamLabel = styled.h2`
  font-weight: 400;
  margin-bottom: 0.5em;
`

const Logo = styled.img`
  border-style: solid;
  border-width: 3px;
  border-color: #292929;
  border-radius: 50%;
  width: 7.5em;
  height: 7.5em;
`

export const LogoBand: React.SFC<{}> = () => (
  <Wrapper>
    <Team
    // className={css`
    //   flex-basis: 100%;
    // `}
    >
      <TeamLabel>FRC 2767</TeamLabel>
      <Link to="/about/history/">
        <Logo src={frc2767} />
      </Link>
    </Team>
    <Team>
      <TeamLabel>FTC 7228</TeamLabel>
      <Link to="/about/ftc/">
        <Logo src={ftc7228} />
      </Link>
    </Team>
    <Team>
      <TeamLabel>FTC 8553</TeamLabel>
      <Link to="/about/ftc/">
        <Logo src={ftc8553} />
      </Link>
    </Team>
    <Team>
      <TeamLabel>FTC 15106</TeamLabel>
      <Link to="/about/ftc/">
        <Logo src={ftc15106} />
      </Link>
    </Team>
  </Wrapper>
)
