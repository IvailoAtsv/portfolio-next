export const site = {
  name: 'Ivaylo Atanassov',
  brand: 'Ivaylo does it all',
  tagline: 'I make digital products sing.',
  url: 'https://ivaylo.dev',
  locale: 'en',
  ogLocale: 'en_US',
  language: 'en-US',
  email: 'ivailoatanassov@gmail.com',
  jobTitle: 'Product designer & full-stack developer',
  location: 'Bulgaria',
  employer: 'Vention',
  themeColor: '#11110f',
  backgroundColor: '#efe9da',
  twitterCard: 'summary_large_image',
} as const;

export const ogImage = {
  width: 1200,
  height: 630,
  type: 'image/png',
} as const;

export type OgType = 'website' | 'article';

export type PageMeta = {
  title: string;
  description: string;
  path: string;
  image: string;
  imageAlt: string;
  ogType: OgType;
  breadcrumbs?: readonly { name: string; path: string }[];
};

export const pages = {
  home: {
    title: 'Ivaylo Atanassov - Product designer & full-stack developer',
    description:
      'I design and build digital products end to end - product UX, full-stack engineering, and shipped systems. Work from HLP Labs, Keep Up, Sellphy, and Finance Me.',
    path: '/',
    image: '/og/home.png',
    imageAlt:
      'A browser-window character sings into a vintage microphone on a small wooden stage',
    ogType: 'website',
  },
  hlpLabs: {
    title: 'HLP Labs - Research peptide shop | Ivaylo Atanassov',
    description:
      'How I designed and built HLP Labs: a Bulgarian shop for research peptides, with a reference library, an AI assistant, and the admin panel that runs both.',
    path: '/work/hlp-labs',
    image: '/og/hlp-labs.png',
    imageAlt:
      'A friendly vial character points at a microscope slide beside a laboratory specimen cabinet',
    ogType: 'article',
    breadcrumbs: [{ name: 'HLP Labs', path: '/work/hlp-labs' }],
  },
  keepUp: {
    title: 'Keep Up - Programming practice PWA | Ivaylo Atanassov',
    description:
      'Keep Up is a programming quiz app with a daily quiz, learning paths, and a pixel-art duck that reacts to answers. Designed and built by Ivaylo Atanassov.',
    path: '/work/keep-up',
    image: '/og/keep-up.png',
    imageAlt:
      'A smiling flashcard character runs along a track holding a daily calendar',
    ogType: 'article',
    breadcrumbs: [{ name: 'Keep Up', path: '/work/keep-up' }],
  },
  sellphy: {
    title: 'Sellphy - Shop platform | Ivaylo Atanassov',
    description:
      'Sellphy is a shop platform with a six-step editor, product pages each shop can dress, and dashboard tours. Hosting cost dropped 83%; maintenance dropped 25+ hours a month.',
    path: '/work/sellphy',
    image: '/og/sellphy.png',
    imageAlt:
      'A browser-window shopkeeper with a striped awning carefully seals a parcel at a packing table',
    ogType: 'article',
    breadcrumbs: [{ name: 'Sellphy', path: '/work/sellphy' }],
  },
  financeMe: {
    title: 'Finance Me - Family finance app | Ivaylo Atanassov',
    description:
      'A family expense tracker that turns an Apple Pay purchase into a categorized expense, shared history, and savings goals. Product design and full-stack by Ivaylo.',
    path: '/work/finance-me',
    image: '/og/finance-me.png',
    imageAlt:
      'A wallet character puts a coin into a household savings jar beside an open budget ledger',
    ogType: 'article',
    breadcrumbs: [{ name: 'Finance Me', path: '/work/finance-me' }],
  },
} as const satisfies Record<string, PageMeta>;

export function absoluteUrl(path: string, base = site.url): string {
  return new URL(path, base).href;
}

export function jsonLdGraph(
  page: PageMeta,
  canonical: string,
  imageUrl: string,
) {
  const personId = `${site.url}/#person`;
  const websiteId = `${site.url}/#website`;
  const webpageId = `${canonical}#webpage`;
  const imageId = `${canonical}#primaryimage`;

  const graph: Record<string, unknown>[] = [
    {
      '@type': 'Person',
      '@id': personId,
      name: site.name,
      url: site.url,
      image: absoluteUrl('/icon-512.png'),
      jobTitle: site.jobTitle,
      email: `mailto:${site.email}`,
      description:
        page.path === '/' ? page.description : pages.home.description,
      worksFor: {
        '@type': 'Organization',
        name: site.employer,
      },
      homeLocation: {
        '@type': 'Place',
        name: site.location,
        address: {
          '@type': 'PostalAddress',
          addressCountry: 'BG',
        },
      },
      knowsAbout: [
        'Product design',
        'User experience design',
        'Full-stack development',
        'Progressive web apps',
        'Design engineering',
      ],
    },
    {
      '@type': 'WebSite',
      '@id': websiteId,
      url: `${site.url}/`,
      name: site.name,
      alternateName: site.brand,
      description: pages.home.description,
      inLanguage: site.language,
      publisher: { '@id': personId },
    },
    {
      '@type': 'ImageObject',
      '@id': imageId,
      url: imageUrl,
      contentUrl: imageUrl,
      width: ogImage.width,
      height: ogImage.height,
      caption: page.imageAlt,
      encodingFormat: ogImage.type,
    },
    {
      '@type': page.ogType === 'article' ? ['WebPage', 'ItemPage'] : 'WebPage',
      '@id': webpageId,
      url: canonical,
      name: page.title,
      headline: page.title,
      description: page.description,
      inLanguage: site.language,
      isPartOf: { '@id': websiteId },
      about: { '@id': personId },
      author: { '@id': personId },
      creator: { '@id': personId },
      primaryImageOfPage: { '@id': imageId },
      image: { '@id': imageId },
      speakable: {
        '@type': 'SpeakableSpecification',
        cssSelector: ['h1', '.hero-copy p', '.case-lede', '.about-lede'],
      },
    },
  ];

  if (page.ogType === 'article') {
    graph.push({
      '@type': 'Article',
      '@id': `${canonical}#article`,
      headline: page.title,
      description: page.description,
      image: imageUrl,
      author: { '@id': personId },
      creator: { '@id': personId },
      publisher: { '@id': personId },
      mainEntityOfPage: { '@id': webpageId },
      inLanguage: site.language,
      articleSection: 'Work',
    });
  }

  if (page.breadcrumbs?.length) {
    graph.push({
      '@type': 'BreadcrumbList',
      '@id': `${canonical}#breadcrumb`,
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: `${site.url}/`,
        },
        ...page.breadcrumbs.map((crumb, index) => ({
          '@type': 'ListItem',
          position: index + 2,
          name: crumb.name,
          item: absoluteUrl(crumb.path),
        })),
      ],
    });
  }

  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  };
}
