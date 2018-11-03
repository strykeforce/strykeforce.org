import React from 'react'
import Helmet from 'react-helmet'

const BASE = 'https://www.strykeforce.org'

export const Facebook: React.SFC<PostDetail> = ({ frontmatter }) => {
  if (!frontmatter.image) {
    return null
  }
  const original = frontmatter.image.childImageSharp.original
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
          content: `${BASE}${original.src}`,
          property: 'og:image',
        },
        {
          content: original.width,
          property: 'og:image:width',
        },
        {
          content: original.height,
          property: 'og:image:height',
        },
        {
          content: frontmatter.title,
          property: 'og:title',
        },
        {
          content: frontmatter.description,
          property: 'og:description',
        },
        {
          content: '2158973517669509',
          property: 'fb:app_id',
        },
        {
          content: '@2767strykeforce',
          property: 'article:publisher',
        },
      ]}
    />
  )
}
