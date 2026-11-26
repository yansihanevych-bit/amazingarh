import type { Lang } from './i18n';

export type Localized = Record<Lang, string>;

export type ProjectImage = {
  src: string;
  alt: string;
  /** landscape (2:1) or portrait (4:5) — drives the layout of galleries */
  shape: 'wide' | 'tall';
};

export type Project = {
  slug: string;
  name: string;
  year: number;
  architects: string;
  hour: Localized;
  type: Localized;
  lead: Localized;
  hero: string;
  /** image used as the "next project" banner and index preview */
  cover: string;
  images: ProjectImage[];
};

/* Project copy is a draft written from the images. Iryna should confirm it. */
export const projects: Project[] = [
  {
    slug: 'kz-house',
    name: 'KZ House',
    year: 2023,
    architects: 'Denis Davydov, Gleb Levchenko',
    hour: { en: 'Noon', pl: 'Południe' },
    type: { en: 'Private residence', pl: 'Dom prywatny' },
    lead: {
      en: 'A brick courtyard house that turns its back to the street. Light falls straight down through the pergola into the pool, so I rendered it at noon, when the courtyard is at its brightest and the screen wall throws its finest shadow.',
      pl: 'Ceglany dom z dziedzińcem, odwrócony plecami do ulicy. Światło pada pionowo przez pergolę do basenu, dlatego wyrenderowałam go w południe, gdy dziedziniec jest najjaśniejszy, a ażurowa ściana rzuca najdelikatniejszy cień.',
    },
    hero: 'kz-1',
    cover: 'kz-1',
    images: [
      { src: 'kz-1', alt: 'Courtyard pool under a slatted pergola', shape: 'tall' },
      { src: 'kz-2', alt: 'Garden lounge behind a perforated brick screen', shape: 'tall' },
      { src: 'kz-3', alt: 'Street elevation with perforated screen wall', shape: 'wide' },
    ],
  },
  {
    slug: 'pluty-type-2',
    name: 'Pluty, Type 2',
    year: 2024,
    architects: 'Denis Davydov',
    hour: { en: 'Blue hour', pl: 'Niebieska godzina' },
    type: { en: 'Residential, forest plot', pl: 'Dom na działce leśnej' },
    lead: {
      en: 'A two-storey house in a pine forest. At blue hour the light balance flips: the sky goes cool, the glazing goes warm, and the upper floor reads as a lantern among the trunks.',
      pl: 'Dwukondygnacyjny dom w sosnowym lesie. O niebieskiej godzinie balans światła się odwraca: niebo chłodnieje, przeszklenia stają się ciepłe, a piętro wygląda jak lampion między pniami.',
    },
    hero: 'pl2-6',
    cover: 'pl2-6',
    images: [
      { src: 'pl2-4', alt: 'Entrance path at blue hour', shape: 'tall' },
      { src: 'pl2-1', alt: 'House among tall pines in daylight', shape: 'tall' },
      { src: 'pl2-3', alt: 'Long view of the house with carport', shape: 'wide' },
      { src: 'pl2-2', alt: 'Covered terrace and lounge', shape: 'tall' },
      { src: 'pl2-5', alt: 'Carport and glazed upper floor', shape: 'tall' },
      { src: 'pl2-6', alt: 'Garden façade at blue hour', shape: 'wide' },
    ],
  },
  {
    slug: 'pluty-type-3',
    name: 'Pluty, Type 3',
    year: 2024,
    architects: 'Denis Davydov',
    hour: { en: 'Dusk', pl: 'Zmierzch' },
    type: { en: 'Residential, forest plot', pl: 'Dom na działce leśnej' },
    lead: {
      en: 'Gabled volumes clad in dark timber. Dusk was the only answer: the wood almost disappears into the forest, and the gable glazing glows like a hearth.',
      pl: 'Dwuspadowe bryły w ciemnym drewnie. Zmierzch był jedyną odpowiedzią: drewno niemal znika w lesie, a przeszklone szczyty świecą jak palenisko.',
    },
    hero: 'pl3-1',
    cover: 'pl3-1',
    images: [
      { src: 'pl3-1', alt: 'Three glowing gables at dusk', shape: 'wide' },
      { src: 'pl3-3', alt: 'Terrace along the timber façade', shape: 'tall' },
      { src: 'pl3-2', alt: 'Gabled house in afternoon light', shape: 'wide' },
      { src: 'pl3-4', alt: 'Outdoor kitchen under a canopy', shape: 'wide' },
      { src: 'pl3-5', alt: 'Entrance between timber volumes', shape: 'tall' },
      { src: 'pl3-6', alt: 'Night view among pines', shape: 'wide' },
    ],
  },
  {
    slug: 'tk-house',
    name: 'TK House',
    year: 2023,
    architects: 'Denis Davydov',
    hour: { en: 'Overcast', pl: 'Pochmurno' },
    type: { en: 'Private residence', pl: 'Dom prywatny' },
    lead: {
      en: 'Low, dark volumes with mirrored glass. A grey sky gives no hard shadows, so the façade becomes a soft reflection of the garden: calm, heavy, almost silent.',
      pl: 'Niskie, ciemne bryły z lustrzanym szkłem. Szare niebo nie daje ostrych cieni, więc elewacja staje się miękkim odbiciem ogrodu: spokojna, ciężka, niemal cicha.',
    },
    hero: 'tk-3',
    cover: 'tk-3',
    images: [
      { src: 'tk-2', alt: 'Dark volumes with reflective glazing', shape: 'tall' },
      { src: 'tk-1', alt: 'Entrance garden with stone path', shape: 'tall' },
      { src: 'tk-3', alt: 'Garden façade under a grey sky', shape: 'wide' },
      { src: 'tk-6', alt: 'Timber-lined covered dining terrace', shape: 'tall' },
      { src: 'tk-4', alt: 'Street view of the low house', shape: 'wide' },
      { src: 'tk-5', alt: 'Mirrored volume on the lawn', shape: 'tall' },
    ],
  },
  {
    slug: 'znk-house',
    name: 'ZNK House',
    year: 2023,
    architects: 'Denis Davydov, Oksana Shpakovska',
    hour: { en: 'Under canopy', pl: 'Pod koronami drzew' },
    type: { en: 'Residential, forest', pl: 'Dom w lesie' },
    lead: {
      en: 'A house that steps between birch and pine. I kept the camera low and the light dappled, as if you are walking up through the undergrowth to meet it.',
      pl: 'Dom, który wchodzi między brzozy i sosny. Trzymałam kamerę nisko, a światło rozproszone, jakbyś szedł przez poszycie, żeby go spotkać.',
    },
    hero: 'znk-1',
    cover: 'znk-1',
    images: [
      { src: 'znk-3', alt: 'Path to the house through the forest', shape: 'tall' },
      { src: 'znk-1', alt: 'Dark house among birches', shape: 'tall' },
      { src: 'znk-2', alt: 'Long low wing in the forest', shape: 'tall' },
      { src: 'znk-4', alt: 'Cantilever between trunks', shape: 'tall' },
      { src: 'znk-5', alt: 'House seen from the forest floor', shape: 'tall' },
    ],
  },
];

export const press = {
  name: 'Elements House',
  year: 2021,
  architects: 'MCORP · with Eugene Mironenko',
  hour: { en: 'Published', pl: 'Publikacja' } as Localized,
  url: 'https://amazingarchitecture.com/visualization/elements-house-in-kharkiv-ukraine-by-mcorp',
};

/** "From noon to night" horizontal story */
export const dayStory: { src: string; hour: HourKey; slug: string; shape: 'wide' | 'tall' }[] = [
  { src: 'kz-2', hour: 'noon', slug: 'kz-house', shape: 'tall' },
  { src: 'pl3-2', hour: 'aft', slug: 'pluty-type-3', shape: 'wide' },
  { src: 'tk-5', hour: 'over', slug: 'tk-house', shape: 'tall' },
  { src: 'znk-2', hour: 'canopy', slug: 'znk-house', shape: 'tall' },
  { src: 'pl3-1', hour: 'dusk', slug: 'pluty-type-3', shape: 'wide' },
  { src: 'pl2-4', hour: 'blue', slug: 'pluty-type-2', shape: 'tall' },
  { src: 'pl3-6', hour: 'night', slug: 'pluty-type-3', shape: 'wide' },
];
export type HourKey = 'noon' | 'aft' | 'over' | 'canopy' | 'dusk' | 'blue' | 'night';

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
export const img = (name: string) => `/img/${name}.jpg`;
export const altOf = (p: Project, src: string) => p.images.find((i) => i.src === src)?.alt ?? '';
