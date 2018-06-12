import React from 'react'

import button from './donate.svg'

export const PayPalButton = () => (
  <form
    action="https://www.paypal.com/cgi-bin/webscr"
    method="post"
    target="_top"
  >
    <input type="hidden" name="cmd" value="_s-xclick" />
    <input
      type="hidden"
      name="encrypted"
      value="-----BEGIN PKCS7-----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-----END PKCS7-----
"
    />
    <input
      type="image"
      src={button}
      name="submit"
      alt="PayPal - The safer, easier way to pay online!"
    />
    <img
      alt=""
      src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif"
      width="1"
      height="1"
    />
  </form>
)
