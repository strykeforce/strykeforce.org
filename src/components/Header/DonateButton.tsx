import React from 'react';

import button from './donate.svg';

export const DonateButton: React.FC<{}> = () => (
  <a style={{ border: 'none' }} href="donation_form.pdf" download={true}>
    <img src={button} />
  </a>
);
