import { BH, GRAV, PERFECT, W, W0 } from './config';

export type Block = { x: number; w: number; t: number; drop?: number };
export type Moving = { x: number; w: number; min: number; max: number; dir: 1 | -1; speed: number };
export type Falling = { x: number; w: number; y: number; lvl: number; vx: number; vy: number; r: number; vr: number; life: number };
export type Fx =
  | { kind: 'ring'; x: number; w: number; lvl: number; t: number; dur: number }
  | { kind: 'dust'; x: number; y: number; vx: number; vy: number; lvl: number; t: number; dur: number };
export type Phase = 'idle' | 'playing' | 'over';
export type Game = { state: Phase; stack: Block[]; moving: Moving | null; score: number; combo: number; falling: Falling[]; fx: Fx[]; paused: boolean };
export type PlaceResult = { type: 'miss' } | { type: 'perfect' | 'cut'; score: number; combo: number };

/** Gentle start, ramps up with height. Units per second. */
export const speedFor = (lvl: number) => 92 + Math.min(lvl, 90) * 2.1;

export function createGame(): Game {
  return { state: 'idle', stack: [{ x: (W - W0) / 2, w: W0, t: 1 }], moving: null, score: 0, combo: 0, falling: [], fx: [], paused: false };
}

function spawn(g: Game) {
  const top = g.stack[g.stack.length - 1], lvl = g.stack.length, c = top.x + top.w / 2, fromLeft = lvl % 2 === 1;
  const span = 120 + Math.min(lvl, 40) * 1.5;
  g.moving = { w: top.w, min: c - span - top.w / 2, max: c + span - top.w / 2, x: fromLeft ? c - span - top.w / 2 : c + span - top.w / 2, dir: fromLeft ? 1 : -1, speed: speedFor(lvl) };
}

export function startGame(g: Game) {
  Object.assign(g, createGame());
  g.state = 'playing';
  spawn(g);
}

export function updateGame(g: Game, dt: number) {
  if (g.state === 'playing' && g.moving && !g.paused) {
    const m = g.moving;
    m.x += m.dir * m.speed * dt;
    if (m.x > m.max) { m.x = m.max; m.dir = -1; } else if (m.x < m.min) { m.x = m.min; m.dir = 1; }
  }
  for (const b of g.stack) if (b.t < 1) b.t = Math.min(1, b.t + dt / 0.16);
  for (const f of g.falling) { f.vy -= GRAV * dt; f.y += f.vy * dt; f.x += f.vx * dt; f.r += f.vr * dt; f.life -= dt; }
  g.falling = g.falling.filter((f) => f.life > 0);
  for (const e of g.fx) e.t += dt;
  g.fx = g.fx.filter((e) => e.t < e.dur);
}

export function placeBlock(g: Game): PlaceResult | null {
  if (g.state !== 'playing' || !g.moving || g.paused) return null;
  const m = g.moving, top = g.stack[g.stack.length - 1], lvl = g.stack.length;
  const left = Math.max(m.x, top.x), right = Math.min(m.x + m.w, top.x + top.w), ov = right - left;
  if (ov <= 0) {
    g.falling.push({ x: m.x, w: m.w, y: lvl * BH, lvl, vy: 40, vx: m.dir * 60, r: 0, vr: m.dir * 2.4, life: 2.2 });
    g.moving = null; g.state = 'over';
    return { type: 'miss' };
  }
  const perfect = Math.abs(m.x - top.x) <= PERFECT;
  let nb: Block;
  if (perfect) {
    g.combo++;
    nb = { x: top.x, w: top.w, t: 0 };
    if (g.combo >= 4 && nb.w < W0) { const grow = Math.min(8, W0 - nb.w); nb.w += grow; nb.x -= grow / 2; }
    g.fx.push({ kind: 'ring', x: nb.x, w: nb.w, lvl, t: 0, dur: 0.55 });
    for (let i = 0; i < 12; i++) g.fx.push({ kind: 'dust', x: nb.x + Math.random() * nb.w, y: lvl * BH, vx: (Math.random() - 0.5) * 90, vy: 40 + Math.random() * 70, lvl, t: 0, dur: 0.7 });
  } else {
    g.combo = 0;
    nb = { x: left, w: ov, t: 0 };
    const side = m.x < top.x ? -1 : 1;
    const piece = side < 0 ? { x: m.x, w: top.x - m.x } : { x: right, w: m.x + m.w - right };
    g.falling.push({ ...piece, y: lvl * BH, lvl, vy: 30, vx: side * 50, r: 0, vr: side * 2, life: 2 });
  }
  g.stack.push(nb); g.score++; spawn(g);
  return { type: perfect ? 'perfect' : 'cut', score: g.score, combo: g.combo };
}
