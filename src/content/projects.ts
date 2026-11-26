import type { Lang } from './i18n';

export type Localized = Record<Lang, string>;

export type ProjectImage = {
  src: string;
  alt: string;
  /** landscape (2:1) or portrait (4:5) — drives the layout of galleries */
  shape: 'wide' | 'tall';
};

export type Drawing = { src: string; label: Localized; w: number; h: number };

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
  /** architectural drawings, shown contained on a paper sheet */
  drawings?: Drawing[];
  /** frames of a "roof off" axonometric sequence */
  peel?: string[];
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
    hero: 'kz-3',
    cover: 'kz-1',
    images: [
      { src: 'kz-3', alt: 'Street façade: a pale brick base under a perforated screen, mountains behind', shape: 'wide' },
      { src: 'kz-1', alt: 'Courtyard pool under a slatted pergola', shape: 'tall' },
      { src: 'kz-4', alt: 'Stepping stones to the glazed living room under a maple', shape: 'tall' },
      { src: 'kz-5', alt: 'The courtyard tree seen from the roof garden', shape: 'tall' },
      { src: 'kz-2', alt: 'Roof lounge enclosed by the perforated screen', shape: 'tall' },
      { src: 'kz-6', alt: 'A table for two against bamboo and the screen', shape: 'tall' },
      { src: 'kz-9', alt: 'Lap pool between pale brick walls', shape: 'tall' },
      { src: 'kz-10', alt: 'A small plunge pool in a quiet side yard', shape: 'tall' },
      { src: 'kz-7', alt: 'Narrow garden passage with an outdoor kitchen', shape: 'tall' },
      { src: 'kz-8', alt: 'Bedroom opening onto a planted court', shape: 'tall' },
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
      { src: 'tk-7', alt: 'Garden façade with a mirrored panel and the carport', shape: 'wide' },
      { src: 'tk-2', alt: 'Mirrored glazing beside a planted gravel bed', shape: 'tall' },
      { src: 'tk-1', alt: 'Two bedroom wings with a planted gap between them', shape: 'tall' },
      { src: 'tk-3', alt: 'Garden façade under a grey sky', shape: 'wide' },
      { src: 'tk-10', alt: 'Front façade with timber-lined recesses', shape: 'wide' },
      { src: 'tk-6', alt: 'Covered dining terrace lined with timber', shape: 'tall' },
      { src: 'tk-8', alt: 'Timber-lined entrance portal', shape: 'tall' },
      { src: 'tk-11', alt: 'Inner courtyard: a tree under a round opening in the roof', shape: 'tall' },
      { src: 'tk-5', alt: 'Mirrored volume across the lawn', shape: 'tall' },
      { src: 'tk-4', alt: 'Street elevation behind a low fence', shape: 'wide' },
      { src: 'tk-9', alt: 'Carport passage along the dark façade', shape: 'tall' },
    ],
    drawings: [
      { src: 'tk-d1', label: { en: 'Elevation 01', pl: 'Elewacja 01' }, w: 2500, h: 1250 },
      { src: 'tk-d2', label: { en: 'Elevation 02', pl: 'Elewacja 02' }, w: 2500, h: 1250 },
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
    hero: 'znk-2',
    cover: 'znk-1',
    images: [
      { src: 'znk-2', alt: 'The house half-hidden in a pine and birch forest', shape: 'wide' },
      { src: 'znk-1', alt: 'Glass living pavilion on stilts between the pines', shape: 'tall' },
      { src: 'znk-5', alt: 'Dark brick wing among birches', shape: 'tall' },
      { src: 'znk-10', alt: 'Brick wing with a deep window toward the forest', shape: 'wide' },
      { src: 'znk-6', alt: 'Side elevation lifted on slender columns', shape: 'tall' },
      { src: 'znk-7', alt: 'Split-stone wall beside the glazed terrace', shape: 'tall' },
      { src: 'znk-3', alt: 'Path to the entrance between brick and glass', shape: 'tall' },
      { src: 'znk-8', alt: 'Glazed pavilion behind the pine trunks', shape: 'tall' },
      { src: 'znk-12', alt: 'Terrace steps and a lit path at the entrance', shape: 'wide' },
      { src: 'znk-9', alt: 'Entrance stair beside the split-stone wall', shape: 'tall' },
      { src: 'znk-4', alt: 'Roof overhang and glass balustrade among the trees', shape: 'tall' },
      { src: 'znk-11', alt: 'Wooden steps up to the terrace', shape: 'tall' },
    ],
    drawings: [
      { src: 'znk-d2', label: { en: 'Floor plan', pl: 'Rzut' }, w: 3000, h: 2121 },
      { src: 'znk-d1', label: { en: 'Cut-away axonometric', pl: 'Aksonometria w przekroju' }, w: 3000, h: 2121 },
      { src: 'znk-d4', label: { en: 'Axonometric', pl: 'Aksonometria' }, w: 3000, h: 2121 },
      { src: 'znk-d3', label: { en: 'Axonometric, tinted', pl: 'Aksonometria z kolorem' }, w: 3000, h: 2121 },
    ],
    peel: ['znk-peel-1', 'znk-peel-2', 'znk-peel-3', 'znk-peel-4'],
  },
];

export const press = {
  name: 'Elements House',
  year: 2021,
  architects: 'MCORP · with Eugene Mironenko',
  hour: { en: 'Published', pl: 'Publikacja' } as Localized,
  url: 'https://amazingarchitecture.com/visualization/elements-house-in-kharkiv-ukraine-by-mcorp',
};

/** "From noon to night": one house, three lights (project credits to be confirmed). */
export const dayStory: { src: string; hour: HourKey; alt: string; pos?: string }[] = [
  { src: 'dn-1', hour: 'aft', alt: 'Two-storey house among pines in afternoon light', pos: '50% 50%' },
  { src: 'dn-2', hour: 'golden', alt: 'The same house at golden hour, carport lights coming on', pos: '50% 62%' },
  { src: 'dn-3', hour: 'blue', alt: 'The same house at blue hour, warm light inside', pos: '50% 66%' },
];
export type HourKey = 'noon' | 'aft' | 'golden' | 'over' | 'canopy' | 'dusk' | 'blue' | 'night';

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
export const img = (name: string) => `/img/${name}.jpg`;
export const altOf = (p: Project, src: string) => p.images.find((i) => i.src === src)?.alt ?? '';
