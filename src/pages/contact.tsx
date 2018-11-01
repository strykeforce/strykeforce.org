import React from 'react'
import Helmet from 'react-helmet'
import { ContactFormGallery } from '../components/ContactForm/ContactFormGallery'
import { Layout } from '../components/Layout/Layout'
import { Wrapper } from '../components/Layout/Wrapper'

interface ContactPageProps {
  location: {
    pathname: string
  }
}

const ContactPage: React.SFC<ContactPageProps> = ({
  location: { pathname },
}) => {
  return (
    <Layout path={pathname}>
      <Helmet title="Contact Us">
        <meta
          name="description"
          content="Contact Stryke Force Team 2767, a FIRST Robotics team from Kalamazoo, Michigan."
        />
      </Helmet>

      <h1>Contact Stryke Force</h1>
      <ContactFormGallery />
    </Layout>
  )
}

export default ContactPage
