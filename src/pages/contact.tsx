import React from 'react'
import Helmet from 'react-helmet'
import { ContactFormGallery } from '../components/ContactForm/ContactFormGallery'
import { Layout } from '../components/Layout/Layout'
import { Wrapper } from '../components/Layout/Wrapper'

const ContactPage = (props: any) => {
  const pathname: string = props.location.pathname

  return (
    <Layout path={pathname}>
      <Helmet title="Contact Us" />
      <Wrapper>
        <h1>Contact Stryke Force</h1>
        <ContactFormGallery />
      </Wrapper>
    </Layout>
  )
}

export default ContactPage
