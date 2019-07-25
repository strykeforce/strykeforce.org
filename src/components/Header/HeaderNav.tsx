import { Link } from 'gatsby'
import React from 'react'
import styled, { css } from 'react-emotion'
import bars from './bars.svg'
import { DonateButton } from './DonateButton'
import { HeaderProps } from './HeaderProps'

interface ItemLinkProps {
  menu: string
  path: string
}

const Nav = styled.nav`
  .navWide {
    display: none;
    padding-top: 1em;
  }

  .navNarrow {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    padding-top: 1em;
    padding-right: 1em;
  }

  @media (min-width: 480px) {
    .navWide {
      display: block;
    }
    .navNarrow {
      display: none;
    }
  }
`

const Burger = styled.img`
  height: 2em;
`

const wide = css`
  display: flex;
  flex-flow: row nowrap;
  padding: 0;
  margin: 0;

  & > li {
    list-style: none;
    padding-top: 0.5em;
    padding-right: 1em;
  }
`

const narrow = css`
  display: none;
  flex-flow: column nowrap;
  align-items: flex-end;
  padding: 0;
  margin: 0;

  & > li {
    list-style: none;
    padding-top: 0.5em;
  }
`

const ItemLink = styled(Link)`
  text-decoration: none !important;
  font-weight: bold;
  font-size: 120%;
  color: ${({ path, menu }: ItemLinkProps) =>
    path.startsWith(menu, 1) ? '#fff' : '#333'};
`

const toggleBurger = () => {
  const linksEl = document.querySelector(`.${narrow}`) as HTMLElement
  linksEl.style.display =
    linksEl.style.display === 'flex'
      ? (linksEl.style.display = 'none')
      : (linksEl.style.display = 'flex')
}

export const HeaderNav: React.SFC<HeaderProps> = ({ path }) => (
  <Nav>
    <div className="navWide">
      <ul className={wide}>
        <li>
          <ItemLink to="/about/" menu="about" path={path}>
            About
          </ItemLink>
        </li>
        <li>
          <ItemLink to="/blog/" menu="blog" path={path}>
            Blog
          </ItemLink>
        </li>
        <li>
          <ItemLink to="/resources/" menu="resources" path={path}>
            Resources
          </ItemLink>
        </li>
        <li>
          <ItemLink to="/contact/" menu="contact" path={path}>
            Contact
          </ItemLink>
        </li>
        <li>
          <DonateButton />
        </li>
      </ul>
    </div>
    <div className="navNarrow">
      <Burger src={bars} alt="Menu" onClick={toggleBurger} />
      <ul className={narrow}>
        <li>
          <ItemLink
            to="/about/"
            menu="about"
            path={path}
            onClick={toggleBurger}
          >
            About
          </ItemLink>
        </li>
        <li>
          <ItemLink to="/blog/" menu="blog" path={path} onClick={toggleBurger}>
            Blog
          </ItemLink>
        </li>
        <li>
          <ItemLink
            to="/resources/"
            menu="resources"
            path={path}
            onClick={toggleBurger}
          >
            Resources
          </ItemLink>
        </li>
        <li>
          <ItemLink
            to="/contact/"
            menu="contact"
            path={path}
            onClick={toggleBurger}
          >
            Contact
          </ItemLink>
        </li>
        <li>
          <DonateButton />
        </li>
      </ul>
    </div>
  </Nav>
)
