import type { Dict, Lang } from '@/content/i18n';
import { contactInfo } from '@/content/i18n';
import { altOf, projects, type Project } from '@/content/projects';
import { Fig } from '../Fig';
import { Rich } from '../Rich';

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
      <div className="wrap shead"><h2 className="fade"><Rich text={t.title} /></h2><span className="label fade">{t.label}</span></div>
      <a className="proj pA wrap grid" href={href(kz)} data-curtain={kz.hour[lang]}>
        {T(kz, 1)}
        <Fig className="f1" src="kz-2" alt={altOf(kz, 'kz-2')} sizes={big} />
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
          <Fig className="f1" src="tk-3" alt={altOf(tk, 'tk-3')} sizes={big} />
          {T(tk, 4)}
          <Fig className="f2" src="tk-2" alt={altOf(tk, 'tk-2')} sizes={small} />
          <Fig className="f3" src="tk-4" alt={altOf(tk, 'tk-4')} sizes={small} />
        </a>
      </div>
      <a className="proj pE wrap grid" href={href(znk)} data-curtain={znk.hour[lang]}>
        <Fig className="f0" src="znk-5" alt={altOf(znk, 'znk-5')} sizes={small} />
        <Fig className="f1" src="znk-3" alt={altOf(znk, 'znk-3')} sizes={big} />
        {T(znk, 5)}
        <Fig className="f2" src="znk-4" alt={altOf(znk, 'znk-4')} sizes={small} />
      </a>
    </section>
  );
}

export function About({ t }: { t: Dict['about'] }) {
  return (
    <section className="about" id="about" aria-label="About">
      <div className="wrap grid" style={{ rowGap: 28 }}>
        <Fig className="por" src="portrait-1" alt="Black-and-white portrait of Iryna Riasnianska" sizes="(max-width: 900px) 70vw, 40vw" />
        <h2 className="fade">Iryna <em>Riasnianska</em></h2>
        <p className="aquote fade">{t.quote}</p>
        <div className="bio fade">
          {t.bio.map((p) => <p key={p.slice(0, 20)}>{p}</p>)}
          <p className="draft">{t.draft}</p>
        </div>
        <dl className="fade">
          <div><dt className="label">{t.discipline}</dt><dd>{t.disciplineV}</dd></div>
          <div><dt className="label">{t.tools}</dt><dd>3ds Max, Corona Renderer, Photoshop</dd></div>
          <div><dt className="label">{t.published}</dt><dd><a href="https://amazingarchitecture.com/visualization/elements-house-in-kharkiv-ukraine-by-mcorp" target="_blank" rel="noopener noreferrer">Amazing Architecture, 2022</a></dd></div>
        </dl>
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
  return (
    <section className="process wrap" aria-label="Process">
      <div className="shead"><h2 className="fade"><Rich text={t.title} /></h2></div>
      <div className="essay">
        {t.steps.map(([word, h, p], i) => {
          const [src, alt] = STEP_IMAGES[i];
          const fig = <Fig src={src} alt={alt} sizes={i === 3 ? '100vw' : '(max-width: 700px) 100vw, 40vw'} />;
          const w = <span className="w fade">{word}</span>;
          const tx = <div className="tx fade"><h3>{h}</h3><p>{p}</p></div>;
          return (
            <div className={`step s${i + 1} grid`} key={word}>
              {i === 0 && <>{w}{fig}{tx}</>}
              {i === 1 && <>{w}{tx}{fig}</>}
              {i === 2 && <>{fig}{w}{tx}</>}
              {i === 3 && <>{fig}{w}{tx}</>}
            </div>
          );
        })}
      </div>
    </section>
  );
}

export const contact = contactInfo;
