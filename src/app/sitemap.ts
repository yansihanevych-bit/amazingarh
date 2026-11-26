import type { MetadataRoute } from 'next';
import { langs } from '@/content/i18n';
import { projects } from '@/content/projects';
import { siteUrl } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  const paths = ['', '/tavern', ...projects.map((p) => `/projects/${p.slug}`)];
  return paths.flatMap((p) => langs.map((l) => ({ url: `${base}/${l}${p}`, changeFrequency: 'monthly' as const, priority: p === '' ? 1 : 0.7 })));
}
