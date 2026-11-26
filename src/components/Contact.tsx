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
  const [scope, setScope] = useState<string | null>(null);

  const copy = async () => {
    try { await navigator.clipboard.writeText(contactInfo.email); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch { /* clipboard blocked */ }
  };

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget, f = new FormData(form);
    const msg = String(f.get('message') ?? '').trim();
    const data = { name: String(f.get('name') ?? '').trim(), studio: String(f.get('studio') ?? '').trim(), email: String(f.get('email') ?? '').trim(), message: scope ? `[${t.scope}: ${scope}]\n${msg}` : msg, website: String(f.get('website') ?? ''), lang };
    if (!data.name || !msg || !/^\S+@\S+\.\S+$/.test(data.email)) { setStatus({ kind: 'error' }); return; }
    setStatus({ kind: 'sending' });
    const body = `${data.message}\n\n${data.name}${data.studio ? ' · ' + data.studio : ''}\n${data.email}`;
    const mailto = `mailto:${contactInfo.email}?subject=${encodeURIComponent(`${t.subject} · ${data.studio || data.name}`)}&body=${encodeURIComponent(body)}`;
    try {
      const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      if (res.ok) { setStatus({ kind: 'sent' }); form.reset(); setScope(null); return; }
      setStatus({ kind: 'fallback', href: mailto });
    } catch { setStatus({ kind: 'fallback', href: mailto }); }
  };

  return (
    <section className="contact2" id="contact" aria-label="Contact">
      <div className="wrap">
        <span className="kick">[ + ] {t.kicker}</span>
        <h2 className="ct-title fade"><Rich text={t.title} /></h2>
        <div className="ct-g">
          <div className="ct-left">
            <p className="ct-intro">{t.intro}</p>
            <div className="ct-card">
              <figure><Image src={img('ira')} alt="Iryna Riasnianska" fill sizes="180px" /></figure>
              <div><span className="label">{t.role}</span><ul>{t.bullets.map((b) => <li key={b}>{b}</li>)}</ul></div>
            </div>
            <a className="ct-mail" href={`mailto:${contactInfo.email}`}>{contactInfo.email}</a>
            <div className="ct-links">
              <button type="button" onClick={copy}>{copied ? t.copied : t.copy}</button>
              <a href={contactInfo.phoneHref}>{contactInfo.phone}</a>
              <a href={contactInfo.behance} target="_blank" rel="noopener noreferrer">Behance</a>
            </div>
          </div>
          <form className="ct-form" onSubmit={submit} noValidate>
            <span className="label">— {t.write}</span>
            <div className="ct-row">
              <label className="ct-f"><span className="label">{t.name} *</span><input name="name" autoComplete="name" required /></label>
              <label className="ct-f"><span className="label">{t.email2} *</span><input name="email" type="email" autoComplete="email" required /></label>
            </div>
            <label className="ct-f"><span className="label">{t.studio}</span><input name="studio" autoComplete="organization" /></label>
            <div className="ct-f"><span className="label" id="scope-l">{t.scope}</span>
              <div className="ct-chips" role="group" aria-labelledby="scope-l">
                {t.scopes.map((s) => <button key={s} type="button" aria-pressed={scope === s} className={scope === s ? 'on' : ''} onClick={() => setScope(scope === s ? null : s)}>{s}</button>)}
              </div>
            </div>
            <label className="ct-f"><span className="label">{t.msg} *</span><textarea name="message" required placeholder={t.ph} /></label>
            <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: 'absolute', left: '-9999px' }} />
            <button className="cta" type="submit" disabled={status.kind === 'sending'}>{status.kind === 'sending' ? t.sending : t.send} <span aria-hidden="true">→</span></button>
            <p className="formnote" role="status">
              {status.kind === 'error' && t.err}
              {status.kind === 'sent' && t.sent}
              {status.kind === 'fallback' && <><a href={status.href}>{t.fallback}</a>{t.or}{contactInfo.email}</>}
            </p>
          </form>
        </div>
        <div className="ct-foot"><span>© {new Date().getFullYear()} amazing-irchitect · {tag}</span><span>{t.credit}</span></div>
      </div>
    </section>
  );
}
