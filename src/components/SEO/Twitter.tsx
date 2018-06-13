import React from 'react'
import Helmet from 'react-helmet'

export const Twitter = ({ frontmatter }: PostDetail) => {
  if (!frontmatter.image) {
    return null
  }
  const src = frontmatter.image.childImageSharp.original.src
  return (
    <Helmet
      meta={[
        {
          content: 'summary_large_image',
          name: 'twitter:card',
        },
        {
          content: '@2767StrykeForce',
          name: 'twitter:site',
        },
        {
          content: `https://www.strykeforce.org${src}`,
          name: 'twitter:image',
        },
        {
          content: frontmatter.title,
          name: 'twitter:title',
        },
      ]}
    />
  )
}
