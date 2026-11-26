'use client';

import { useEffect, useRef, useState } from 'react';
import type { Dict, Lang } from '@/content/i18n';
import { img, press, projects } from '@/content/projects';
import { Rich } from '../Rich';

type Row = { key: string; name: string; architects: string; hour: string; year: number; href: string; cover: string | null; external?: boolean; curtain?: string };

/** Editorial index; on desktop a large preview follows the cursor softly, on touch a tap opens the row. */
export function ProjectIndex({ lang, t }: { lang: Lang; t: Dict['index'] }) {
  const rows: Row[] = [
    ...projects.map((p) => ({ key: p.slug, name: p.name, architects: p.architects, hour: p.hour[lang], year: p.year, href: `/${lang}/projects/${p.slug}`, cover: p.cover, curtain: p.hour[lang] })),
    { key: 'press', name: press.name, architects: press.architects, hour: press.hour[lang], year: press.year, href: press.url, cover: null, external: true },
  ];
  const peek = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<Row | null>(null);
  const [open, setOpen] = useState<string | null>(null);
  const [fine, setFine] = useState(true);
  const pos = useRef({ x: 0, y: 0, tx: 0, ty: 0, raf: 0 });

  useEffect(() => { setFine(matchMedia('(pointer: fine)').matches); }, []);
  useEffect(() => {
    const p = pos.current;
    if (!active) { cancelAnimationFrame(p.raf); p.raf = 0; return; }
    const loop = () => {
      p.x += (p.tx - p.x) * 0.14; p.y += (p.ty - p.y) * 0.14;
      if (peek.current) { peek.current.style.left = `${p.x}px`; peek.current.style.top = `${p.y}px`; }
      p.raf = requestAnimationFrame(loop);
    };
    if (!p.raf) loop();
    return () => { cancelAnimationFrame(p.raf); p.raf = 0; };
  }, [active]);

  return (
    <section className="idx wrap" id="index" aria-label={t.title}>
      <div className="shead" style={{ paddingBottom: 40 }}><h2 className="fade">{t.title}</h2><span className="label fade">{t.label}</span></div>
      <div className="rows">
        {rows.map((r) => (
          <a
            key={r.key}
            className={`row fade${open === r.key ? ' open' : ''}`}
            href={r.href}
            data-curtain={r.curtain}
            data-hold={!fine && r.cover && open !== r.key ? '1' : undefined}
            {...(r.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            onMouseEnter={(e) => { if (!fine) return; const p = pos.current; p.x = p.tx = e.clientX + 180; p.y = p.ty = e.clientY; setActive(r); }}
            onMouseMove={(e) => { pos.current.tx = e.clientX + 180; pos.current.ty = e.clientY; }}
            onMouseLeave={() => setActive(null)}
            onClick={(e) => { if (!fine && r.cover && open !== r.key) { e.preventDefault(); e.stopPropagation(); setOpen(r.key); } }}
          >
            <span className="n">{r.name}{r.external && <em>{t.press}</em>}</span>
            <span className="s">{r.architects}</span>
            <span className="s h it" style={{ fontSize: 18 }}>{r.hour}</span>
            <span className="y">{r.year}</span>
            {r.cover && <span className="row-img">{/* eslint-disable-next-line @next/next/no-img-element */}<img src={img(r.cover)} alt="" loading="lazy" /></span>}
          </a>
        ))}
      </div>
      <div ref={peek} className={`peek${active ? ' on' : ''}`} aria-hidden="true">
        {active?.cover
          ? /* eslint-disable-next-line @next/next/no-img-element */ <img src={img(active.cover)} alt="" />
          : active && <div className="pub"><Rich text={t.pub} /></div>}
      </div>
    </section>
  );
}
