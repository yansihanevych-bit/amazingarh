'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { Dict, Lang } from '@/content/i18n';
import { contactInfo } from '@/content/i18n';
import { img } from '@/content/projects';
import { Rich } from './Rich';

type Status = { kind: 'idle' | 'sending' | 'sent' | 'error' | 'fallback'; href?: string };

export function Contact({ lang, t, tag }: { lang: Lang; t: Dict['contact']; tag: string }) {
  const [status, setStatus] = useState<Status>({ kind: 'idle' });
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try { await navigator.clipboard.writeText(contactInfo.email); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch { /* clipboard blocked */ }
  };

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const data = { name: String(f.get('name') ?? '').trim(), studio: String(f.get('studio') ?? '').trim(), email: String(f.get('email') ?? '').trim(), message: String(f.get('message') ?? '').trim(), website: String(f.get('website') ?? ''), lang };
    if (!data.name || !data.message || !/^\S+@\S+\.\S+$/.test(data.email)) { setStatus({ kind: 'error' }); return; }
    setStatus({ kind: 'sending' });
    const body = `${data.message}\n\n${data.name}${data.studio ? ' · ' + data.studio : ''}\n${data.email}`;
    const mailto = `mailto:${contactInfo.email}?subject=${encodeURIComponent(`${t.subject} · ${data.studio || data.name}`)}&body=${encodeURIComponent(body)}`;
    try {
      const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      if (res.ok) { setStatus({ kind: 'sent' }); (e.target as HTMLFormElement).reset(); return; }
      setStatus({ kind: 'fallback', href: mailto });
    } catch {
      setStatus({ kind: 'fallback', href: mailto });
    }
  };

  return (
    <section className="contact dark" id="contact" aria-label="Contact">
      <div className="wrap grid" style={{ rowGap: 40 }}>
        <h2 className="fade"><Rich text={t.title} /></h2>
        <div className="ci fade">
          <span className="label">{t.email}</span><a href={`mailto:${contactInfo.email}`}>{contactInfo.email}</a>
          <span className="label">{t.phone}</span><a href={contactInfo.phoneHref}>{contactInfo.phone}</a>
          <span className="label">Behance</span><a href={contactInfo.behance} target="_blank" rel="noopener noreferrer">{contactInfo.behanceLabel}</a>
          <button className="btn ghost" type="button" onClick={copy}>{copied ? t.copied : t.copy}</button>
        </div>
        <form className="fade" onSubmit={submit} noValidate>
          <div className="fld"><label className="label" htmlFor="f-name">{t.name}</label><input id="f-name" name="name" autoComplete="name" required /></div>
          <div className="fld"><label className="label" htmlFor="f-studio">{t.studio}</label><input id="f-studio" name="studio" autoComplete="organization" /></div>
          <div className="fld full"><label className="label" htmlFor="f-email">{t.email2}</label><input id="f-email" name="email" type="email" autoComplete="email" required /></div>
          <div className="fld full"><label className="label" htmlFor="f-msg">{t.msg}</label><textarea id="f-msg" name="message" required placeholder={t.ph} /></div>
          <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: 'absolute', left: '-9999px' }} />
          <button className="btn" type="submit" disabled={status.kind === 'sending'}>{status.kind === 'sending' ? t.sending : t.send}</button>
          <p className="formnote" role="status">
            {status.kind === 'error' && t.err}
            {status.kind === 'sent' && t.sent}
            {status.kind === 'fallback' && <><a href={status.href}>{t.fallback}</a>{t.or}{contactInfo.email}</>}
          </p>
        </form>
        <figure className="img rv" style={{ aspectRatio: '1/3' }}><Image src={img('znk-2')} alt="" fill sizes="10vw" /></figure>
        <div className="foot"><span>© {new Date().getFullYear()} amazing-irchitect · {tag}</span><span>{t.credit}</span></div>
      </div>
    </section>
  );
}
