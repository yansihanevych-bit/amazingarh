'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { getDict, langs, type Lang } from '@/content/i18n';

type Theme = 'light' | 'dark';
const EGG_DELAY = 350, EGG_VISIBLE = 3000, EGG_COOLDOWN = 8000;

export function Nav({ lang }: { lang: Lang }) {
  const t = getDict(lang);
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  const [theme, setTheme] = useState<Theme>('light');
  const [egg, setEgg] = useState<{ on: boolean; left: number; top: number }>({ on: false, left: 0, top: 0 });
  const themeBtn = useRef<HTMLButtonElement>(null);
  const eggRef = useRef<HTMLDivElement>(null);
  const eggTimers = useRef<{ show?: number; hide?: number; last: number }>({ last: -Infinity });

  useEffect(() => { setTheme(document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'); }, []);
  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll(); window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => () => { clearTimeout(eggTimers.current.show); clearTimeout(eggTimers.current.hide); }, []);

  /** The dark-mode easter egg: a tiny note from Ira beside the switch. */
  const showEgg = () => {
    const b = themeBtn.current?.getBoundingClientRect(), w = eggRef.current?.offsetWidth ?? 300, m = 16;
    if (!b) return;
    eggTimers.current.last = Date.now();
    setEgg({ on: true, left: Math.round(Math.min(Math.max(m, b.right - w + 10), window.innerWidth - w - m)), top: Math.round(b.bottom + 8) });
    eggTimers.current.hide = window.setTimeout(() => setEgg((e) => ({ ...e, on: false })), EGG_VISIBLE);
  };

  const toggleTheme = () => {
    const prev = theme, next: Theme = prev === 'dark' ? 'light' : 'dark', root = document.documentElement;
    setTheme(next);
    try { localStorage.setItem('ai-theme', next); } catch { /* ignore */ }
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const apply = () => { root.dataset.theme = next; };
    const doc = document as Document & { startViewTransition?: (cb: () => void) => { ready: Promise<void> } };
    if (!reduce && doc.startViewTransition && themeBtn.current) {
      const r = themeBtn.current.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2;
      const R = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
      doc.startViewTransition(apply).ready.then(() => {
        root.animate({ clipPath: [`circle(0 at ${x}px ${y}px)`, `circle(${R}px at ${x}px ${y}px)`] }, { duration: 900, easing: 'cubic-bezier(.65,0,.15,1)', pseudoElement: '::view-transition-new(root)' });
      }).catch(() => {});
    } else {
      root.classList.add('tx'); apply(); window.setTimeout(() => root.classList.remove('tx'), 750);
    }
    const timers = eggTimers.current;
    clearTimeout(timers.show);
    // Ira lights the way when it gets dark: only light -> dark shows the note.
    if (next === 'light') { clearTimeout(timers.hide); setEgg((e) => ({ ...e, on: false })); }
    else if (prev === 'light' && Date.now() - timers.last > EGG_COOLDOWN && !egg.on) timers.show = window.setTimeout(showEgg, EGG_DELAY);
  };

  const otherPath = (l: Lang) => pathname.replace(/^\/(en|pl)(?=\/|$)/, `/${l}`) || `/${l}`;
  const setLangCookie = (l: Lang) => { document.cookie = `lang=${l};path=/;max-age=31536000;samesite=lax`; };
  const home = `/${lang}`;

  return (
    <>
      <nav className={`nav${solid ? ' solid' : ''}`} aria-label="Main">
        <a className="mark" href={home} aria-label={t.nav.home}>amazing-<i>irchitect</i></a>
        <div className="navr">
          <button className="menu-btn" type="button" aria-expanded={open} aria-controls="menu" onClick={() => setOpen(!open)}>{open ? t.nav.close : t.nav.menu}</button>
          <ul id="menu" className={open ? 'open' : ''} onClick={() => setOpen(false)}>
            <li><a href={`${home}#work`}>{t.nav.work}</a></li>
            <li><a href={`${home}#index`}>{t.nav.index}</a></li>
            <li><a href={`${home}#about`}>{t.nav.about}</a></li>
            <li><a href={`${home}#contact`}>{t.nav.contact}</a></li>
            <li><a href={`/${lang}/tavern`} className="tav-link" data-curtain="Tavern Builder">{t.nav.tavern}</a></li>
          </ul>
          <button ref={themeBtn} className="theme" type="button" onClick={toggleTheme} aria-label={theme === 'dark' ? t.nav.toLight : t.nav.toDark}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true"><circle cx="12" cy="12" r="8" /><path d="M12 4a8 8 0 0 1 0 16z" fill="currentColor" /></svg>
          </button>
          <div className="lang" role="group" aria-label={t.nav.lang}>
            {langs.map((l) => (
              <a key={l} href={otherPath(l)} aria-current={l === lang ? 'true' : undefined} onClick={() => setLangCookie(l)} data-curtain={l.toUpperCase()}>{l.toUpperCase()}</a>
            ))}
          </div>
        </div>
      </nav>
      <div ref={eggRef} className={`egg${egg.on ? ' on' : ''}`} style={{ left: egg.left, top: egg.top }} role="status" aria-live="polite">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true"><circle cx="12" cy="12" r="3.2" /><path d="M12 3v2.5M12 18.5V21M3 12h2.5M18.5 12H21M5.6 5.6l1.8 1.8M16.6 16.6l1.8 1.8M5.6 18.4l1.8-1.8M16.6 7.4l1.8-1.8" /></svg>
        <p>{t.egg}<small>— Ira</small></p>
      </div>
    </>
  );
}
