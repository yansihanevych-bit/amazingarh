import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

type Payload = { name?: string; studio?: string; email?: string; message?: string; website?: string; lang?: string };
const clip = (s: unknown, n: number) => String(s ?? '').trim().slice(0, n);
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

/* Very small in-memory rate limit per instance (best effort on serverless). */
const hits = new Map<string, number[]>();
const limited = (ip: string) => {
  const now = Date.now(), list = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60_000);
  list.push(now); hits.set(ip, list);
  return list.length > 5;
};

/**
 * Sends the enquiry through Resend (https://resend.com) when RESEND_API_KEY is set.
 * Without it, responds 501 and the client falls back to the visitor's mail app.
 */
export async function POST(req: Request) {
  let body: Payload;
  try { body = (await req.json()) as Payload; } catch { return NextResponse.json({ error: 'bad_json' }, { status: 400 }); }

  if (body.website) return NextResponse.json({ ok: true }); // honeypot: silently accept bots
  const name = clip(body.name, 120), studio = clip(body.studio, 160), email = clip(body.email, 200), message = clip(body.message, 5000);
  if (!name || !message || !/^\S+@\S+\.\S+$/.test(email)) return NextResponse.json({ error: 'invalid' }, { status: 422 });

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (limited(ip)) return NextResponse.json({ error: 'rate_limited' }, { status: 429 });

  const key = process.env.RESEND_API_KEY, to = process.env.CONTACT_TO, from = process.env.CONTACT_FROM;
  if (!key || !to || !from) return NextResponse.json({ error: 'not_configured' }, { status: 501 });

  const subject = `Visualization enquiry · ${studio || name}`;
  const html = `<p>${esc(message).replace(/\n/g, '<br>')}</p><hr><p>${esc(name)}${studio ? ' · ' + esc(studio) : ''}<br>${esc(email)}<br>Language: ${esc(clip(body.lang, 5))}</p>`;
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from, to: [to], reply_to: email, subject, html, text: `${message}\n\n${name}${studio ? ' · ' + studio : ''}\n${email}` }),
  });
  if (!res.ok) return NextResponse.json({ error: 'send_failed' }, { status: 502 });
  return NextResponse.json({ ok: true });
}
