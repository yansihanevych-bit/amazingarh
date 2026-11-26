/* "Lantern Jig" — an original 8-bar tune in D dorian (6/8), synthesized live with WebAudio.
   No samples, no third-party recordings. */

type Note = [semitone: number, eighths: number];
const TUNE: Note[][] = [
  [[0, 1], [3, 1], [7, 1], [5, 1], [3, 1], [2, 1]], [[0, 1], [2, 1], [3, 1], [5, 2], [7, 1]],
  [[3, 1], [2, 1], [0, 1], [-2, 1], [0, 1], [2, 1]], [[3, 1], [2, 1], [-2, 1], [0, 3]],
  [[7, 1], [10, 1], [12, 1], [10, 1], [7, 1], [5, 1]], [[7, 1], [5, 1], [3, 1], [2, 1], [3, 1], [5, 1]],
  [[3, 1], [5, 1], [7, 1], [5, 1], [3, 1], [2, 1]], [[0, 1], [-2, 1], [2, 1], [0, 3]],
];
const BASS = [0, -2, 0, -5, 3, -2, 5, 0];
const EIGHTH = 0.215;
const hz = (s: number) => 293.66 * Math.pow(2, s / 12);

export type Sfx = 'place' | 'perfect' | 'ach' | 'grand' | 'over';

class TavernAudio {
  private ctx: AudioContext | null = null;
  private music!: GainNode;
  private sfx!: GainNode;
  private noise!: AudioBuffer;
  private timer = 0;
  private next = 0;
  private step = 0;
  private loop = 0;
  enabled = true;

  private init(): boolean {
    if (this.ctx) return true;
    const C = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!C) return false;
    try {
      const ctx = (this.ctx = new C());
      const master = ctx.createGain(); master.gain.value = 0.9; master.connect(ctx.destination);
      // small "room": filtered feedback delay
      const room = ctx.createDelay(); room.delayTime.value = 0.19;
      const fb = ctx.createGain(); fb.gain.value = 0.28;
      const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 1800;
      room.connect(lp); lp.connect(fb); fb.connect(room);
      const wet = ctx.createGain(); wet.gain.value = 0.35; lp.connect(wet); wet.connect(master);
      this.music = ctx.createGain(); this.music.gain.value = 0; this.music.connect(master); this.music.connect(room);
      this.sfx = ctx.createGain(); this.sfx.gain.value = 0.32; this.sfx.connect(master); this.sfx.connect(room);
      const len = ctx.sampleRate * 0.25, buf = ctx.createBuffer(1, len, ctx.sampleRate), d = buf.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3);
      this.noise = buf;
      return true;
    } catch {
      this.ctx = null;
      return false;
    }
  }

  private pluck(t: number, f: number, dur: number, vol: number, dest?: AudioNode) {
    const c = this.ctx!, g = c.createGain(), fl = c.createBiquadFilter(), o1 = c.createOscillator(), o2 = c.createOscillator(), g2 = c.createGain();
    o1.type = 'triangle'; o2.type = 'sawtooth'; o1.frequency.value = f; o2.frequency.value = f * 1.003;
    g2.gain.value = 0.18; fl.type = 'lowpass'; fl.Q.value = 2;
    fl.frequency.setValueAtTime(Math.min(5200, f * 9), t); fl.frequency.exponentialRampToValueAtTime(Math.max(300, f * 1.6), t + dur);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + 0.006); g.gain.exponentialRampToValueAtTime(0.0008, t + dur * 1.7);
    o1.connect(fl); o2.connect(g2); g2.connect(fl); fl.connect(g); g.connect(dest ?? this.music);
    o1.start(t); o2.start(t); o1.stop(t + dur * 1.8); o2.stop(t + dur * 1.8);
  }

  private drum(t: number, vol: number, dest?: AudioNode) {
    const c = this.ctx!, s = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain(), o = c.createOscillator(), og = c.createGain();
    const out = dest ?? this.music;
    s.buffer = this.noise; f.type = 'lowpass'; f.frequency.value = 420; g.gain.value = vol * 0.5; s.connect(f); f.connect(g); g.connect(out); s.start(t);
    o.type = 'sine'; o.frequency.setValueAtTime(120, t); o.frequency.exponentialRampToValueAtTime(55, t + 0.18);
    og.gain.setValueAtTime(vol, t); og.gain.exponentialRampToValueAtTime(0.001, t + 0.25); o.connect(og); og.connect(out); o.start(t); o.stop(t + 0.3);
  }

  private schedule = () => {
    const c = this.ctx!;
    while (this.next < c.currentTime + 0.3) {
      const bar = Math.floor(this.step / 6) % 8, pos = this.step % 6, t = this.next;
      let acc = 0;
      for (const [s, l] of TUNE[bar]) {
        if (acc === pos) {
          this.pluck(t, hz(s), EIGHTH * l * 1.1, 0.2);
          if (this.loop % 2 && (pos === 0 || pos === 3)) this.pluck(t, hz(s - 3), EIGHTH * l, 0.07);
        }
        acc += l;
      }
      const r = BASS[bar];
      if (pos === 0) { this.pluck(t, hz(r - 24), EIGHTH * 3.2, 0.26); this.drum(t, 0.5); }
      if (pos === 3) { this.pluck(t, hz(r - 17), EIGHTH * 2.6, 0.16); this.drum(t, 0.28); }
      if (pos === 5 && bar % 2) this.drum(t, 0.12);
      this.step++;
      if (this.step % 48 === 0) this.loop++;
      this.next += EIGHTH;
    }
  };

  playMusic() {
    if (!this.enabled || !this.init()) return;
    const c = this.ctx!;
    if (c.state === 'suspended') void c.resume();
    if (this.timer) return;
    this.next = c.currentTime + 0.1;
    this.music.gain.cancelScheduledValues(c.currentTime);
    this.music.gain.setTargetAtTime(0.5, c.currentTime, 0.8);
    this.timer = window.setInterval(this.schedule, 90);
    this.schedule();
  }

  stopMusic() {
    if (!this.ctx) return;
    window.clearInterval(this.timer); this.timer = 0;
    this.music.gain.setTargetAtTime(0, this.ctx.currentTime, 0.25);
  }

  play(kind: Sfx, n = 0) {
    if (!this.init()) return;
    const c = this.ctx!;
    if (c.state === 'suspended') void c.resume();
    const t = c.currentTime + 0.01;
    if (kind === 'place') {
      this.pluck(t, 196, 0.09, 0.5, this.sfx);
      const s = c.createBufferSource(), g = c.createGain(); s.buffer = this.noise; g.gain.value = 0.25; s.connect(g); g.connect(this.sfx); s.start(t); s.stop(t + 0.04);
    }
    if (kind === 'perfect') { const f = hz(12 + [0, 2, 3, 5, 7, 9, 10, 12][Math.min(Math.max(n, 1) - 1, 7)]); this.pluck(t, f, 0.5, 0.35, this.sfx); this.pluck(t + 0.05, f * 2, 0.4, 0.12, this.sfx); }
    if (kind === 'ach') [0, 4, 7, 12, 16].forEach((s, i) => this.pluck(t + i * 0.09, hz(s + 12), 0.7, 0.26, this.sfx));
    if (kind === 'grand') [0, 7, 12, 16, 19, 24, 19, 24].forEach((s, i) => this.pluck(t + i * 0.11, hz(s + 5), 0.9, 0.26, this.sfx));
    if (kind === 'over') { this.drum(t, 0.9, this.sfx); [7, 3, 0, -5].forEach((s, i) => this.pluck(t + 0.12 + i * 0.14, hz(s), 0.5, 0.22, this.sfx)); }
  }
}

let instance: TavernAudio | null = null;
export const tavernAudio = () => (instance ??= new TavernAudio());
