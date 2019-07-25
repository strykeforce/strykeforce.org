import React from 'react'

import button from './donate.svg'

export const DonateButton: React.SFC<{}> = () => (
  <a style={{ border: 'none' }} href="donation_form.pdf" download={true}>
    <img src={button} />
  </a>
)
