import type { Lang } from '@/content/i18n';

export type Achievement = { n: number; id: string; name: string; d: Record<Lang, string>; grand?: boolean };

/** Achievements are pure configuration: thresholds, names, descriptions. */
export const ACHIEVEMENTS: Achievement[] = [
  { n: 5, id: 'first-bricks', name: 'First Bricks', d: { en: 'A first small step', pl: 'Pierwszy mały krok' } },
  { n: 10, id: 'getting-there', name: 'Getting Somewhere', d: { en: "It's starting to look like a house", pl: 'To już zaczyna przypominać dom' } },
  { n: 15, id: 'in-progress', name: 'Architect in Progress', d: { en: 'Ira would approve', pl: 'Ira by to zatwierdziła' } },
  { n: 20, id: 'little-builder', name: 'Little Builder', d: { en: 'Small, but a confident architect', pl: 'Mały, ale pewny siebie architekt' } },
  { n: 25, id: 'almost-home', name: 'Almost a Home', d: { en: 'Time to invite guests', pl: 'Można już zapraszać gości' } },
  { n: 50, id: 'master', name: 'Master of Bricks', d: { en: 'A true master builder', pl: 'Prawdziwy mistrz budowy' } },
  { n: 100, id: 'amazing', name: 'Amazing Irchitect', d: { en: 'A legend of architecture', pl: 'Legenda architektury' }, grand: true },
];

export const JOKE_AT = 101;

/** World units: the scene is 360 units wide; blocks are 24 units tall. */
export const W = 360, BH = 24, D = 14, W0 = 196, PERFECT = 4, GRAV = 1100;

export const STORAGE = { best: 'ai-tav-best', ach: 'ai-tav-ach', music: 'ai-tav-music' } as const;
