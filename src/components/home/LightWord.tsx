'use client';

import { useEffect, useRef } from 'react';
import { img } from '@/content/projects';

/**
 * Typography as an image frame: one oversized word, filled with a visualization.
 * The word is fitted to the full width, and the picture drifts slowly inside the letters on scroll.
 */
export function LightWord({ word, caption, src = 'pl3-1' }: { word: string; caption: string; src?: string }) {
  const box = useRef<HTMLDivElement>(null), txt = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = txt.current!, wrap = box.current!;
    const fit = () => {
      el.style.fontSize = '100px';
      const w = wrap.clientWidth, sw = el.offsetWidth || 1;
      el.style.fontSize = `${Math.floor((100 * w) / sw)}px`;
    };
    fit();
    document.fonts?.ready.then(fit).catch(() => {});
    const ro = new ResizeObserver(fit); ro.observe(wrap);
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = wrap.getBoundingClientRect(), k = Math.min(1, Math.max(0, 1 - (r.top + r.height) / (innerHeight + r.height)));
        el.style.backgroundPosition = `50% ${(20 + k * 60).toFixed(1)}%`;
      });
    };
    if (!reduce) { onScroll(); addEventListener('scroll', onScroll, { passive: true }); }
    return () => { ro.disconnect(); removeEventListener('scroll', onScroll); cancelAnimationFrame(raf); };
  }, [word]);

  return (
    <div className="lightword wrap">
      <div className="lw-box ln" ref={box}>
        <span ref={txt} className="lw" style={{ backgroundImage: `url(${img(src)})` }}>{word}</span>
      </div>
      <p className="lw-cap fade">{caption}</p>
    </div>
  );
}
