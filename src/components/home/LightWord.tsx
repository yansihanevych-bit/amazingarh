'use client';

import { useEffect, useRef } from 'react';
import { img } from '@/content/projects';

/**
 * Signature moment: one word, the full width of the page, with a visualization inside the letters.
 * Scroll draws the word in from left to right while the picture settles and drifts inside it.
 */
export function LightWord({ word, caption, src = 'pl3-1' }: { word: string; caption: string; src?: string }) {
  const box = useRef<HTMLDivElement>(null), txt = useRef<HTMLSpanElement>(null), cap = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = txt.current!, wrap = box.current!;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const fit = () => {
      el.style.fontSize = '100px';
      el.style.fontSize = `${Math.floor((100 * wrap.clientWidth) / (el.offsetWidth || 1))}px`;
    };
    let raf = 0;
    const render = () => {
      const r = wrap.getBoundingClientRect(), vh = innerHeight;
      // 0 when the word's top enters the bottom of the screen, 1 when its centre reaches 45% height
      const k = reduce ? 1 : Math.min(1, Math.max(0, (vh - r.top) / (vh * 0.55 + r.height / 2)));
      const drift = Math.min(1, Math.max(0, 1 - (r.top + r.height) / (vh + r.height)));
      const e = 1 - Math.pow(1 - k, 3);
      el.style.clipPath = `inset(0 ${((1 - e) * 100).toFixed(2)}% 0 0)`;
      el.style.backgroundSize = `${(112 + 38 * (1 - e)).toFixed(2)}% auto`;
      el.style.backgroundPosition = `${(50 - 6 * (1 - e)).toFixed(2)}% ${(25 + drift * 55).toFixed(2)}%`;
      if (cap.current) cap.current.style.opacity = String(Math.max(0, (e - 0.7) / 0.3));
    };
    const onScroll = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(render); };
    fit(); render();
    document.fonts?.ready.then(() => { fit(); render(); }).catch(() => {});
    const ro = new ResizeObserver(() => { fit(); render(); }); ro.observe(wrap);
    addEventListener('scroll', onScroll, { passive: true });
    return () => { ro.disconnect(); removeEventListener('scroll', onScroll); cancelAnimationFrame(raf); };
  }, [word]);

  return (
    <div className="lightword wrap">
      <div className="lw-box" ref={box}>
        <span ref={txt} className="lw" style={{ backgroundImage: `url(${img(src)})` }}>{word}</span>
      </div>
      <p className="lw-cap" ref={cap}>{caption}</p>
    </div>
  );
}
