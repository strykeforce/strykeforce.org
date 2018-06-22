declare module '*.svg' {
  const content: string
  export default content
}

declare module '*.jpg' {
  const content: string
  export default content
}

declare module '*.png' {
  const content: string
  export default content
}

// declare const graphql: (query: TemplateStringsArray) => void

// prettier-ignore
interface Frontmatter {
  date: string;
  path: string;
  title: string;
  description: string;
  image: {
    childImageSharp: {
      original: {
        src: string;
        width: number;
        height: number;
      }
    }
  }
}

// prettier-ignore
interface PostExcerpt {
  id: string;
  excerpt: string;
  frontmatter: Frontmatter;
}

interface PostExcerptNode {
  node: PostExcerpt
}

// prettier-ignore
interface PostDetail {
  html: string;
  frontmatter: Frontmatter;
}

interface Sponsor {
  name: string
  url: string
  logo: {
    childImageSharp: {
      id: string
      original: {
        src: string
      }
    }
  }
}

interface SponsorLevel {
  name: string
  width: number
  height: number
  sponsors: Sponsor[]
}

// prettier-ignore
interface TeamMember {
  id: string;
  name: string;
  displayName: string;
  grade?: number;
  school?: string;
  quote?: string;
  photo: {
    childImageSharp: {
      fixed: any;
    }
  }
}
