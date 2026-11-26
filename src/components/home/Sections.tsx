import type { Dict, Lang } from '@/content/i18n';
import { contactInfo } from '@/content/i18n';
import { altOf, img, projects, type Project } from '@/content/projects';
import { Fig } from '../Fig';
import { Rich } from '../Rich';
import { LightWord } from './LightWord';
import { ProcessTimeline } from './ProcessTimeline';
import Image from 'next/image';

export function Manifesto({ t }: { t: Dict['manifesto'] }) {
  return (
    <section className="manifesto wrap grid" aria-label={t.label}>
      <span className="label fade">{t.label}</span>
      <p className="big fade"><Rich text={t.big} /></p>
      <Fig className="mat" src="tk-6" alt="Covered timber terrace with dining table, overcast light" sizes="(max-width: 700px) 100vw, 25vw" />
      <div className="notes">
        {t.notes.map(([h, p]) => <div className="fade" key={h}><h3>{h}</h3><p>{p}</p></div>)}
      </div>
    </section>
  );
}

function Info({ p, lang, t, n, withLabel }: { p: Project; lang: Lang; t: Dict['work']; n: number; withLabel?: boolean }) {
  return (
    <div className="info" style={{ marginTop: 18 }}>
      {withLabel && <span className="label">0{n} / 05</span>}
      <span className="hour">{p.hour[lang]}</span>
      <span><b>{t.architects}</b> {p.architects}</span>
      <span>{p.type[lang]} · {p.year}</span>
      <span className="more">{t.view}</span>
    </div>
  );
}
const Title = ({ p }: { p: Project }) => <h3><span className="ln"><span>{p.name}</span></span></h3>;

/** Selected light studies: one dominant project, then smaller studies placed asymmetrically. */
export function Spreads({ lang, t }: { lang: Lang; t: Dict['work'] }) {
  const [kz, pl2, pl3, tk, znk] = projects;
  const Card = ({ p, n, src, cls, sizes }: { p: Project; n: number; src: string; cls: string; sizes: string }) => (
    <a className={`st ${cls}`} href={`/${lang}/projects/${p.slug}`} data-curtain={p.hour[lang]}>
      <Fig className="st-img" src={src} alt={altOf(p, src)} sizes={sizes} />
      <div className="st-cap">
        <span className="st-n">0{n}</span>
        <h3 className="st-t"><span className="ln"><span>{p.name}</span></span></h3>
        <dl className="st-meta">
          <div><dt>{t.architects}</dt><dd>{p.architects}</dd></div>
          <div><dt>{t.lightStudy}</dt><dd><em>{p.hour[lang]}</em></dd></div>
        </dl>
        <span className="st-more">{t.view} →</span>
      </div>
    </a>
  );
  return (
    <section id="work" className="studies" aria-label={t.view}>
      <LightWord word={t.light} caption={t.lightCap} />
      <div className="wrap shead"><h2 className="fade"><Rich text={t.title} /></h2><span className="label fade">{t.label}</span></div>
      <div className="wrap st-grid">
        <Card p={kz} n={1} src="kz-3" cls="st-lead" sizes="100vw" />
        <Card p={pl2} n={2} src="pl2-4" cls="st-a" sizes="(max-width: 800px) 100vw, 40vw" />
        <Card p={pl3} n={3} src="pl3-1" cls="st-b" sizes="(max-width: 800px) 100vw, 55vw" />
        <Card p={tk} n={4} src="tk-7" cls="st-c" sizes="(max-width: 800px) 100vw, 55vw" />
        <Card p={znk} n={5} src="znk-1" cls="st-d" sizes="(max-width: 800px) 100vw, 35vw" />
      </div>
    </section>
  );
}

export function About({ t }: { t: Dict['about'] }) {
  return (
    <section className="about2" id="about" aria-label={t.kicker}>
      <div className="wrap ab-g">
        <div className="ab-text">
          <span className="kick">{t.kicker}</span>
          <h2 className="ab-name"><span className="ln"><span>Iryna</span></span><span className="ln ab-l2"><span>Riasnianska</span></span></h2>
          <span className="ab-role">{t.role}</span>
          <p className="ab-quote fade">&ldquo;{t.quote}&rdquo;</p>
          <div className="ab-bio fade">{t.bio.map((p) => <p key={p.slice(0, 20)}>{p}</p>)}</div>
          <ol className="ab-skills fade">{t.skills.map((s, i) => <li key={s}><span className="outline">0{i + 1}</span>{s}</li>)}</ol>
          <dl className="ab-dl fade">
            <div><dt>{t.based}</dt><dd>{t.basedV}</dd></div>
            <div><dt>{t.fav}</dt><dd>{t.favV}</dd></div>
            <div><dt>{t.tools}</dt><dd>3ds Max, Corona, Photoshop</dd></div>
            <div><dt>{t.published}</dt><dd><a href="https://amazingarchitecture.com/visualization/elements-house-in-kharkiv-ukraine-by-mcorp" target="_blank" rel="noopener noreferrer">Amazing Architecture</a></dd></div>
          </dl>
          <a className="cta" href="#contact">{t.cta} <span aria-hidden="true">→</span></a>
        </div>
        <figure className="ab-por rv brackets">
          <Image src={img('portrait-1')} alt="Black-and-white portrait of Iryna Riasnianska" fill sizes="(max-width: 900px) 90vw, 35vw" />
        </figure>
      </div>
    </section>
  );
}

const STEP_IMAGES: [string, string][] = [
  ['kz-3', 'Street view of a brick house with perforated screen wall'],
  ['pl3-5', 'Entrance of a gabled timber house at dusk'],
  ['znk-4', 'Cantilevered dark house between trunks'],
  ['pl3-6', 'Gabled timber houses at night in a pine forest'],
];

export function Process({ t }: { t: Dict['process'] }) {
  return <ProcessTimeline t={t} images={STEP_IMAGES} />;
}

export const contact = contactInfo;
