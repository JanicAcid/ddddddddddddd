// ============================================================================
// JSON-LD для статьи (Article schema)
// ============================================================================

const SITE_URL = 'https://tellurmarkirovka.vercel.app'

interface ArticleJsonLdProps {
  slug: string
  title: string
  description: string
  datePublished: string
  dateModified: string
  image: string
  authorName?: string
}

export function ArticleJsonLd({
  slug,
  title,
  description,
  datePublished,
  dateModified,
  image,
  authorName = 'Теллур-Интех',
}: ArticleJsonLdProps) {
  const url = `${SITE_URL}/instructions/${slug}`

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${url}/#article`,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    headline: title,
    description,
    image: `${SITE_URL}${image}`,
    author: {
      '@type': 'Organization',
      name: authorName,
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: 'ООО «Теллур-Интех»',
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/logo.webp`,
      },
    },
    datePublished,
    dateModified,
    inLanguage: 'ru',
  }

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Главная',
        item: SITE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Инструкции',
        item: `${SITE_URL}/instructions`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: title,
        item: url,
      },
    ],
  }

  const howToLd = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: title,
    description,
    image: `${SITE_URL}${image}`,
    author: {
      '@type': 'Organization',
      name: authorName,
    },
    datePublished,
    dateModified,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToLd) }}
      />
    </>
  )
}
