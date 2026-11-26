'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import type { Dict } from '@/content/i18n';
import { img } from '@/content/projects';
import { Rich } from '../Rich';

/** Process as a timeline: pictures above, a ruler with diamonds, steps light up as you scroll. */
export function ProcessTimeline({ t, images }: { t: Dict['process']; images: [string, string][] }) {
  const ref = useRef<HTMLElement>(null);
  const [done, setDone] = useState(0);
  const N = t.steps.length;
  useEffect(() => {
    const el = ref.current!;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { setDone(N); return; }
    let raf = 0;
    const r = () => {
      const b = el.getBoundingClientRect();
      const k = Math.min(1, Math.max(0, (innerHeight * 0.85 - b.top) / (b.height * 0.75)));
      setDone(Math.max(1, Math.ceil(k * N)));
    };
    const on = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(r); };
    r(); addEventListener('scroll', on, { passive: true });
    return () => { removeEventListener('scroll', on); cancelAnimationFrame(raf); };
  }, [N]);
  const pad = (n: number) => String(n).padStart(2, '0');
  return (
    <section className="proc2" ref={ref} aria-label={t.kicker}>
      <div className="wrap">
        <div className="pc-head">
          <div><span className="kick">{t.kicker}</span><h2><Rich text={t.title} /></h2></div>
          <div className="pc-count" aria-hidden="true"><span>{pad(done)}</span><span className="outline">/{pad(N)}</span></div>
        </div>
        <ol className="pc-steps" style={{ ['--n' as string]: N }}>
          {t.steps.map(([word, h, p], i) => (
            <li key={word} className={i < done ? 'on' : ''}>
              <figure className="pc-img"><Image src={img(images[i][0])} alt={images[i][1]} fill sizes="(max-width: 800px) 90vw, 25vw" /></figure>
              <div className="pc-rule" aria-hidden="true"><i /></div>
              <div className="pc-num"><span className={i === done - 1 ? 'solid' : 'outline'}>{pad(i + 1)}</span><span className="label">{word}</span></div>
              <h3>{h}</h3>
              <p>{p}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
