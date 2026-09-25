import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.shivtirthwaterpark.com';
  const currentDate = new Date().toISOString().split('T')[0];

  const routes = [
    { url: '', priority: 1.0, changeFrequency: 'daily' as const },
    { url: '/water-park', priority: 0.95, changeFrequency: 'daily' as const },
    { url: '/packages', priority: 0.95, changeFrequency: 'daily' as const },
    { url: '/school-picnic', priority: 0.90, changeFrequency: 'weekly' as const },
    { url: '/boating-park', priority: 0.85, changeFrequency: 'weekly' as const },
    { url: '/bird-park', priority: 0.85, changeFrequency: 'weekly' as const },
    { url: '/adventure-park', priority: 0.85, changeFrequency: 'weekly' as const },
    { url: '/amusement-park', priority: 0.85, changeFrequency: 'weekly' as const },
    { url: '/accommodation', priority: 0.85, changeFrequency: 'weekly' as const },
    { url: '/offers', priority: 0.85, changeFrequency: 'daily' as const },
    { url: '/other-activities', priority: 0.80, changeFrequency: 'weekly' as const },
    { url: '/about', priority: 0.80, changeFrequency: 'monthly' as const },
    { url: '/contact', priority: 0.80, changeFrequency: 'monthly' as const },
    { url: '/gallery', priority: 0.75, changeFrequency: 'weekly' as const },
    { url: '/facilities-rules', priority: 0.70, changeFrequency: 'monthly' as const },
    { url: '/influencer-collab', priority: 0.65, changeFrequency: 'monthly' as const },
    { url: '/privacy', priority: 0.40, changeFrequency: 'yearly' as const },
    { url: '/terms', priority: 0.40, changeFrequency: 'yearly' as const },
    { url: '/payment-refund', priority: 0.40, changeFrequency: 'yearly' as const },
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route.url}`,
    lastModified: currentDate,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
