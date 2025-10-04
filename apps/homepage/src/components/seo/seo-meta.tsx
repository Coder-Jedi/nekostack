import Head from 'next/head'

interface SEOMetaProps {
  title?: string
  description?: string
  keywords?: string[]
  ogImage?: string
  ogType?: string
  canonical?: string
  noindex?: boolean
  structuredData?: object
}

const defaultMeta = {
  title: 'NekoStack - Your All-in-One Productivity Suite',
  description: 'Access 7 powerful productivity tools including image compression, QR generation, document processing, and more. Free and premium plans available.',
  keywords: [
    'productivity tools',
    'image compressor',
    'QR code generator',
    'resume builder',
    'markdown editor',
    'unit converter',
    'signature creator',
    'ATS checker',
    'online tools',
    'free tools'
  ],
  ogImage: '/images/og-image.png',
  siteUrl: 'https://nekostack.com'
}

export function SEOMeta({
  title,
  description,
  keywords,
  ogImage,
  ogType = 'website',
  canonical,
  noindex = false,
  structuredData
}: SEOMetaProps) {
  const fullTitle = title ? `${title} | NekoStack` : defaultMeta.title
  const metaDescription = description || defaultMeta.description
  const metaKeywords = keywords || defaultMeta.keywords
  const metaImage = ogImage || defaultMeta.ogImage
  const canonicalUrl = canonical || defaultMeta.siteUrl

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={metaKeywords.join(', ')} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Robots */}
      {noindex && <meta name="robots" content="noindex,nofollow" />}
      
      {/* Open Graph */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={metaImage} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content="NekoStack" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={metaImage} />
      <meta name="twitter:site" content="@nekostack" />
      
      {/* Additional Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      <meta name="theme-color" content="#6366f1" />
      <meta name="author" content="NekoStack" />
      
      {/* Structured Data */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}
    </Head>
  )
}

// Structured data generators
export const generateOrganizationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'NekoStack',
  url: 'https://nekostack.com',
  logo: 'https://nekostack.com/images/logo.png',
  description: 'All-in-one productivity suite with 7 powerful tools',
  sameAs: [
    'https://twitter.com/nekostack',
    'https://github.com/nekostack',
    'https://linkedin.com/company/nekostack'
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+1-XXX-XXX-XXXX',
    contactType: 'Customer Support',
    availableLanguage: ['en', 'es', 'fr', 'de', 'ja', 'zh']
  }
})

export const generateWebApplicationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'NekoStack',
  url: 'https://nekostack.com',
  applicationCategory: 'Productivity',
  operatingSystem: 'Any',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    availability: 'https://schema.org/InStock'
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    ratingCount: '1247',
    bestRating: '5',
    worstRating: '1'
  }
})

export const generateToolSchema = (toolName: string, toolDescription: string, toolUrl: string) => ({
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: toolName,
  applicationCategory: 'Utility',
  operatingSystem: 'Any',
  description: toolDescription,
  url: toolUrl,
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD'
  }
})

export const generateBreadcrumbSchema = (items: Array<{ name: string; url: string }>) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url
  }))
})
