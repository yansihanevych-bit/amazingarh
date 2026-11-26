'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import type { Dict, Lang } from '@/content/i18n';
import { dayStory, img } from '@/content/projects';
import { Rich } from '../Rich';

/* The colour of the air for each hour: a faint tint laid over the frame during the change. */
const TINT: Record<string, string> = { noon: '255,236,190', aft: '255,214,160', golden: '255,170,90', over: '170,178,185', canopy: '170,200,150', dusk: '255,150,90', blue: '70,100,190', night: '20,24,50' };

/**
 * "From noon to night": a pinned, full-screen sequence. Scrolling moves the hour forward;
 * each new light rises over the previous one like a change of atmosphere, not a slide.
 */
export function DayStory({ t }: { lang: Lang; t: Dict['story']; view: string }) {
  const section = useRef<HTMLElement>(null);
  const frames = useRef<(HTMLDivElement | null)[]>([]);
  const tint = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const N = dayStory.length;

  useEffect(() => {
    const sec = section.current!;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0, last = -1;
    const render = () => {
      const r = sec.getBoundingClientRect(), span = r.height - innerHeight;
      const p = span > 0 ? Math.min(1, Math.max(0, -r.top / span)) : 0;
      const f = p * (N - 1);
      frames.current.forEach((el, i) => {
        if (!el) return;
        let k = i === 0 ? 1 : Math.min(1, Math.max(0, f - (i - 1)));
        if (reduce) k = k > 0.5 ? 1 : 0;
        // crossfade: the next light dissolves in over the previous one
        const e = k * k * (3 - 2 * k);
        el.style.opacity = e.toFixed(3);
        const img = el.firstElementChild as HTMLElement | null;
        if (img) img.style.transform = `scale(${(1.06 - 0.06 * e).toFixed(4)})`;
      });
      const i0 = Math.floor(f), mix = f - i0, a = dayStory[i0], b = dayStory[Math.min(N - 1, i0 + 1)];
      if (tint.current && !reduce) {
        const strength = Math.sin(mix * Math.PI) * 0.28;
        tint.current.style.background = `linear-gradient(180deg, rgba(${TINT[b.hour]},${strength.toFixed(3)}), rgba(${TINT[a.hour]},${(strength * 0.6).toFixed(3)}))`;
      }
      if (bar.current) bar.current.style.transform = `scaleX(${p.toFixed(4)})`;
      const idx = Math.min(N - 1, Math.round(f));
      if (idx !== last) { last = idx; setActive(idx); }
    };
    const onScroll = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(render); };
    render();
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onScroll);
    return () => { removeEventListener('scroll', onScroll); removeEventListener('resize', onScroll); cancelAnimationFrame(raf); };
  }, [N]);

  const jump = (i: number) => {
    const sec = section.current; if (!sec) return;
    const span = sec.offsetHeight - innerHeight, top = sec.getBoundingClientRect().top + scrollY;
    scrollTo({ top: top + (span * i) / (N - 1) + 2, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  };


  return (
    <section className="daylight" id="hours" ref={section} style={{ height: `${N * 120 + 20}svh` }} aria-label={t.label}>
      <div className="dl-stage">
        {dayStory.map((s, i) => {
          return (
            <div key={s.src + i} className="dl-frame" ref={(el) => { frames.current[i] = el; }} style={i === 0 ? undefined : { opacity: 0 }} aria-hidden={i !== active}>
              <Image src={img(s.src)} alt={s.alt} fill sizes="100vw" quality={90} loading={i < 2 ? 'eager' : 'lazy'} style={{ objectPosition: s.pos ?? '50% 50%' }} />
            </div>
          );
        })}
        <div className="dl-tint" ref={tint} aria-hidden="true" />
        <div className="dl-scrim" aria-hidden="true" />
        <div className="dl-head wrap">
          <h2><Rich text={t.title} /></h2>
          <span className="label">{t.label}</span>
        </div>
        <div className="dl-caption wrap">
          <span className="dl-count">{String(active + 1).padStart(2, '0')} / {String(N).padStart(2, '0')}</span>
          <p className="dl-hours" aria-live="polite">
            {dayStory.map((d, i) => (
              <span key={d.hour} className={`dl-hour${i === active ? ' on' : i < active ? ' past' : ''}`} aria-hidden={i !== active}>{t.hours[d.hour]}</span>
            ))}
          </p>
          <p className="dl-credit">{t.credit}</p>
        </div>
        <div className="dl-time wrap">
          <div className="dl-track"><div className="dl-bar" ref={bar} /></div>
          <ol>
            {dayStory.map((s, i) => (
              <li key={s.src + i}><button type="button" className={i === active ? 'on' : ''} onClick={() => jump(i)} aria-current={i === active ? 'step' : undefined}>{t.hours[s.hour]}</button></li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
