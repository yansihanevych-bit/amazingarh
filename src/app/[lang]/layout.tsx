import type { Metadata, Viewport } from 'next';
import { notFound } from 'next/navigation';
import '../globals.css';
import { getDict, isLang, langs } from '@/content/i18n';
import { Nav } from '@/components/Nav';
import { Motion } from '@/components/Motion';
import { Transitions } from '@/components/Transitions';
import { Preloader } from '@/components/Preloader';
import { siteUrl } from '@/lib/site';

export const dynamicParams = false;
export function generateStaticParams() { return langs.map((lang) => ({ lang })); }

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  const t = getDict(lang).meta;
  return {
    metadataBase: new URL(siteUrl()),
    title: { default: t.title, template: `%s · amazing-irchitect` },
    description: t.description,
    alternates: { canonical: `/${lang}`, languages: { en: '/en', pl: '/pl' } },
    openGraph: { title: t.title, description: t.description, images: ['/og.jpg'], type: 'website', locale: lang === 'pl' ? 'pl_PL' : 'en_US' },
    twitter: { card: 'summary_large_image', title: t.title, description: t.description, images: ['/og.jpg'] },
    icons: { icon: '/favicon.svg' },
  };
}

export const viewport: Viewport = {
  themeColor: [{ media: '(prefers-color-scheme: light)', color: '#F7F4EF' }, { media: '(prefers-color-scheme: dark)', color: '#1d1916' }],
};

/* Runs before paint: marks JS as available and restores the theme without a flash. */
const boot = `(function(){try{var d=document.documentElement;d.classList.add('js');if(sessionStorage.getItem('ai-seen'))d.classList.add('seen');var t=localStorage.getItem('ai-theme');if(t!=='dark'&&t!=='light')t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';d.dataset.theme=t}catch(e){}})()`;

export default async function LangLayout({ children, params }: { children: React.ReactNode; params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  return (
    <html lang={lang} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: boot }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,100..900&family=Instrument+Serif:ital@0;1&display=swap" />
      </head>
      <body>
        <Preloader />
        <Nav lang={lang} />
        <Motion />
        <Transitions />
        {children}
      </body>
    </html>
  );
}
