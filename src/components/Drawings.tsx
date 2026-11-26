'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import type { Lang } from '@/content/i18n';
import { img, type Drawing } from '@/content/projects';
import { Rich } from './Rich';

type T = { drawings: string; drawingsL: string; peelT: string; peelSteps: string[]; open: string; close: string };

/** "Roof off" sequence: steps through axonometric layers, auto-advancing while in view. */
function Peel({ frames, t, name }: { frames: string[]; t: T; name: string }) {
  const [i, setI] = useState(0);
  const [auto, setAuto] = useState(true);
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!auto || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let visible = false, timer = 0;
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0.4 });
    if (box.current) io.observe(box.current);
    timer = window.setInterval(() => { if (visible) setI((x) => (x + 1) % frames.length); }, 1700);
    return () => { io.disconnect(); clearInterval(timer); };
  }, [auto, frames.length]);
  return (
    <div className="peel wrap" ref={box}>
      <div className="peel-head"><h3 className="fade"><Rich text={t.peelT} /></h3><span className="label">{name}</span></div>
      <div className="peel-sheet">
        {frames.map((f, k) => (
          <Image key={f} src={img(f)} alt={k === i ? `${name}: ${t.peelSteps[k]}` : ''} width={1920} height={1358} sizes="(max-width: 900px) 100vw, 80vw" className={k === i ? 'on' : ''} />
        ))}
      </div>
      <div className="peel-steps" role="group" aria-label={t.peelT.replace(/<[^>]+>/g, '')}>
        {frames.map((f, k) => (
          <button key={f} type="button" className={k === i ? 'on' : ''} aria-pressed={k === i} onClick={() => { setAuto(false); setI(k); }}>
            <span>0{k + 1}</span>{t.peelSteps[k]}
          </button>
        ))}
      </div>
    </div>
  );
}

/** Drawings on paper: contained, never cropped. Click to open full screen. */
export function Drawings({ drawings, peel, lang, t, name }: { drawings?: Drawing[]; peel?: string[]; lang: Lang; t: T; name: string }) {
  const dlg = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState<Drawing | null>(null);
  useEffect(() => { if (open) dlg.current?.showModal(); }, [open]);
  if (!drawings?.length && !peel?.length) return null;
  return (
    <section className="drawings" aria-label={t.drawings}>
      <div className="wrap shead"><h2 className="fade">{t.drawings}</h2><span className="label fade">{t.drawingsL}</span></div>
      {peel && <Peel frames={peel} t={t} name={name} />}
      {drawings && (
        <div className={`dr-grid wrap n${drawings.length}`}>
          {drawings.map((d, k) => (
            <figure key={d.src} className={`dr fade${k === 0 && drawings.length > 2 ? ' big' : ''}`}>
              <button type="button" onClick={() => setOpen(d)} aria-label={`${t.open}: ${d.label[lang]}`}>
                <Image src={img(d.src)} alt={`${name}: ${d.label[lang]}`} width={d.w} height={d.h} sizes="(max-width: 900px) 100vw, 60vw" />
              </button>
              <figcaption><span>0{k + 1}</span>{d.label[lang]}</figcaption>
            </figure>
          ))}
        </div>
      )}
      <dialog ref={dlg} className="dr-dlg" onClose={() => setOpen(null)} onClick={(e) => { if (e.target === dlg.current) dlg.current?.close(); }}>
        {open && (<>
          <button type="button" className="dr-x" onClick={() => dlg.current?.close()}>{t.close} ×</button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={img(open.src)} alt={`${name}: ${open.label[lang]}`} />
          <p>{open.label[lang]}</p>
        </>)}
      </dialog>
    </section>
  );
}
