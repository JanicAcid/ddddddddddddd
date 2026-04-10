import type { MetadataRoute } from 'next'
import { getAllArticles } from '@/config/articles'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://tellurmarkirovka.vercel.app'
  const articles = getAllArticles()

  const instructionPages = articles.map(article => ({
    url: `${baseUrl}/instructions/${article.slug}`,
    lastModified: new Date(article.dateModified),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${baseUrl}/kalkulyatory`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/kalkulyatory/markirovka`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/instructions`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/faq`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/services`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/nastroyka-kassy-markirovka`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/podklyuchenie-chestnyy-znak`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/kakuyu-kassu-dlya-markirovki`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/integraciya-1c`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/contacts`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    ...instructionPages,
  ]
}
