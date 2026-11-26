'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

/**
 * Curtain page transitions for internal links (plain <a> tags).
 * Same-page anchors scroll normally; other pages get a short blush curtain.
 * Labels come from data-curtain on the link.
 */
export function Transitions() {
  const router = useRouter();
  const pathname = usePathname();
  const [state, setState] = useState<'idle' | 'up' | 'out'>('idle');
  const [label, setLabel] = useState('amazing-irchitect');
  const going = useRef(false);
  const prefetched = useRef(new Set<string>());

  useEffect(() => {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const internal = (e: Event) => {
      const a = (e.target as Element | null)?.closest?.('a');
      if (!a || a.target || a.hasAttribute('download')) return null;
      const url = new URL(a.href, location.href);
      return url.origin === location.origin && !url.pathname.startsWith('/api') ? { a, url } : null;
    };
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const hit = internal(e); if (!hit) return;
      const { a, url } = hit;
      if (a.dataset.hold) return; // the link wants a first tap for itself (touch preview)
      if (url.pathname === location.pathname) return; // same page: native anchor scroll
      e.preventDefault();
      const href = url.pathname + url.search + url.hash;
      if (reduce) { router.push(href); return; }
      setLabel(a.dataset.curtain || 'amazing-irchitect');
      going.current = true; setState('up');
      window.setTimeout(() => router.push(href), 650);
    };
    const onOver = (e: PointerEvent) => {
      const hit = internal(e); if (!hit) return;
      const p = hit.url.pathname;
      if (p !== location.pathname && !prefetched.current.has(p)) { prefetched.current.add(p); router.prefetch(p); }
    };
    document.addEventListener('click', onClick, true);
    document.addEventListener('pointerover', onOver, { passive: true });
    return () => { document.removeEventListener('click', onClick, true); document.removeEventListener('pointerover', onOver); };
  }, [router]);

  useEffect(() => {
    if (!going.current) return;
    going.current = false;
    if (!location.hash) window.scrollTo(0, 0);
    setState('out');
    const t = window.setTimeout(() => setState('idle'), 950);
    return () => window.clearTimeout(t);
  }, [pathname]);

  return (
    <div className={`curtain${state === 'idle' ? '' : ' ' + state}`} aria-hidden="true">
      <span>{label}</span>
    </div>
  );
}
