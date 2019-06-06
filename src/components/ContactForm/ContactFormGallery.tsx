import React from 'react'
import { CardGallery } from '../CardGallery/CardGallery'
import { BLUE, ContactFormCard, YELLOW } from './ContactFormCard'

export const ContactFormGallery: React.SFC<{}> = () => (
  <CardGallery css={{ alignItems: 'flex-start' }}>
    <ContactFormCard title="Contact Us" color={BLUE}>
      <input
        type="text"
        name="name"
        placeholder="Your Name"
        autoComplete="name"
        required={true}
      />
      <input
        type="email"
        name="email"
        placeholder="Email Address"
        autoComplete="email"
        required={true}
      />
      <textarea name="message" placeholder="Type your Message" rows={5} />
    </ContactFormCard>

    <ContactFormCard title="New Members" color={YELLOW}>
      <input
        type="text"
        name="student_name"
        placeholder="Student Name"
        required={true}
      />
      <input
        type="email"
        name="student_email"
        placeholder="Student Email Address"
        required={true}
      />
      <input
        type="text"
        name="parent_name"
        placeholder="Parent/Guardian Name"
        required={true}
      />
      <input
        type="email"
        name="parent_email"
        placeholder="Parent/Guardian Email Address"
        required={true}
      />
      <input
        type="text"
        name="grade"
        placeholder="Grade for Fall School Year"
      />
      <input type="text" name="school" placeholder="School" />
      <input
        type="text"
        name="referral"
        placeholder="How did you hear about us?"
      />
      <textarea name="message" placeholder="Optional Message" />
    </ContactFormCard>
  </CardGallery>
)
