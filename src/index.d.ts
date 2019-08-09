declare module '*.svg' {
  const content: string;
  export default content;
}

declare module '*.jpg' {
  const content: string;
  export default content;
}

declare module '*.png' {
  const content: string;
  export default content;
}

interface ImageSharpOriginal {
  src: string;
  width: number;
  height: number;
}

// declare const graphql: (query: TemplateStringsArray) => void

// prettier-ignore
interface Frontmatter {
  date: string;
  path: string;
  title: string;
  author: string;
  description: string;
  image: {
    childImageSharp: { original: ImageSharpOriginal } | any;
  };
}

// prettier-ignore
interface PostExcerpt {
  id: string;
  excerpt: string;
  frontmatter: Frontmatter;
}

interface PostExcerptNode {
  node: PostExcerpt;
}

// prettier-ignore
interface PostDetail {
  html: string;
  frontmatter: Frontmatter;
}

interface Partner {
  name: string;
  url: string;
  text: string;
  logo: {
    childImageSharp: any;
  };
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
    };
  };
}

// prettier-ignore
interface EventData {
  name: string;
  date: string;
  venue: string;
  street: string;
  city: string;
  state: string;
  zip: string;
}
