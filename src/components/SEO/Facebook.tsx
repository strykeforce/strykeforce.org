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
          name: 'og:url',
        },
        {
          content: 'article',
          name: 'og:type',
        },
        {
          content: `${BASE}${src}`,
          name: 'og:image',
        },
        {
          content: frontmatter.title,
          name: 'og:title',
        },
        {
          content: frontmatter.description,
          name: 'og:description',
        },
      ]}
    />
  )
}
