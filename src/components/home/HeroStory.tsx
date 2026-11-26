'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import type { Dict, Lang } from '@/content/i18n';
import { altOf, img, projects } from '@/content/projects';
import { Rich } from '../Rich';

/**
 * The cover: a pinned sequence.
 * Slide 0 — the name and Ira's portrait. Slides 1–5 — each project rises over the previous one.
 * After the last project the page releases and scrolls normally.
 */
export function HeroStory({ lang, t, w }: { lang: Lang; t: Dict['hero']; w: Dict['work'] }) {
  const section = useRef<HTMLElement>(null);
  const frames = useRef<(HTMLDivElement | null)[]>([]);
  const bar = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const S = projects.length + 1;

  useEffect(() => {
    const sec = section.current!;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0, last = -1;
    const render = () => {
      const r = sec.getBoundingClientRect(), span = r.height - innerHeight;
      const p = span > 0 ? Math.min(1, Math.max(0, -r.top / span)) : 0;
      const f = p * (S - 1);
      frames.current.forEach((el, i) => {
        if (!el) return;
        let k = i === 0 ? 1 : Math.min(1, Math.max(0, f - (i - 1)));
        if (reduce) k = k > 0.5 ? 1 : 0;
        const e = 1 - Math.pow(1 - k, 3);                                   // ease-out
        el.style.clipPath = i === 0 ? '' : `inset(${((1 - e) * 100).toFixed(2)}% 0 0 0)`;
        const pic = el.querySelector<HTMLElement>('.cv-pic');
        // the covered slide drifts up and darkens a little as the next one rises
        const next = Math.min(1, Math.max(0, f - i));
        if (pic && !reduce) pic.style.transform = `translate3d(0,${(-next * 8 + (1 - e) * 10).toFixed(2)}%,0) scale(${(1.08 - 0.08 * e).toFixed(4)})`;
        el.style.setProperty('--shade', (next * 0.45).toFixed(3));
      });
      if (bar.current) bar.current.style.transform = `scaleX(${p.toFixed(4)})`;
      const idx = Math.min(S - 1, Math.round(f));
      if (idx !== last) { last = idx; setActive(idx); }
    };
    const onScroll = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(render); };
    render();
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onScroll);
    return () => { removeEventListener('scroll', onScroll); removeEventListener('resize', onScroll); cancelAnimationFrame(raf); };
  }, [S]);

  const jump = (i: number) => {
    const sec = section.current; if (!sec) return;
    const span = sec.offsetHeight - innerHeight, top = sec.getBoundingClientRect().top + scrollY;
    scrollTo({ top: top + (span * i) / (S - 1) + 2, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  };

  return (
    <section className="cover" id="top" ref={section} style={{ height: `${S * 100}svh` }} aria-label="amazing-irchitect">
      <div className="cv-stage">
        {/* slide 0: the name + Ira */}
        <div className="cv-frame cv-intro" ref={(el) => { frames.current[0] = el; }}>
          <div className="cv-meta wrap"><span className="label">{t.tag}</span><span className="label">{t.meta2}</span><span className="label">{t.meta3}</span></div>
          <h1 className="cv-name" aria-label="amazing-irchitect">
            <span className="ln in"><span>amazing-</span></span>
            <span className="ln in l2"><span className="it">irchitect</span><sup>®</sup></span>
          </h1>
          <figure className="cv-ira">
            <Image src={img('ira')} alt="Portrait of Iryna Riasnianska" fill priority sizes="(max-width: 700px) 60vw, 30vw" />
          </figure>
          <div className="cv-lead"><p className="hsub"><Rich text={t.sub} /></p><p className="intro">{t.intro}</p></div>
          <span className="cv-hint label">{t.scroll} ↓</span>
        </div>

        {/* slides 1–5: projects */}
        {projects.map((p, i) => (
          <div key={p.slug} className={`cv-frame cv-proj${active === i + 1 ? ' cur' : ''}`} ref={(el) => { frames.current[i + 1] = el; }} style={{ clipPath: 'inset(100% 0 0 0)' }}>
            <div className="cv-pic"><Image src={img(p.hero)} alt={altOf(p, p.hero)} fill sizes="(max-aspect-ratio: 1/1) 230vh, 100vw" quality={85} priority={i === 0} /></div>
            <div className="cv-scrim" />
            <a className="cv-cap wrap" href={`/${lang}/projects/${p.slug}`} data-curtain={p.hour[lang]} tabIndex={active === i + 1 ? 0 : -1}>
              <span className="label">0{i + 1} / 0{projects.length} · {p.type[lang]} · {p.year}</span>
              <span className="cv-title">{p.name}</span>
              <span className="cv-row"><em>{p.hour[lang]}</em><span>{w.architects}: {p.architects}</span><span className="cv-more">{w.view} →</span></span>
            </a>
          </div>
        ))}

        <nav className="cv-dots wrap" aria-label="Cover">
          <div className="cv-track"><div className="cv-bar" ref={bar} /></div>
          <ol>
            {Array.from({ length: S }, (_, i) => (
              <li key={i}><button type="button" className={i === active ? 'on' : ''} aria-current={i === active ? 'step' : undefined} onClick={() => jump(i)}>
                {i === 0 ? 'Ira' : projects[i - 1].name}
              </button></li>
            ))}
          </ol>
        </nav>
      </div>
    </section>
  );
}
