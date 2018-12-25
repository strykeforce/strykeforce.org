import { css } from 'emotion'
import { graphql } from 'gatsby'
import * as path from 'path'
import React from 'react'
import Helmet from 'react-helmet'
import { Layout } from '../components/Layout/Layout'
import { PostIndex, PostIndexDiv } from '../components/Post/PostIndex'
import { Post, Title } from '../components/Post/PostLink'
import { PostMoreButton } from '../components/Post/PostMoreButton'

// prettier-ignore
interface ResourcesIndexPageProps {
    location: { pathname: string }; // tslint:disable-line:semicolon
}

const ResourceIndexPage: React.SFC<ResourcesIndexPageProps> = ({
  location: { pathname },
}) => {
  return (
    <Layout path={pathname}>
      <Helmet title="Resources">
        <meta
          name="description"
          content="Stryke Force engineering contributions to the FRC community."
        />
      </Helmet>

      <PostIndexDiv>
        <h1>Stryke Force Resources</h1>
        <Post>
          <p>
            Stryke Force is committed to the FIRST Robotics community. Our
            students and mentors both leverage and provide technology, tools and
            training focused on building great robots. This page is the
            definative list of our contributions in one place.
          </p>

          <h2>Third Coast Swerve Drive</h2>
          <ul>
            <li>
              <a href="https://www.chiefdelphi.com/media/papers/download/5089">
                Mechanical Design Description of Stryke Force Swerve Drive Units
              </a>
            </li>
            <li>
              <a href="https://github.com/strykeforce/thirdcoast">
                Third Coast Swerve Drive Software
              </a>
            </li>
            <li>
              <a href="https://github.com/strykeforce/thirdcoast-examples">
                Software Examples
              </a>
            </li>
          </ul>
          <h2>Stryke Force Talon SRX Motor Training Course</h2>
          <p>
            This training course was presented to regional FRC teams by Stryke
            Force in December 2017.
          </p>
          <ul>
            <li>
              <a href="https://youtu.be/VqUPmyUUkEs">Chapter One</a> (46:03)
            </li>
            <li>
              <a href="https://youtu.be/cIZORBcM3vg">Chapter Two</a> (52:35)
            </li>
            <li>
              <a href="https://youtu.be/llPmrsI5zgg">Chapter Three</a> (16:34)
            </li>
            <li>
              <a href="https://youtu.be/-6Q67sX9rA0">Chapter Four</a> (47:47)
            </li>
            <li>
              <a href="https://youtu.be/bZLMnFtyiIw">Chapter Five</a> (53:13)
            </li>
            <li>
              <a href="#">Chapter Six</a> (00:00)
            </li>
            <li>
              <a href="#">Chapter Seven</a> (00:00)
            </li>
            <li>
              <a href="#">Chapter Eight</a> (00:00)
            </li>
            <li>
              <a href="#">Chapter Nin</a> (00:00)
            </li>
          </ul>
          <h2>Tools</h2>
          <ul>
            <li>
              <a href="https://github.com/strykeforce/thirdcoast-tct">
                Third Cost Telemetry Utility
              </a>
            </li>
            <li>
              <a href="https://github.com/strykeforce/grapher">
                Third Cost Grapher
              </a>
            </li>
          </ul>
        </Post>
      </PostIndexDiv>
    </Layout>
  )
}

export default ResourceIndexPage
