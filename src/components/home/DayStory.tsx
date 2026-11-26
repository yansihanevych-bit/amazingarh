'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import type { Dict, Lang } from '@/content/i18n';
import { altOf, dayStory, getProject, img } from '@/content/projects';
import { Rich } from '../Rich';

/** "From noon to night": vertical scroll drives a horizontal track. Swipeable on small screens. */
export function DayStory({ lang, t }: { lang: Lang; t: Dict['story'] }) {
  const section = useRef<HTMLElement>(null), track = useRef<HTMLDivElement>(null);
  const [swipe, setSwipe] = useState(false);

  useEffect(() => {
    const sec = section.current!, tr = track.current!;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let dist = 0, raf = 0;
    const onScroll = () => {
      if (sec.classList.contains('swipe')) return;
      const r = sec.getBoundingClientRect(), span = r.height - innerHeight;
      const k = span > 0 ? Math.min(1, Math.max(0, -r.top / span)) : 0;
      tr.style.transform = `translate3d(${(-k * dist).toFixed(1)}px,0,0)`;
    };
    const setup = () => {
      const sw = innerWidth < 760 || reduce;
      setSwipe(sw); sec.classList.toggle('swipe', sw);
      if (sw) { sec.style.height = ''; tr.style.transform = ''; return; }
      dist = Math.max(0, tr.scrollWidth - innerWidth);
      sec.style.height = `${dist + innerHeight}px`;
      onScroll();
    };
    const scroll = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(onScroll); };
    setup();
    window.addEventListener('resize', setup);
    window.addEventListener('scroll', scroll, { passive: true });
    return () => { window.removeEventListener('resize', setup); window.removeEventListener('scroll', scroll); cancelAnimationFrame(raf); };
  }, []);

  const move = (dir: number) => {
    const tr = track.current; if (!tr) return;
    tr.scrollBy({ left: dir * tr.clientWidth * 0.8, behavior: 'smooth' });
  };

  return (
    <section className="hstory" id="hours" ref={section} aria-label={t.label}>
      <div className="hs-sticky">
        <div className="hs-head wrap">
          <h2><Rich text={t.title} /></h2>
          <span className="label">{t.label}</span>
          {swipe && (
            <span className="hs-nav">
              <button type="button" aria-label="Previous" onClick={() => move(-1)}>←</button>
              <button type="button" aria-label="Next" onClick={() => move(1)}>→</button>
            </span>
          )}
        </div>
        <div className="hs-track" ref={track} tabIndex={swipe ? 0 : -1} onKeyDown={(e) => { if (e.key === 'ArrowRight') move(1); if (e.key === 'ArrowLeft') move(-1); }}>
          {dayStory.map((s, i) => {
            const p = getProject(s.slug)!;
            return (
              <a key={s.src + i} className={`hs-item ${s.shape === 'wide' ? 'w' : 'p'}`} href={`/${lang}/projects/${p.slug}`} data-curtain={p.hour[lang]}>
                <figure><Image src={img(s.src)} alt={altOf(p, s.src)} fill sizes="(max-width: 760px) 85vw, 60vw" /></figure>
                <div className="hs-cap"><b>{t.hours[s.hour]}</b><span>0{i + 1} · {p.name}</span></div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
