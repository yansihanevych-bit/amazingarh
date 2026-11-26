import { BH, D, W } from './config';
import type { Block, Game } from './logic';

export type Theme = 'light' | 'dark';
export type View = { s: number; ox: number; gy: number; cam: number };
type Palette = { bg1: string; bg2: string; stone: string; mortar: string; plaster: string; plaster2: string; wood: string; woodD: string; glass: string; roof: string; roofL: string; ground: string; groundL: string; glow: string; grid: string };

/** Dark: a tavern in the evening. Light: an architect's workshop by day. */
export const PALETTES: Record<Theme, Palette> = {
  dark: { bg1: '#2c221c', bg2: '#120d0a', stone: '#85776a', mortar: '#4a4038', plaster: '#e6d6bc', plaster2: '#e1c4b8', wood: '#5d3d27', woodD: '#3b2617', glass: '#f3b45a', roof: '#7a5550', roofL: '#93685f', ground: '#1f1712', groundL: '#3a2b20', glow: '244,180,90', grid: 'rgba(255,255,255,0)' },
  light: { bg1: '#f6f1e9', bg2: '#e8dfd2', stone: '#b9ab9b', mortar: '#e2d8cb', plaster: '#fffaf2', plaster2: '#f1dcd2', wood: '#8a6447', woodD: '#6a4a33', glass: '#b9c8cd', roof: '#8f6159', roofL: '#a87a70', ground: '#d6cab9', groundL: '#c4b6a3', glow: '255,236,200', grid: 'rgba(143,130,119,.16)' },
};

const cache: Record<string, string> = {};
const shade = (hex: string, k: number) => {
  const key = hex + k;
  if (cache[key]) return cache[key];
  const n = parseInt(hex.slice(1), 16), f = (c: number) => Math.round(k < 0 ? c * (1 + k) : c + (255 - c) * k);
  return (cache[key] = `rgb(${f(n >> 16)},${f((n >> 8) & 255)},${f(n & 255)})`);
};

/** Architectural progression is visual only: it never changes the mechanics. */
const stage = (l: number) => (l < 3 ? 'stone' : l % 6 === 0 ? 'beam' : 'wall');

export function drawBlock(ctx: CanvasRenderingContext2D, v: View, b: Pick<Block, 'x' | 'w' | 'drop'>, lvl: number, p: Palette, alpha = 1) {
  const s = v.s, X = v.ox + b.x * s, w = b.w * s, h = BH * s, Y = v.gy - ((lvl + 1) * BH - v.cam) * s + (b.drop || 0) * s;
  const dx = D * s, dy = D * 0.55 * s, st = stage(lvl);
  const base = st === 'stone' ? p.stone : st === 'beam' ? p.wood : lvl >= 50 ? p.plaster2 : p.plaster;
  ctx.globalAlpha = alpha;
  ctx.fillStyle = shade(base, 0.18);
  ctx.beginPath(); ctx.moveTo(X, Y); ctx.lineTo(X + dx, Y - dy); ctx.lineTo(X + w + dx, Y - dy); ctx.lineTo(X + w, Y); ctx.fill();
  ctx.fillStyle = shade(base, -0.32);
  ctx.beginPath(); ctx.moveTo(X + w, Y); ctx.lineTo(X + w + dx, Y - dy); ctx.lineTo(X + w + dx, Y + h - dy); ctx.lineTo(X + w, Y + h); ctx.fill();
  ctx.fillStyle = base; ctx.fillRect(X, Y, w, h);
  ctx.save(); ctx.beginPath(); ctx.rect(X, Y, w, h); ctx.clip();
  const wx = (x: number) => v.ox + x * s;
  if (st === 'stone') {
    ctx.strokeStyle = p.mortar; ctx.lineWidth = Math.max(1, s * 0.9); ctx.beginPath();
    ctx.moveTo(X, Y + h / 2); ctx.lineTo(X + w, Y + h / 2);
    for (let r = 0; r < 2; r++) {
      const off = (lvl * 2 + r) % 2 ? 14 : 0;
      for (let x = Math.floor((b.x - off) / 28) * 28 + off; x < b.x + b.w; x += 28) { ctx.moveTo(wx(x), Y + (r * h) / 2); ctx.lineTo(wx(x), Y + ((r + 1) * h) / 2); }
    }
    ctx.stroke();
  } else if (st === 'beam') {
    ctx.strokeStyle = shade(p.wood, -0.25); ctx.lineWidth = Math.max(1, s * 0.7); ctx.beginPath();
    for (let i = 1; i < 4; i++) { const yy = Y + (i * h) / 4; ctx.moveTo(X, yy); ctx.bezierCurveTo(X + w * 0.3, yy - 2 * s, X + w * 0.7, yy + 2 * s, X + w, yy); }
    ctx.stroke();
  } else {
    const m = lvl % 6;
    ctx.fillStyle = p.wood;
    for (let x = Math.ceil(b.x / 60) * 60; x < b.x + b.w; x += 60) ctx.fillRect(wx(x) - 2.5 * s, Y, 5 * s, h);
    if (m === 1 || m === 4) {
      ctx.strokeStyle = p.wood; ctx.lineWidth = 3.4 * s; ctx.beginPath();
      for (let x = Math.ceil(b.x / 60) * 60; x + 60 <= b.x + b.w; x += 120) { ctx.moveTo(wx(x), Y + h); ctx.lineTo(wx(x + 60), Y); }
      ctx.stroke();
    }
    if (lvl >= 8 && (m === 2 || m === 3)) {
      for (let cx = Math.ceil((b.x - 30) / 60) * 60 + 30; cx < b.x + b.w; cx += 60) {
        if (cx - 14 < b.x + 3 || cx + 14 > b.x + b.w - 3 || (Math.floor(cx / 60) % 2 && lvl < 20)) continue;
        const L = wx(cx - 11), R = wx(cx + 11), top = m === 3 ? Y + 4 * s : Y, bot = m === 2 ? Y + h - 4 * s : Y + h;
        ctx.fillStyle = p.glass; ctx.fillRect(L, top, R - L, bot - top);
        ctx.fillStyle = p.woodD; ctx.fillRect((L + R) / 2 - s, top, 2 * s, bot - top);
        if (m === 2) {
          ctx.fillRect(L - 2 * s, bot, R - L + 4 * s, 2.5 * s); ctx.fillRect(L, Y, R - L, 1.6 * s);
          if (lvl >= 25) {
            ctx.fillStyle = '#7d8c5a'; ctx.fillRect(L - s, bot - 4 * s, R - L + 2 * s, 4 * s);
            ctx.fillStyle = '#b5524a'; for (let k = 0; k < 4; k++) ctx.fillRect(L + ((k + 0.3) * (R - L)) / 4, bot - 6 * s, 2.4 * s, 2.4 * s);
          }
        } else ctx.fillRect(L - s, top - 2 * s, R - L + 2 * s, 2.5 * s);
      }
    }
    if (lvl >= 50 && m === 5 && b.w >= 40) {
      for (const ex of [b.x + 10, b.x + b.w - 10]) {
        const gx = wx(ex), gy = Y + h * 0.45, gr = ctx.createRadialGradient(gx, gy, 0, gx, gy, 14 * s);
        gr.addColorStop(0, `rgba(${p.glow},.9)`); gr.addColorStop(1, `rgba(${p.glow},0)`);
        ctx.fillStyle = gr; ctx.fillRect(gx - 14 * s, gy - 14 * s, 28 * s, 28 * s);
        ctx.fillStyle = p.woodD; ctx.fillRect(gx - 2 * s, Y, 4 * s, 3 * s);
      }
    }
  }
  ctx.restore();
  ctx.fillStyle = p.woodD; ctx.fillRect(X, Y, 3 * s, h); ctx.fillRect(X + w - 3 * s, Y, 3 * s, h);
  if (lvl >= 100) { ctx.fillStyle = '#c9a25c'; ctx.fillRect(X, Y, w, 1.6 * s); }
  ctx.globalAlpha = 1;
}

function drawRoof(ctx: CanvasRenderingContext2D, v: View, g: Game, p: Palette) {
  const top = g.stack[g.stack.length - 1], n = g.stack.length, s = v.s;
  const X = v.ox + (top.x - 10) * s, w = (top.w + 20) * s, Y = v.gy - (n * BH - v.cam) * s, rh = Math.max(30, top.w * 0.5) * s, dx = D * s, dy = D * 0.55 * s;
  if (g.score >= 25) { ctx.fillStyle = p.stone; ctx.fillRect(X + w * 0.68, Y - rh * 0.95, 12 * s, rh * 0.6); ctx.fillStyle = p.mortar; ctx.fillRect(X + w * 0.68 - 2 * s, Y - rh * 0.95, 16 * s, 3 * s); }
  ctx.fillStyle = shade(p.roof, -0.3);
  ctx.beginPath(); ctx.moveTo(X + w / 2, Y - rh); ctx.lineTo(X + w / 2 + dx, Y - rh - dy); ctx.lineTo(X + w + dx, Y - dy); ctx.lineTo(X + w, Y); ctx.fill();
  ctx.fillStyle = p.roof; ctx.beginPath(); ctx.moveTo(X, Y); ctx.lineTo(X + w / 2, Y - rh); ctx.lineTo(X + w, Y); ctx.closePath(); ctx.fill();
  ctx.save(); ctx.clip(); ctx.strokeStyle = p.roofL; ctx.lineWidth = Math.max(1, s); ctx.beginPath();
  for (let y = Y - 8 * s; y > Y - rh; y -= 8 * s) { ctx.moveTo(X, y); ctx.lineTo(X + w, y); }
  ctx.stroke(); ctx.restore();
  if (g.score >= 10) { const cx = X + w / 2, cy = Y - rh * 0.42, r = Math.min(9 * s, w * 0.06); ctx.fillStyle = p.glass; ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = p.woodD; ctx.lineWidth = 1.6 * s; ctx.stroke(); }
  if (g.score >= 100) { ctx.fillStyle = '#c9a25c'; ctx.beginPath(); ctx.arc(X + w / 2, Y - rh - 5 * s, 4 * s, 0, Math.PI * 2); ctx.fill(); }
}

export function drawScene(ctx: CanvasRenderingContext2D, cw: number, ch: number, v: View, g: Game, theme: Theme, time: number, opts: { roof?: boolean; all?: boolean } = {}) {
  const p = PALETTES[theme];
  const gr = ctx.createLinearGradient(0, 0, 0, ch); gr.addColorStop(0, p.bg1); gr.addColorStop(1, p.bg2); ctx.fillStyle = gr; ctx.fillRect(0, 0, cw, ch);
  if (theme === 'dark') {
    ctx.fillStyle = 'rgba(255,255,255,.025)';
    const off = (v.cam * v.s * 0.3) % 44;
    for (let y = -44 + off; y < ch; y += 44) for (let x = (((y / 44) | 0) % 2) * 40 - 40; x < cw; x += 80) ctx.fillRect(x + 2, y + 2, 76, 40);
    const by = (v.cam * v.s * 0.45) % 360;
    for (const yy of [70 + by - 360, 70 + by]) { ctx.fillStyle = '#24170f'; ctx.fillRect(0, yy, cw, 22); ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.fillRect(0, yy + 22, cw, 8); }
    for (const [lx, ly, ph] of [[cw * 0.12, ch * 0.28, 0], [cw * 0.88, ch * 0.4, 2]]) {
      const a = 0.2 + Math.sin(time * 3.1 + ph) * 0.03 + Math.sin(time * 7.3 + ph) * 0.02, rg = ctx.createRadialGradient(lx, ly, 0, lx, ly, Math.min(cw, ch) * 0.45);
      rg.addColorStop(0, `rgba(${p.glow},${a})`); rg.addColorStop(1, `rgba(${p.glow},0)`); ctx.fillStyle = rg; ctx.fillRect(0, 0, cw, ch);
      ctx.fillStyle = `rgba(${p.glow},.9)`; ctx.beginPath(); ctx.arc(lx, ly, 3, 0, 7); ctx.fill();
    }
  } else {
    ctx.strokeStyle = p.grid; ctx.lineWidth = 1; ctx.beginPath();
    const step = 24, off = (v.cam * v.s * 0.5) % step;
    for (let x = (cw / 2) % step; x < cw; x += step) { ctx.moveTo(x + 0.5, 0); ctx.lineTo(x + 0.5, ch); }
    for (let y = off; y < ch; y += step) { ctx.moveTo(0, y + 0.5); ctx.lineTo(cw, y + 0.5); }
    ctx.stroke();
    const lg = ctx.createLinearGradient(0, 0, cw * 0.6, ch); lg.addColorStop(0, `rgba(${p.glow},.55)`); lg.addColorStop(1, `rgba(${p.glow},0)`); ctx.fillStyle = lg; ctx.fillRect(0, 0, cw, ch);
  }
  const gy = v.gy + v.cam * v.s;
  if (gy < ch) { ctx.fillStyle = p.ground; ctx.fillRect(0, gy, cw, ch - gy); ctx.fillStyle = p.groundL; ctx.fillRect(v.ox - 30 * v.s, gy, (W + 60) * v.s, 6 * v.s); }
  const lo = Math.max(0, Math.floor(v.cam / BH) - 2), hi = Math.min(g.stack.length, lo + Math.ceil(ch / (BH * v.s)) + 4);
  const from = opts.all ? 0 : lo, to = opts.all ? g.stack.length : hi;
  for (let i = from; i < to; i++) { const b = g.stack[i]; b.drop = b.t < 1 ? -(1 - b.t) * 8 * (1 - b.t) : 0; drawBlock(ctx, v, b, i, p); }
  if (opts.roof) drawRoof(ctx, v, g, p);
  if (g.moving && g.state === 'playing') drawBlock(ctx, v, { x: g.moving.x, w: g.moving.w }, g.stack.length, p);
  for (const f of g.falling) {
    const s = v.s, cx = v.ox + (f.x + f.w / 2) * s, cy = v.gy - (f.y + BH / 2 - v.cam) * s;
    ctx.save(); ctx.translate(cx, cy); ctx.rotate(f.r * 0.3);
    drawBlock(ctx, { s, ox: -(f.x + f.w / 2) * s, gy: (f.lvl * BH + BH / 2) * s, cam: 0 }, { x: f.x, w: f.w }, f.lvl, p, Math.min(1, f.life));
    ctx.restore();
  }
  for (const e of g.fx) {
    const k = e.t / e.dur, s = v.s;
    if (e.kind === 'ring') {
      const pad = 4 + k * 22, X = v.ox + (e.x - pad) * s, Y = v.gy - ((e.lvl + 1) * BH + pad - v.cam) * s;
      ctx.strokeStyle = `rgba(${theme === 'dark' ? p.glow : '118,83,78'},${1 - k})`; ctx.lineWidth = 2; ctx.strokeRect(X, Y, (e.w + pad * 2) * s, (BH + pad * 2) * s);
    } else {
      const x = v.ox + (e.x + e.vx * e.t) * s, y = v.gy - (e.y + e.vy * e.t - 200 * e.t * e.t - v.cam) * s;
      ctx.fillStyle = `rgba(${theme === 'dark' ? p.glow : '169,155,144'},${1 - k})`; ctx.fillRect(x, y, 3, 3);
    }
  }
}

/** A finished-house portrait for the 100-block card. */
export function drawHouseThumb(canvas: HTMLCanvasElement, g: Game, theme: Theme) {
  const ctx = canvas.getContext('2d'); if (!ctx) return;
  const cw = canvas.width, ch = canvas.height, n = g.stack.length;
  const need = n * BH + Math.max(30, g.stack[n - 1].w * 0.5) + 30, s = Math.min((ch - 30) / need, (cw - 20) / (W + 40));
  const snapshot: Game = { ...g, moving: null, falling: [], fx: [], stack: g.stack.map((b) => ({ ...b, t: 1 })) };
  drawScene(ctx, cw, ch, { s, ox: (cw - W * s) / 2, gy: ch - 14, cam: 0 }, snapshot, theme, 0, { roof: true, all: true });
}
