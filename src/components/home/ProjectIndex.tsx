'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { Dict, Lang } from '@/content/i18n';
import { altOf, img, press, projects } from '@/content/projects';

type Panel = { key: string; name: string; architects: string; hour: string; year: number; meta: string; href: string; cover: string | null; alt: string; external?: boolean };
const TONES = ['terra', 'olive', 'sand', 'espresso', 'rose', 'clay'];

/** Index as an accordion of coloured columns: one opens wide, the rest stand as vertical spines. */
export function ProjectIndex({ lang, t }: { lang: Lang; t: Dict['index'] }) {
  const panels: Panel[] = [
    ...projects.map((p) => ({ key: p.slug, name: p.name, architects: p.architects, hour: p.hour[lang], year: p.year, meta: p.type[lang], href: `/${lang}/projects/${p.slug}`, cover: p.cover, alt: altOf(p, p.cover) })),
    { key: 'press', name: press.name, architects: press.architects, hour: press.hour[lang], year: press.year, meta: 'Amazing Architecture', href: press.url, cover: null, alt: '', external: true },
  ];
  const [open, setOpen] = useState(0);

  return (
    <section className="idx2" id="index" aria-label={t.title}>
      <div className="wrap ix-head">
        <div><span className="kick">{t.kicker}</span><h2 className="fade">{t.title}</h2></div>
        <p className="ix-lead fade">{t.lead}</p>
      </div>
      <div className="wrap ix-acc" role="list">
        {panels.map((p, i) => {
          const on = i === open;
          return (
            <div key={p.key} role="listitem" className={`ix-p tone-${TONES[i % TONES.length]}${on ? ' on' : ''}`} onMouseEnter={() => setOpen(i)}>
              <button type="button" className="ix-spine" aria-expanded={on} aria-controls={`ix-${p.key}`} onClick={() => setOpen(i)} onFocus={() => setOpen(i)}>
                <span className="ix-n">{String(i + 1).padStart(2, '0')}</span>
                <span className="ix-v">{p.name}</span>
                <span className="ix-plus" aria-hidden="true">+</span>
              </button>
              <div className="ix-body" id={`ix-${p.key}`} hidden={!on}>
                <div className="ix-top"><span className="ix-n">{String(i + 1).padStart(2, '0')}</span><span className="label">{p.hour} · {p.year}</span></div>
                <div className="ix-main">
                  <div className="ix-text">
                    <h3>{p.name}</h3>
                    <p className="ix-sub">{p.meta}</p>
                    <ul>
                      <li><span>{t.architects}</span>{p.architects}</li>
                      <li><span>{t.label.split(' · ')[2]}</span>{p.hour}</li>
                      <li><span>{t.label.split(' · ')[3]}</span>{p.year}</li>
                    </ul>
                    <a className="ix-go" href={p.href} {...(p.external ? { target: '_blank', rel: 'noopener noreferrer' } : { 'data-curtain': p.hour })}>{p.external ? t.read : t.view} ↗</a>
                  </div>
                  {p.cover && <figure className="ix-img"><Image src={img(p.cover)} alt={p.alt} fill sizes="(max-width: 800px) 90vw, 40vw" /></figure>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
