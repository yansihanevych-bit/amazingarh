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

/** Five projects, five compositions: never the same card twice. */
export function Spreads({ lang, t }: { lang: Lang; t: Dict['work'] }) {
  const [kz, pl2, pl3, tk, znk] = projects;
  const href = (p: Project) => `/${lang}/projects/${p.slug}`;
  const T = (p: Project, n: number) => <div className="t"><span className="label">0{n} / 05</span><Title p={p} /><Info p={p} lang={lang} t={t} n={n} /></div>;
  const big = '(max-width: 700px) 100vw, 50vw', small = '(max-width: 700px) 100vw, 30vw';
  return (
    <section id="work" aria-label={t.view}>
      <LightWord word={t.light} caption={t.lightCap} />
      <div className="wrap shead"><h2 className="fade"><Rich text={t.title} /></h2><span className="label fade">{t.label}</span></div>
      <a className="proj pA wrap grid" href={href(kz)} data-curtain={kz.hour[lang]}>
        {T(kz, 1)}
        <Fig className="f1" src="kz-4" alt={altOf(kz, 'kz-4')} sizes={big} />
        <Fig className="f2" src="kz-3" alt={altOf(kz, 'kz-3')} sizes={small} />
      </a>
      <a className="proj pB wrap grid" href={href(pl2)} data-curtain={pl2.hour[lang]}>
        <Fig className="f1" src="pl2-6" alt={altOf(pl2, 'pl2-6')} sizes="100vw" />
        <div className="t"><Title p={pl2} /></div>
        <Info p={pl2} lang={lang} t={t} n={2} withLabel />
      </a>
      <a className="proj pC wrap grid" href={href(pl3)} data-curtain={pl3.hour[lang]}>
        <div className="t"><span className="label">03 / 05</span><Title p={pl3} /></div>
        <Fig className="f1" src="pl3-3" alt={altOf(pl3, 'pl3-3')} sizes={big} />
        <Fig className="f2" src="pl3-5" alt={altOf(pl3, 'pl3-5')} sizes={small} />
        <Info p={pl3} lang={lang} t={t} n={3} />
      </a>
      <div className="dark">
        <a className="proj pD wrap grid" href={href(tk)} data-curtain={tk.hour[lang]}>
          <Fig className="f1" src="tk-7" alt={altOf(tk, 'tk-7')} sizes={big} />
          {T(tk, 4)}
          <Fig className="f2" src="tk-11" alt={altOf(tk, 'tk-11')} sizes={small} />
          <Fig className="f3" src="tk-10" alt={altOf(tk, 'tk-10')} sizes={small} />
        </a>
      </div>
      <a className="proj pE wrap grid" href={href(znk)} data-curtain={znk.hour[lang]}>
        <Fig className="f0" src="znk-5" alt={altOf(znk, 'znk-5')} sizes={small} />
        <Fig className="f1" src="znk-1" alt={altOf(znk, 'znk-1')} sizes={big} />
        {T(znk, 5)}
        <Fig className="f2" src="znk-4" alt={altOf(znk, 'znk-4')} sizes={small} />
      </a>
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
