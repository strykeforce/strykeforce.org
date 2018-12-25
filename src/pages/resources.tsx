import { css } from 'emotion'
import { graphql } from 'gatsby'
import * as path from 'path'
import React from 'react'
import Helmet from 'react-helmet'
import { Layout } from '../components/Layout/Layout'
import { PostIndex, PostIndexDiv } from '../components/Post/PostIndex'
import { Post, Title } from '../components/Post/PostLink'

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
              <a href="/resources/Mechanical_Design_Description_of_Stryke_Force_Swerve_Drive_Units.pdf">
                Third Coast Swerve Drive Design
              </a>{' '}
              - history and mechanical design description.
            </li>
            <li>
              <a href="https://github.com/strykeforce/thirdcoast">
                Third Coast Swerve Drive Software
              </a>{' '}
              - swerve drive and telemetry Java libraries for FRC robots.
            </li>
            <li>
              <a href="https://github.com/strykeforce/thirdcoast-examples">
                Software Examples
              </a>{' '}
              - swerve drive and telemetry library usage.
            </li>
          </ul>
          <h2>Stryke Force Talon SRX Motor Training Course</h2>
          <p>
            This training course was presented to regional FRC teams by Stryke
            Force in December 2017. The software tools used in this training can
            be downloaded from the{' '}
            <a href="#other-resources"> Other Resources</a> section below.
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
              <a href="https://youtu.be/JnOEE89VDo4">Chapter Six</a> (55:02)
            </li>
            <li>
              <a href="https://youtu.be/F5yFHDHxEVw">Chapter Seven</a> (38:59)
            </li>
            <li>
              <a href="https://youtu.be/Fs46TUeJMyc">Chapter Eight</a> (56:37)
            </li>
            <li>
              <a href="https://youtu.be/D0inPk1Bz7c">Chapter Nine</a> (38:00)
            </li>
          </ul>

          <h2 id="other-resources">Other Resources</h2>
          <ul>
            <li>
              <a href="https://github.com/strykeforce/thirdcoast-tct">
                Third Coast Telemetry Utility
              </a>{' '}
              - command-line utility that find useful for tuning motor
              closed-loop performance and manually controlling robot axes during
              development.
            </li>
            <li>
              <a href="https://github.com/strykeforce/grapher">
                Third Coast Grapher
              </a>{' '}
              - graphical strip-chart recorder that plots live telemetry
              information from a robot.
            </li>
          </ul>
        </Post>
      </PostIndexDiv>
    </Layout>
  )
}

export default ResourceIndexPage
