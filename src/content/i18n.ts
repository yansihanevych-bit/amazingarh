export const langs = ['en', 'pl'] as const;
export type Lang = (typeof langs)[number];
export const defaultLang: Lang = 'en';
export const isLang = (v: string | undefined | null): v is Lang => !!v && (langs as readonly string[]).includes(v);

/* Strings may contain <em>…</em> and <br> — rendered by <Rich>, never as raw HTML. */
const en = {
  nav: { work: 'Work', index: 'Index', about: 'About', contact: 'Contact', tavern: 'The Tavern', menu: 'Menu', close: 'Close', toDark: 'Switch to dark theme', toLight: 'Switch to light theme', home: 'amazing-irchitect, home', lang: 'Language' },
  egg: "Now I'm the one lighting your way.",
  hero: {
    tag: 'Architecture by Ira. Obviously.', meta2: 'Architectural visualization · Warsaw — Poland', meta3: 'Selected work 2021 — 2024',
    sub: 'Light, <em>before</em> the walls.',
    intro: "I render houses that don't exist yet: the hour, the shadow, the weight of the air. So architects and their clients can stand inside a space before the first stone is laid.",
    scroll: 'Scroll', fig1: 'Fig. 01 — KZ House', fig2: 'Fig. 02 — Pluty, Type 2',
  },
  manifesto: {
    label: 'Approach',
    big: "A drawing tells you where the walls are. It can't tell you how it feels to <em>wake up</em> there, how a pine shadow crosses the terrace at five, or when the glass turns from a window into a <em>mirror</em>. That is the part I make.",
    notes: [
      ['The hour comes first', 'Before materials or camera, I choose the moment of the day the house should be remembered in.'],
      ['Honest materials', 'Plaster that holds light softly, timber that warms at dusk, steel that borrows the sky.'],
      ['Human scale', 'Eye-level cameras, real paths, real gardens. A picture should feel walkable.'],
      ['Quiet post-work', 'No HDR glare, no impossible skies. Just the atmosphere the architecture deserves.'],
    ] as [string, string][],
  },
  work: { title: 'Selected <em>light studies</em>', label: 'Five houses · five hours', architects: 'Architects', view: 'View study', light: 'Light', lightCap: 'Inside the letters: Pluty, Type 3 at dusk · architect Denis Davydov' },
  story: {
    title: 'From noon <em>to night</em>', label: 'One house · three lights', credit: 'One house, one day · visualization by Iryna Riasnianska',
    hours: { noon: 'Noon', aft: 'Afternoon', golden: 'Golden hour', over: 'Overcast', canopy: 'Under canopy', dusk: 'Dusk', blue: 'Blue hour', night: 'Night' },
  },
  index: { title: 'Index', kicker: 'All projects', lead: 'Five private houses and one published study, each rendered for its own hour.', label: 'Project · Architects · Light · Year', architects: 'Architects', view: 'View study', read: 'Read the article', press: '↗ press', pub: 'Elements House<br>in Amazing Architecture' },
  about: {
    kicker: 'Who I am', title: 'Iryna <em>Riasnianska</em>', role: 'Archviz artist · 3D visualizer', skills: ['Exterior', 'Interior', 'Concept'], cta: "Let's talk about your project",
    quote: 'Half archviz artist, half lighting technician. Fully responsible for the pun.',
    bio: [
      "I'm an archviz artist and 3D visualizer. Since 2021 I've worked alongside architects (most closely with Denis Davydov and the MCORP team) turning drawings of private houses into images that feel like memories of a place.",
      'I think about an image the way an architect thinks about space: proportion first, then light, then everything else. I like the quiet moments best: overcast mornings, the blue hour, a forest letting light in through the canopy.',
      "I work closely with each studio, from the first clay renders to the final retouch, and I'm happy to join a project at concept stage, when images can still shape decisions.",
    ],
    draft: 'Draft biography, for Iryna to edit in her own words.',
    discipline: 'Discipline', disciplineV: 'Exterior & interior visualization, concept imagery', tools: 'Tools', published: 'Published',
    based: 'Based in', basedV: 'Warsaw — Poland', fav: 'Favourite light', favV: 'The blue hour',
  },
  process: {
    kicker: 'How I work',
    title: 'How a house <em>gets its light</em>',
    steps: [
      ['read', 'Reading the drawings', 'Plans, sections, the site. I look for what the architect cares about most, a courtyard, a cantilever, a long view, and build the image around it.'],
      ['hour', 'Choosing the hour', 'Noon for a courtyard pool. Blue hour for glass among pines. A grey sky for a dark, mirrored façade. The hour decides the story.'],
      ['touch', 'Materials that hold light', 'Each surface is tuned to how it should catch the hour: wood that warms, brick that softens, glass that reflects the forest back.'],
      ['breathe', 'Atmosphere, then restraint', 'Landscape, people, weather, then a long, careful edit until nothing in the frame is louder than the architecture.'],
    ] as [string, string, string][],
  },
  contact: {
    kicker: 'Warsaw · Architectural visualization', intro: 'Send drawings or a model: you will get a reply within 24 hours.', role: 'Archviz artist · 3D visualizer', bullets: ['Tell me about the house: drawings, references, timing.', 'I reply within 24 hours.', 'A clear scope and timeline before we start.'], write: 'Write to Iryna', scope: 'Scope', scopes: ['1–3 views', '4–8 views', '9+ views', 'Animation'],
    title: 'Every building begins<br>as a <em>picture.</em>', email: 'Email', phone: 'Phone', copy: 'Copy email', copied: 'Copied',
    name: 'Name', studio: 'Studio', email2: 'Your email', msg: 'About the project', ph: 'Type of building, stage, number of views, timing', send: 'Write to Iryna', sending: 'Sending…',
    err: 'Please add your name, your email and a few words about the project.', sent: 'Thank you. Iryna will get back to you soon.',
    fallback: 'Open the message in your mail app', or: ' — or write directly to ', subject: 'Visualization enquiry',
    credit: 'All images are visualizations by Iryna Riasnianska for the credited architects.', start: 'Start a project →',
  },
  project: { drawings: 'Drawings', drawingsL: 'Plans, elevations, axonometrics', peelT: 'Taking the <em>roof</em> off', peelSteps: ['Roof', 'Structure', 'Walls', 'Plan'], open: 'Open drawing', close: 'Close', back: '← All work', type: 'Type', year: 'Year', viz: 'Visualization', light: 'Light', next: 'Next study', draft: 'Project text is a draft written from the images, for Iryna to confirm.' },
  tavern: {
    title: 'Tavern Builder', sub: 'Stack the blocks as precisely as you can. Every miss gets trimmed off, and the house grows narrower and taller.',
    start: 'Start Building', how: 'Click, tap or press Space to drop a block.', built: 'Blocks built', best: 'Best',
    musicOn: 'Music: ON', musicOff: 'Music: OFF', back: '← Back to the site', ach: 'Achievements', unlocked: 'Achievement unlocked',
    placed: '{n} blocks successfully placed.', overT: 'The house collapsed.', overTr: 'Never mind. Architects make mistakes too.',
    again: 'Try Again', score: 'Blocks', g100: "100 blocks. You're officially an architect.", keep: 'Keep Building',
    j101: "That's enough. Go do some work.", j101b: "The house won't design itself.", close: 'Close', perfect: 'Perfect', locked: 'Locked',
  },
  meta: { title: 'amazing-irchitect · Architecture by Ira', description: 'Iryna Riasnianska — architectural visualization. Light, before the walls.' },
};

export type Dict = typeof en;

const pl: Dict = {
  nav: { work: 'Projekty', index: 'Indeks', about: 'O mnie', contact: 'Kontakt', tavern: 'Tawerna', menu: 'Menu', close: 'Zamknij', toDark: 'Włącz ciemny motyw', toLight: 'Włącz jasny motyw', home: 'amazing-irchitect, strona główna', lang: 'Język' },
  egg: 'Teraz to ja oświetlam Ci drogę.',
  hero: {
    tag: 'Architektura od Iry. Oczywiście.', meta2: 'Wizualizacja architektury · Warszawa — Polska', meta3: 'Wybrane prace 2021 — 2024',
    sub: 'Światło, <em>zanim</em> staną ściany.',
    intro: 'Renderuję domy, których jeszcze nie ma: porę dnia, cień, ciężar powietrza. Żeby architekci i ich klienci mogli stanąć w przestrzeni, zanim położony zostanie pierwszy kamień.',
    scroll: 'Przewiń', fig1: 'Ryc. 01 — KZ House', fig2: 'Ryc. 02 — Pluty, Type 2',
  },
  manifesto: {
    label: 'Podejście',
    big: 'Rysunek mówi, gdzie stoją ściany. Nie powie, jak to jest <em>obudzić się</em> w tym miejscu, jak cień sosny przesuwa się po tarasie o piątej ani kiedy szkło przestaje być oknem, a staje się <em>lustrem</em>. Tę część tworzę ja.',
    notes: [
      ['Najpierw pora dnia', 'Zanim wybiorę materiały czy kadr, decyduję, w jakim momencie dnia dom ma zostać zapamiętany.'],
      ['Szczere materiały', 'Tynk, który miękko trzyma światło, drewno, które ociepla się o zmierzchu, stal, która pożycza niebo.'],
      ['Ludzka skala', 'Kamera na wysokości oczu, prawdziwe ścieżki, prawdziwe ogrody. Po obrazie powinno dać się przejść.'],
      ['Spokojna postprodukcja', 'Bez krzykliwego HDR i niemożliwych nieb. Tylko atmosfera, na jaką zasługuje architektura.'],
    ],
  },
  work: { title: 'Wybrane <em>studia światła</em>', label: 'Pięć domów · pięć pór dnia', architects: 'Architekci', view: 'Zobacz studium', light: 'Światło', lightCap: 'W literach: Pluty, Type 3 o zmierzchu · architekt Denis Davydov' },
  story: {
    title: 'Od południa <em>do nocy</em>', label: 'Jeden dom · trzy światła', credit: 'Jeden dom, jeden dzień · wizualizacja Iryna Riasnianska',
    hours: { noon: 'Południe', aft: 'Popołudnie', golden: 'Złota godzina', over: 'Pochmurno', canopy: 'Pod koronami drzew', dusk: 'Zmierzch', blue: 'Niebieska godzina', night: 'Noc' },
  },
  index: { title: 'Indeks', kicker: 'Wszystkie projekty', lead: 'Pięć domów prywatnych i jedno opublikowane studium, każde wyrenderowane o swojej porze dnia.', label: 'Projekt · Architekci · Światło · Rok', architects: 'Architekci', view: 'Zobacz studium', read: 'Czytaj artykuł', press: '↗ prasa', pub: 'Elements House<br>w Amazing Architecture' },
  about: {
    kicker: 'Kim jestem', title: 'Iryna <em>Riasnianska</em>', role: 'Artystka archviz · wizualizatorka 3D', skills: ['Elewacje', 'Wnętrza', 'Koncepcje'], cta: 'Porozmawiajmy o Twoim projekcie',
    quote: 'Pół artystka archviz, pół oświetleniowiec. W pełni odpowiedzialna za tę grę słów.',
    bio: [
      'Jestem artystką archviz i wizualizatorką 3D. Od 2021 roku pracuję z architektami (najbliżej z Denisem Davydovem i zespołem MCORP), zamieniając rysunki domów prywatnych w obrazy, które wyglądają jak wspomnienie miejsca.',
      'O obrazie myślę tak, jak architekt myśli o przestrzeni: najpierw proporcje, potem światło, potem cała reszta. Najbardziej lubię ciche chwile: pochmurne poranki, niebieską godzinę, las przepuszczający światło przez korony drzew.',
      'Blisko współpracuję z każdym biurem, od pierwszych renderów roboczych po finalny retusz, i chętnie dołączam do projektu już na etapie koncepcji, kiedy obrazy mogą jeszcze wpływać na decyzje.',
    ],
    draft: 'Wstępna wersja biografii — do edycji przez Irynę.',
    discipline: 'Specjalizacja', disciplineV: 'Wizualizacje zewnętrzne i wnętrz, obrazy koncepcyjne', tools: 'Narzędzia', published: 'Publikacje',
    based: 'Miejsce', basedV: 'Warszawa — Polska', fav: 'Ulubione światło', favV: 'Niebieska godzina',
  },
  process: {
    kicker: 'Jak pracuję',
    title: 'Jak dom <em>dostaje swoje światło</em>',
    steps: [
      ['czytać', 'Czytanie rysunków', 'Rzuty, przekroje, działka. Szukam tego, na czym architektowi zależy najbardziej (dziedziniec, wspornik, długi widok) i wokół tego buduję obraz.'],
      ['pora', 'Wybór pory dnia', 'Południe dla basenu na dziedzińcu. Niebieska godzina dla szkła wśród sosen. Szare niebo dla ciemnej, lustrzanej elewacji. Pora dnia decyduje o historii.'],
      ['dotyk', 'Materiały, które trzymają światło', 'Każda powierzchnia jest dostrojona do tego, jak ma złapać światło: drewno, które się ociepla, cegła, która łagodnieje, szkło, które odbija las.'],
      ['oddech', 'Atmosfera, potem umiar', 'Krajobraz, ludzie, pogoda, a potem długa, uważna selekcja, aż nic w kadrze nie jest głośniejsze niż architektura.'],
    ],
  },
  contact: {
    kicker: 'Warszawa · Wizualizacja architektury', intro: 'Wyślij rysunki lub model: odpowiedź w ciągu 24 godzin.', role: 'Artystka archviz · wizualizatorka 3D', bullets: ['Opowiedz o domu: rysunki, referencje, termin.', 'Odpowiadam w ciągu 24 godzin.', 'Jasny zakres i harmonogram przed startem.'], write: 'Napisz do Iryny', scope: 'Zakres', scopes: ['1–3 ujęcia', '4–8 ujęć', '9+ ujęć', 'Animacja'],
    title: 'Każdy budynek<br>zaczyna się od <em>obrazu.</em>', email: 'E-mail', phone: 'Telefon', copy: 'Kopiuj e-mail', copied: 'Skopiowano',
    name: 'Imię', studio: 'Biuro', email2: 'Twój e-mail', msg: 'O projekcie', ph: 'Rodzaj budynku, etap, liczba ujęć, termin', send: 'Napisz do Iryny', sending: 'Wysyłanie…',
    err: 'Dodaj imię, e-mail i kilka słów o projekcie.', sent: 'Dziękuję. Iryna wkrótce się odezwie.',
    fallback: 'Otwórz wiadomość w programie pocztowym', or: ' — lub napisz bezpośrednio na ', subject: 'Zapytanie o wizualizację',
    credit: 'Wszystkie obrazy to wizualizacje Iryny Riasnianskiej dla wskazanych architektów.', start: 'Zacznij projekt →',
  },
  project: { drawings: 'Rysunki', drawingsL: 'Rzuty, elewacje, aksonometrie', peelT: 'Zdejmujemy <em>dach</em>', peelSteps: ['Dach', 'Konstrukcja', 'Ściany', 'Rzut'], open: 'Otwórz rysunek', close: 'Zamknij', back: '← Wszystkie projekty', type: 'Typ', year: 'Rok', viz: 'Wizualizacja', light: 'Światło', next: 'Następne studium', draft: 'Opis projektu to wersja robocza napisana na podstawie obrazów — do potwierdzenia przez Irynę.' },
  tavern: {
    title: 'Tavern Builder', sub: 'Układaj bloki jak najdokładniej. Każdy nadmiar zostaje odcięty, a dom robi się węższy i wyższy.',
    start: 'Zacznij budować', how: 'Kliknij, dotknij lub naciśnij spację, aby postawić blok.', built: 'Postawione bloki', best: 'Rekord',
    musicOn: 'Muzyka: WŁ.', musicOff: 'Muzyka: WYŁ.', back: '← Wróć na stronę', ach: 'Osiągnięcia', unlocked: 'Osiągnięcie odblokowane',
    placed: 'Postawiono {n} bloków.', overT: 'Dom się zawalił.', overTr: 'Nic nie szkodzi. Architekci też się mylą.',
    again: 'Spróbuj ponownie', score: 'Bloki', g100: '100 bloków. Jesteś oficjalnie architektem.', keep: 'Buduj dalej',
    j101: 'Dość. Idź do pracy.', j101b: 'Dom sam się nie zaprojektuje.', close: 'Zamknij', perfect: 'Idealnie', locked: 'Zablokowane',
  },
  meta: { title: 'amazing-irchitect · Architektura od Iry', description: 'Iryna Riasnianska — wizualizacja architektury. Światło, zanim staną ściany.' },
};

export const dictionaries: Record<Lang, Dict> = { en, pl };
export const getDict = (lang: Lang) => dictionaries[lang];

export const contactInfo = {
  email: 'ira.ryasnyanskaya@gmail.com',
  phone: '+48 737 438 012',
  phoneHref: 'tel:+48737438012',
  behance: 'https://www.behance.net/iryna_riasnianska',
  behanceLabel: 'behance.net/iryna_riasnianska',
};
