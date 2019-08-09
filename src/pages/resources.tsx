import { css } from 'emotion';
import { graphql, Link } from 'gatsby';
import * as path from 'path';
import React from 'react';
import Helmet from 'react-helmet';
import { Layout } from '../components/Layout/Layout';
import { PostIndex, PostIndexDiv } from '../components/Post/PostIndex';
import { Post, Title } from '../components/Post/PostLink';
import { Facebook } from '../components/SEO/Facebook';
import { Twitter } from '../components/SEO/Twitter';

// prettier-ignore
interface ResourcesIndexPageProps {
  location: { pathname: string }; // tslint:disable-line:semicolon
}

const postDetail: PostDetail = {
  frontmatter: {
    author: 'Jeff Hutchison',
    date: '2018-12-26T13:56:12Z',
    description:
      'Our students and mentors both leverage and provide technology, tools and training focused on building great robots.',
    image: {
      childImageSharp: {
        original: {
          height: 630,
          src: '/resources/connector.png',
          width: 1200,
        },
      },
    },
    path: '/resources/',
    title: 'Stryke Force Resources',
  },
  html: '',
};

const ResourceIndexPage: React.SFC<ResourcesIndexPageProps> = ({ location: { pathname } }) => {
  return (
    <Layout path={pathname}>
      <Helmet title="Resources">
        <meta name="description" content={postDetail.frontmatter.description} />
      </Helmet>

      <PostIndexDiv>
        <h1>{postDetail.frontmatter.title}</h1>
        <Post>
          <p>
            Stryke Force is committed to the FIRST Robotics community. Our students and mentors both leverage and
            provide technology, tools and training focused on building great robots. This page is the definitive list of
            our contributions in one place.
          </p>

          <h2 id="mechanical">Mechanical and Electrical</h2>
          <ul>
            <li>
              <a href="/resources/Mechanical_Design_Description_of_Stryke_Force_Swerve_Drive_Units.pdf">
                Third Coast Swerve Drive Design
              </a>{' '}
              - history and mechanical design description of our swerve drive modules.{' '}
              <strong>Updated for 2019 season.</strong>
            </li>
            <li>
              <a href="https://grabcad.com/cory.walters-1">Swerve Drive CAD Files</a> - 2017-2018 swerve drive hosted on
              GrabCAD.
            </li>
            <li>
              <a href="http://wmralliance.com/sentinal/">Sentinal Interface Board for Talon SRX</a> - connect digital
              and analog signal inputs to the Talon SRX speed controller. A collaboration with Team 141 WOBOT.
            </li>
          </ul>
          <h2 id="software">Software and Development Tools</h2>
          <ul>
            <li>
              <a href="https://github.com/strykeforce/thirdcoast">Third Coast Swerve Drive Software</a> - swerve drive
              and telemetry Java libraries for FRC robots.
            </li>
            <li>
              <a href="https://github.com/strykeforce/thirdcoast-tct">Telemetry Utility</a> - <strong>tct</strong>, a
              command-line utility useful for tuning motor closed-loop performance and manually controlling robot axes
              during development.
            </li>
            <li>
              <a href="https://github.com/strykeforce/grapher">Grapher</a> - LabView strip-chart recorder that plots
              real-time streaming telemetry information from a robot.
            </li>
            <li>
              <a href="https://github.com/strykeforce/thirdcoast-examples">Software Examples</a> - Third Coast swerve
              drive and telemetry library usage.
            </li>
            <li>
              <a href="https://github.com/strykeforce/cookiecutter-robot">FRC Robot Cookiecutter Template</a> - a
              command-line utility that creates a Java or Kotlin robot project from a template. Optionally include
              pre-configured swerve drive, telemetry and/or logging.
            </li>
          </ul>
          <h2>Stryke Force Talon SRX Motor Training Course</h2>
          <p>
            This training course was presented to regional FRC teams by Stryke Force in December 2017. The tct and
            grapher software tools used in this training can be downloaded from the{' '}
            <a href="#software">software and tools section</a> above.
          </p>

          <h3>Course Materials</h3>
          <ul>
            <li>
              <a href="/resources/talon_course/overview.pdf">Overview</a>
            </li>
            <li>
              <a href="/resources/talon_course/chapters.pdf">Video Chapter Guide</a>
            </li>
            <li>
              Presentation (<a href="/resources/talon_course/Talon_SRX_Motor_Training_Course_2017.pdf">pdf</a>) (
              <a href="/resources/talon_course/Talon_SRX_Motor_Training_Course_2017.pptx">pptx</a>)
            </li>
          </ul>

          <h3>Course Videos</h3>
          <ul>
            <li>
              <a href="https://youtu.be/VqUPmyUUkEs">Chapter One, Motors</a> (46:03)
            </li>
            <li>
              <a href="https://youtu.be/cIZORBcM3vg">Chapter Two, Talon SRX</a> (52:35)
            </li>
            <li>
              <a href="https://youtu.be/llPmrsI5zgg">Chapter Three, Talon Encoders and Sensors</a> (16:34)
            </li>
            <li>
              <a href="https://youtu.be/-6Q67sX9rA0">Chapter Four, Control Loops</a> (47:47)
            </li>
            <li>
              <a href="https://youtu.be/bZLMnFtyiIw">Chapter Five, Live Tuning Examples part 1</a> (53:13)
            </li>
            <li>
              <a href="https://youtu.be/JnOEE89VDo4">Chapter Six, Live Tuning Examples part 2</a> (55:02)
            </li>
            <li>
              <a href="https://youtu.be/F5yFHDHxEVw">Chapter Seven, Live Tuning Examples part 3</a> (38:59)
            </li>
            <li>
              <a href="https://youtu.be/Fs46TUeJMyc">Chapter Eight, Live Tuning Examples part 4</a> (56:37)
            </li>
            <li>
              <a href="https://youtu.be/D0inPk1Bz7c">Chapter Nine, Quick Start Tuning Guide and Q&amp;A</a> (38:00)
            </li>
          </ul>

          <h2 id="other-resources">Other Resources</h2>
          <ul>
            <li>
              <a href="/resources/Connector_Tests.pdf">Connector High Current Tests</a> - We have tested the current
              carrying capability of some popular connectors used in FRC.
            </li>
            <li>
              <Link to="/resources/practice-field-network/">FRC Practice Field Networking</Link> - We have installed
              OpenWRT on the Open Mesh OM5P-AN used on our robots to allow us to connect to our robot via shop WiFi.
            </li>
          </ul>
        </Post>
      </PostIndexDiv>
      <Twitter {...postDetail} />
      <Facebook {...postDetail} />
    </Layout>
  );
};

export default ResourceIndexPage;
