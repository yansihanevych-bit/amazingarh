import { notFound } from 'next/navigation';
import { getDict, isLang } from '@/content/i18n';
import { HeroStory } from '@/components/home/HeroStory';
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
      <HeroStory lang={lang} t={t.hero} w={t.work} />
      <About t={t.about} />
      <Manifesto t={t.manifesto} />
      <Spreads lang={lang} t={t.work} />
      <DayStory lang={lang} t={t.story} view={t.work.view} />
      <ProjectIndex lang={lang} t={t.index} />
      <Process t={t.process} />
      <Contact lang={lang} t={t.contact} tag={t.hero.tag} />
    </main>
  );
}
