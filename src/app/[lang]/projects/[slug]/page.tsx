import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getDict, isLang, langs } from '@/content/i18n';
import { getProject, img, projects, type ProjectImage } from '@/content/projects';
import { Fig } from '@/components/Fig';

export const dynamicParams = false;
export function generateStaticParams() {
  return langs.flatMap((lang) => projects.map((p) => ({ lang, slug: p.slug })));
}

type Params = { params: Promise<{ lang: string; slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { lang, slug } = await params;
  const p = getProject(slug);
  if (!p || !isLang(lang)) return {};
  return {
    title: p.name,
    description: p.lead[lang],
    alternates: { canonical: `/${lang}/projects/${slug}`, languages: { en: `/en/projects/${slug}`, pl: `/pl/projects/${slug}` } },
    openGraph: { title: `${p.name} · amazing-irchitect`, description: p.lead[lang], images: [img(p.hero)] },
  };
}

/** Wide images take a full row; portraits pair up, every other pair offset; a lone portrait gets a quiet caption. */
function Gallery({ images, hour }: { images: ProjectImage[]; hour: string }) {
  const out: React.ReactNode[] = [];
  let i = 0, k = 0;
  while (i < images.length) {
    const a = images[i], b = images[i + 1];
    if (a.shape === 'wide') { out.push(<div className="wrap" key={a.src}><Fig className="g-w" src={a.src} alt={a.alt} sizes="100vw" /></div>); i++; }
    else if (b && b.shape === 'tall') {
      out.push(<div className={`wrap grid pair${k++ % 2 ? ' off' : ''}`} key={a.src}><Fig className="a" src={a.src} alt={a.alt} /><Fig className="b" src={b.src} alt={b.alt} /></div>);
      i += 2;
    } else { out.push(<div className="wrap grid solo l" key={a.src}><Fig src={a.src} alt={a.alt} /><p className="quote fade">{hour}.</p></div>); i++; }
  }
  return <div className="gal">{out}</div>;
}

export default async function ProjectPage({ params }: Params) {
  const { lang, slug } = await params;
  const p = getProject(slug);
  if (!p || !isLang(lang)) notFound();
  const t = getDict(lang), idx = projects.indexOf(p), next = projects[(idx + 1) % projects.length];
  const heroImg = p.images.find((i) => i.src === p.hero)!;
  return (
    <main className="page">
      <header className="wrap grid ph">
        <a className="back" href={`/${lang}#work`}>{t.project.back}</a>
        <h1><span className="ln"><span>{p.name}</span></span></h1>
        <span className="hour fade">{p.hour[lang]}</span>
      </header>
      <Fig className={`phero${heroImg.shape === 'tall' ? ' tall' : ''}`} src={p.hero} alt={heroImg.alt} sizes="100vw" priority />
      <section className="wrap grid pbody">
        <p className="lead fade">{p.lead[lang]}</p>
        <dl className="fade">
          <div><dt className="label">{t.work.architects}</dt><dd>{p.architects}</dd></div>
          <div><dt className="label">{t.project.type}</dt><dd>{p.type[lang]}</dd></div>
          <div><dt className="label">{t.project.year}</dt><dd>{p.year}</dd></div>
          <div><dt className="label">{t.project.viz}</dt><dd>Iryna Riasnianska</dd></div>
          <div><dt className="label">{t.project.light}</dt><dd>{p.hour[lang]}</dd></div>
        </dl>
        <p className="draft" style={{ gridColumn: '1/13', margin: 0 }}>{t.project.draft}</p>
      </section>
      <Gallery images={p.images.filter((i) => i.src !== p.hero)} hour={p.hour[lang]} />
      <a className="next" href={`/${lang}/projects/${next.slug}`} data-curtain={next.hour[lang]}>
        <figure className="rv"><Image src={img(next.cover)} alt="" fill sizes="100vw" /></figure>
        <div className="nt"><span className="label" style={{ color: '#d9c4bc' }}>{t.project.next} · {next.hour[lang]}</span><span className="big">{next.name}</span></div>
      </a>
      <section className="contact dark" style={{ paddingTop: 60 }}>
        <div className="wrap grid"><div className="foot" style={{ marginTop: 0 }}><span>© {new Date().getFullYear()} amazing-irchitect · {t.hero.tag}</span><a href={`/${lang}#contact`} style={{ color: 'inherit' }}>{t.contact.start}</a></div></div>
      </section>
    </main>
  );
}
