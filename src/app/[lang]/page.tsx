import { notFound } from 'next/navigation';
import { getDict, isLang } from '@/content/i18n';
import { Hero } from '@/components/home/Hero';
import { About, Manifesto, Process, Spreads } from '@/components/home/Sections';
import { DayStory } from '@/components/home/DayStory';
import { ProjectIndex } from '@/components/home/ProjectIndex';
import { Contact } from '@/components/Contact';

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = getDict(lang);
  return (
    <main id="home">
      <Hero t={t.hero} />
      <Manifesto t={t.manifesto} />
      <Spreads lang={lang} t={t.work} />
      <DayStory lang={lang} t={t.story} />
      <ProjectIndex lang={lang} t={t.index} />
      <About t={t.about} />
      <Process t={t.process} />
      <Contact lang={lang} t={t.contact} tag={t.hero.tag} />
    </main>
  );
}
