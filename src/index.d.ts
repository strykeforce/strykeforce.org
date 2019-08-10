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

interface Frontmatter {
  date: string;
  path: string;
  title: string;
  author: string;
  description: string;
  image: {
    childImageSharp: { original: ImageSharpOriginal } | any; // eslint-disable-line @typescript-eslint/no-explicit-any
  };
}

interface PostExcerpt {
  id: string;
  excerpt: string;
  fileAbsolutePath: string;
  frontmatter: Frontmatter;
}

interface PostExcerptNode {
  node: PostExcerpt;
}

interface PostDetail {
  html: string;
  frontmatter: Frontmatter;
}

interface Partner {
  name: string;
  url: string;
  text: string;
  logo: {
    childImageSharp: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  };
}

interface TeamMember {
  id: string;
  name: string;
  displayName: string;
  grade?: number;
  school?: string;
  quote?: string;
  photo: {
    childImageSharp: {
      fixed: any; // eslint-disable-line @typescript-eslint/no-explicit-any
    };
  };
}

interface EventData {
  name: string;
  date: string;
  venue: string;
  street: string;
  city: string;
  state: string;
  zip: string;
}
