'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Opening screen: the name set large, a 0–100% counter driven by real loading
 * (fonts + first images), then the lines lift and the panel wipes away.
 * Shown once per session; skipped instantly when already seen (see boot script).
 */
export function Preloader() {
  const [phase, setPhase] = useState<'load' | 'exit' | 'done'>('load');
  const [n, setN] = useState(0);
  const target = useRef(0);

  useEffect(() => {
    const root = document.documentElement;
    if (root.classList.contains('seen')) { setPhase('done'); return; }
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.body.style.overflow = 'hidden';
    const start = performance.now(), MIN = reduce ? 300 : 1500, MAX = 3200;

    const imgs = Array.from(document.querySelectorAll<HTMLImageElement>('img')).filter((im) => im.loading !== 'lazy').slice(0, 4);
    const tasks: Promise<unknown>[] = [document.fonts?.ready ?? Promise.resolve(), ...imgs.map((im) => (im.complete ? Promise.resolve() : new Promise((r) => { im.addEventListener('load', r, { once: true }); im.addEventListener('error', r, { once: true }); })))];
    let done = 0;
    tasks.forEach((t) => t.then(() => { done++; target.current = Math.max(target.current, Math.round((done / tasks.length) * 100)); }));

    let raf = 0, shown = 0, finished = false;
    const tick = (now: number) => {
      const el = now - start;
      const timeCap = Math.min(100, (el / MIN) * 100);          // never faster than MIN
      const goal = el > MAX ? 100 : Math.min(target.current, timeCap);
      shown += (goal - shown) * 0.12;
      if (goal - shown < 0.6) shown = goal;
      setN(Math.floor(shown));
      if (shown >= 100 && !finished) {
        finished = true;
        try { sessionStorage.setItem('ai-seen', '1'); } catch { /* ignore */ }
        window.setTimeout(() => setPhase('exit'), reduce ? 0 : 250);
        window.setTimeout(() => { setPhase('done'); document.body.style.overflow = ''; root.classList.add('seen'); }, reduce ? 300 : 1500);
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); document.body.style.overflow = ''; };
  }, []);

  if (phase === 'done') return null;
  return (
    <div className={`preloader ${phase}`} aria-hidden="true">
      <div className="pl-top"><span className="label">Architecture by Ira</span><span className="label">Warsaw — Poland</span></div>
      <div className="pl-name">
        <span className="ln"><span>amazing-</span></span>
        <span className="ln"><span className="it">irchitect</span><sup>®</sup></span>
      </div>
      <div className="pl-count"><span>{n}</span>%</div>
      <div className="pl-bar"><i style={{ transform: `scaleX(${n / 100})` }} /></div>
    </div>
  );
}
