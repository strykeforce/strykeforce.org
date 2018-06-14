import React from 'react'
import Helmet from 'react-helmet'

const BASE = 'https://www.strykeforce.org'

export const Facebook = ({ frontmatter }: PostDetail) => {
  if (!frontmatter.image) {
    return null
  }
  const src = frontmatter.image.childImageSharp.original.src
  return (
    <Helmet
      meta={[
        {
          content: `${BASE}${frontmatter.path}`,
          property: 'og:url',
        },
        {
          content: 'article',
          property: 'og:type',
        },
        {
          content: `${BASE}${src}`,
          property: 'og:image',
        },
        {
          content: frontmatter.title,
          property: 'og:title',
        },
        {
          content: frontmatter.description,
          property: 'og:description',
        },
      ]}
    />
  )
}
