import React from 'react'
import Helmet from 'react-helmet'

export const Twitter: React.SFC<PostDetail> = ({ frontmatter }) => {
  if (!frontmatter.image) {
    return null
  }
  const original: ImageSharpOriginal =
    frontmatter.image.childImageSharp.original
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
          content: `https://www.strykeforce.org${original.src}`,
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
