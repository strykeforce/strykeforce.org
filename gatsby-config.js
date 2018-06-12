module.exports = {
  siteMetadata: {
    title: 'Stryke Force',
    description:
      'This is the Stryke Force Web Site. Stryke Force is a community FIRST robotics team based in Kalamazoo, Michigan. We are FRC 2767, FTC 7228 and FTC 8553.',
  },
  plugins: [
    `gatsby-plugin-typescript`,
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'content',
        path: `${__dirname}/content`,
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        excerpt_separator: '<!--more-->',
        plugins: [
          'gatsby-remark-responsive-iframe',
          {
            resolve: 'gatsby-remark-smartypants',
            options: {
              dashes: 'oldschool',
            },
          },
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 640,
            },
          },
        ],
      },
    },
    'gatsby-plugin-catch-links',
    'gatsby-plugin-react-helmet',
    {
      resolve: 'gatsby-plugin-emotion',
      options:
        process.env.NODE_ENV === 'development'
          ? { sourceMap: true, autoLabel: true }
          : { sourceMap: false, autoLabel: false, hoist: true },
    },
    'gatsby-plugin-sharp',
    'gatsby-transformer-sharp',
    'gatsby-transformer-toml',
    'gatsby-plugin-netlify',
  ],
}