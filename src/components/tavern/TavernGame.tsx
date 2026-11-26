'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { Lang } from '@/content/i18n';
import { getDict } from '@/content/i18n';
import { ACHIEVEMENTS, BH, JOKE_AT, STORAGE, W, type Achievement } from '@/lib/tavern/config';
import { createGame, placeBlock, startGame, updateGame, type Game } from '@/lib/tavern/logic';
import { drawHouseThumb, drawScene, type Theme, type View } from '@/lib/tavern/render';
import { tavernAudio } from '@/lib/tavern/audio';

const read = <T,>(k: string, d: T): T => { try { const v = localStorage.getItem(k); return v == null ? d : (JSON.parse(v) as T); } catch { return d; } };
const write = (k: string, v: unknown) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* storage unavailable */ } };
const themeNow = (): Theme => (document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light');
const stop = (e: React.SyntheticEvent) => e.stopPropagation();

function HouseIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true"><path d="M3 20h18M6 20V11l6-5 6 5v9M10 20v-5h4v5" /></svg>;
}

export default function TavernGame({ lang }: { lang: Lang }) {
  const t = getDict(lang).tavern;
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const thumbRef = useRef<HTMLCanvasElement>(null);
  const keepRef = useRef<HTMLButtonElement>(null);
  const game = useRef<Game>(createGame());
  const view = useRef<View>({ s: 1, ox: 0, gy: 0, cam: 0 });
  const size = useRef({ cw: 0, ch: 0, base: 1 });
  const zoom = useRef({ now: 1, target: 1 });
  const queue = useRef<Achievement[]>([]);
  const toastBusy = useRef(false);
  const grandOpen = useRef(false);
  const unlocked = useRef<Set<string>>(new Set());
  const bestRef = useRef(0);
  const jokeShown = useRef(false);
  const timers = useRef<number[]>([]);

  const [phase, setPhase] = useState<'idle' | 'playing' | 'over'>('idle');
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [got, setGot] = useState<string[]>([]);
  const [music, setMusic] = useState(true);
  const [toast, setToast] = useState<Achievement | null>(null);
  const [toastOn, setToastOn] = useState(false);
  const [grand, setGrand] = useState(false);
  const [joke, setJoke] = useState(false);
  const [combo, setCombo] = useState<{ n: number; key: number } | null>(null);

  const later = (fn: () => void, ms: number) => { timers.current.push(window.setTimeout(fn, ms)); };

  /* restore saved progress */
  useEffect(() => {
    const b = read<number>(STORAGE.best, 0), a = read<string[]>(STORAGE.ach, []), m = read<boolean>(STORAGE.music, true);
    bestRef.current = b; setBest(b); unlocked.current = new Set(a); setGot(a); setMusic(m); tavernAudio().enabled = m;
  }, []);

  const nextToast = useCallback(() => {
    if (toastBusy.current || grandOpen.current || !queue.current.length) return;
    const a = queue.current.shift()!;
    if (a.grand) {
      grandOpen.current = true; game.current.paused = true; tavernAudio().play('grand'); setGrand(true);
      return;
    }
    toastBusy.current = true; tavernAudio().play('ach'); setToast(a); setToastOn(true);
    later(() => { setToastOn(false); later(() => { toastBusy.current = false; nextToast(); }, 450); }, 2700);
  }, []);

  const start = useCallback(() => {
    startGame(game.current); zoom.current = { now: 1, target: 1 }; view.current.cam = 0; jokeShown.current = false;
    setScore(0); setJoke(false); setPhase('playing');
    (document.activeElement as HTMLElement | null)?.blur?.(); // Space must drop blocks, not re-press the button
    tavernAudio().playMusic();
  }, []);

  const over = useCallback(() => {
    const au = tavernAudio(); au.play('over'); au.stopMusic();
    const g = game.current, n = g.stack.length, need = n * BH + Math.max(30, g.stack[n - 1].w * 0.5) + 50;
    zoom.current.target = Math.min(1, (view.current.gy - 40) / (need * size.current.base));
    later(() => setPhase('over'), 1100);
  }, []);

  const tap = useCallback(() => {
    const r = placeBlock(game.current);
    if (!r) return;
    if (r.type === 'miss') return over();
    tavernAudio().play(r.type === 'perfect' ? 'perfect' : 'place', r.combo);
    setScore(r.score);
    if (r.score > bestRef.current) { bestRef.current = r.score; setBest(r.score); write(STORAGE.best, r.score); }
    if (r.type === 'perfect') setCombo({ n: r.combo, key: Date.now() });
    let changed = false;
    for (const a of ACHIEVEMENTS) if (r.score >= a.n && !unlocked.current.has(a.id)) { unlocked.current.add(a.id); queue.current.push(a); changed = true; }
    if (changed) { const list = [...unlocked.current]; setGot(list); write(STORAGE.ach, list); }
    if (r.score === JOKE_AT && !jokeShown.current) { jokeShown.current = true; setJoke(true); later(() => setJoke(false), 9000); }
    nextToast();
  }, [over, nextToast]);

  const keepBuilding = () => { setGrand(false); grandOpen.current = false; game.current.paused = false; nextToast(); };

  /* draw the finished house when the grand card opens */
  useEffect(() => {
    if (!grand) return;
    if (thumbRef.current) drawHouseThumb(thumbRef.current, game.current, themeNow());
    keepRef.current?.focus();
  }, [grand]);

  /* canvas sizing, render loop, input, lifecycle */
  useEffect(() => {
    const stage = stageRef.current!, canvas = canvasRef.current!, ctx = canvas.getContext('2d')!;
    const resize = () => {
      const r = stage.getBoundingClientRect(), dpr = Math.min(2, window.devicePixelRatio || 1);
      size.current = { cw: r.width, ch: r.height, base: Math.min(r.width / (W + 70), r.height / 560, 2.2) };
      canvas.width = r.width * dpr; canvas.height = r.height * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize); ro.observe(stage);

    let raf = 0, last = 0;
    const frame = (ts: number) => {
      const dt = Math.min(0.05, (ts - (last || ts)) / 1000); last = ts;
      const g = game.current, v = view.current, { cw, ch, base } = size.current, z = zoom.current;
      updateGame(g, dt);
      const goal = g.state === 'over' ? z.target : 1;
      z.now += (goal - z.now) * Math.min(1, dt * (g.state === 'over' ? 3 : 4));
      v.s = base * z.now; v.ox = (cw - W * v.s) / 2; v.gy = ch - Math.min(80, ch * 0.12);
      const visible = (v.gy - 70) / v.s, target = g.state === 'over' ? 0 : Math.max(0, (g.stack.length + 1) * BH - visible * 0.62);
      v.cam += (target - v.cam) * Math.min(1, dt * 5);
      drawScene(ctx, cw, ch, v, g, themeNow(), ts / 1000, { roof: g.state !== 'playing', all: g.state === 'over' });
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    const onKey = (e: KeyboardEvent) => {
      if (e.code !== 'Space') return;
      const tag = (document.activeElement as HTMLElement | null)?.tagName ?? '';
      if (/INPUT|TEXTAREA|BUTTON|A/.test(tag)) return;
      e.preventDefault();
      if (game.current.state === 'playing') tap(); else if (!grandOpen.current) start();
    };
    const onVis = () => {
      const au = tavernAudio();
      if (document.hidden) { game.current.paused = true; au.stopMusic(); }
      else if (game.current.state === 'playing' && !grandOpen.current) { game.current.paused = false; au.playMusic(); }
    };
    window.addEventListener('keydown', onKey);
    document.addEventListener('visibilitychange', onVis);
    const pending = timers.current;
    return () => {
      cancelAnimationFrame(raf); ro.disconnect();
      window.removeEventListener('keydown', onKey); document.removeEventListener('visibilitychange', onVis);
      pending.forEach(clearTimeout); tavernAudio().stopMusic();
    };
  }, [tap, start]);

  const toggleMusic = () => {
    const on = !music, au = tavernAudio();
    au.enabled = on; setMusic(on); write(STORAGE.music, on);
    if (on && game.current.state === 'playing') au.playMusic(); else au.stopMusic();
  };

  const achList = (
    <ul>
      {ACHIEVEMENTS.map((a) => {
        const on = got.includes(a.id);
        return <li key={a.id} className={on ? 'on' : ''} title={on ? a.d[lang] : t.locked}><b>{a.n}</b><span>{on ? a.name : '· · ·'}</span></li>;
      })}
    </ul>
  );

  return (
    <div className={`tv-stage${phase === 'playing' ? ' playing' : ''}`} ref={stageRef} onPointerDown={(e) => { if (e.button <= 0) tap(); }}>
      <canvas ref={canvasRef} aria-label="Tavern Builder" />
      <div className="tv-hud" onPointerDown={stop}>
        <div className="tv-score"><span className="label">{t.built}</span><b>{score}</b></div>
        <div className="tv-score"><span className="label">{t.best}</span><b>{best}</b></div>
        <button className="tv-music" type="button" aria-pressed={music} onClick={toggleMusic}>{music ? t.musicOn : t.musicOff}</button>
      </div>
      {combo && <div key={combo.key} className="tv-combo on" aria-hidden="true">{t.perfect}{combo.n > 1 ? ` ×${combo.n}` : ''}</div>}

      {phase === 'idle' && (
        <div className="tv-panel in" onPointerDown={stop}>
          <h1 className="tv-title">{t.title}</h1>
          <p>{t.sub}</p>
          <button className="tv-btn" type="button" onClick={start}>{t.start}</button>
          <p className="tv-how">{t.how}</p>
          <div className="tv-achs"><span className="label">{t.ach}</span>{achList}</div>
          <a className="tv-back" href={`/${lang}`}>{t.back}</a>
        </div>
      )}

      {phase === 'over' && (
        <div className="tv-panel in" id="tvOver" onPointerDown={stop}>
          <span className="label">{t.score}</span>
          <div className="tv-big">{score}</div>
          <h2 className="tv-title">{t.overT}</h2>
          <p className="tv-cap">{t.overTr}</p>
          <p className="tv-bestline">{t.best}: <b>{best}</b></p>
          <div className="tv-achs"><span className="label">{t.ach}</span>{achList}</div>
          <button className="tv-btn" type="button" onClick={start}>{t.again}</button>
        </div>
      )}

      <div className={`tv-toast${toastOn ? ' on' : ''}`} role="status" aria-live="polite">
        {toast && (<>
          <span className="tv-ic"><HouseIcon /></span>
          <div><span className="label">{t.unlocked}</span><strong>{toast.name}</strong><em>{toast.d[lang]}</em><small>{t.placed.replace('{n}', String(toast.n))}</small></div>
        </>)}
      </div>

      {grand && (
        <div className="tv-modal in" role="dialog" aria-modal="true" aria-labelledby="tv100t" onPointerDown={stop}>
          <div className="tv-card">
            <span className="label">{t.unlocked}</span>
            <h2 className="tv-title" id="tv100t">Amazing Irchitect</h2>
            <canvas ref={thumbRef} width={320} height={300} aria-hidden="true" />
            <p className="tv-cap">{t.g100}</p>
            <button className="tv-btn" type="button" ref={keepRef} onClick={keepBuilding}>{t.keep}</button>
          </div>
        </div>
      )}

      {joke && (
        <div className="tv-joke in" role="status" onPointerDown={stop}>
          <button className="tv-x" type="button" onClick={() => setJoke(false)}><span className="sr">{t.close}</span>×</button>
          <p className="tv-jt">{t.j101}</p>
          <p className="tv-cap">{t.j101b}</p>
        </div>
      )}
    </div>
  );
}
