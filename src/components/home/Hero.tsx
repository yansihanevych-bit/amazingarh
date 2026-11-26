'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import type { Dict } from '@/content/i18n';
import { img } from '@/content/projects';
import { Rich } from '../Rich';

/** The name is the picture: amazing- / irchitect, drifting apart gently on scroll. */
export function Hero({ t }: { t: Dict['hero'] }) {
  const l1 = useRef<HTMLSpanElement>(null), l2 = useRef<HTMLSpanElement>(null), pic = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY; if (y > innerHeight * 1.4) return;
        if (l1.current) l1.current.style.transform = `translateX(${(-y * 0.06).toFixed(1)}px)`;
        if (l2.current) l2.current.style.transform = `translateX(${(y * 0.04).toFixed(1)}px)`;
        if (pic.current) pic.current.style.transform = `translateY(${(y * 0.07).toFixed(1)}px)`;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf); };
  }, []);

  return (
    <header className="hero wrap grid" id="top">
      <div className="hmeta fade"><span className="label">{t.tag}</span><span className="label">{t.meta2}</span><span className="label">{t.meta3}</span></div>
      <h1 className="wm in" aria-label="amazing-irchitect">
        <span className="ln l1" ref={l1}><span>amazing-</span></span>
        <span className="ln l2" ref={l2}><span className="it">irchitect</span></span>
      </h1>
      <figure className="hfig1 rv">
        <Image src={img('kz-1')} alt="Courtyard with pool under a slatted pergola" fill sizes="25vw" style={{ objectPosition: '50% 72%' }} />
      </figure>
      <figure className="hfig2 rv">
        <div className="fr">
          <div ref={pic} style={{ position: 'absolute', inset: '-9% 0', willChange: 'transform' }}>
            <Image src={img('pl2-6')} alt="Two-storey house among pines at blue hour, warm interior light" fill priority sizes="(max-width: 900px) 100vw, 66vw" />
          </div>
        </div>
        <figcaption>{t.fig2}</figcaption>
      </figure>
      <div className="hlead"><p className="hsub fade"><Rich text={t.sub} /></p><p className="intro fade">{t.intro}</p></div>
    </header>
  );
}
