# amazing-irchitect

*Architecture by Ira. Obviously.*

Портфолио Ирины Ряснянской (архитектурная визуализация). Next.js 16 · React 19 · TypeScript.

## Что внутри

| Путь | Что это |
|---|---|
| `/en`, `/pl` | Главная: hero `amazing-irchitect`, манифест, пять проектов, горизонтальная история «From noon to night», индекс с превью, About, процесс, контакты |
| `/[lang]/projects/[slug]` | Страница проекта (генерируется из данных) |
| `/[lang]/tavern` | Игра **Tavern Builder** (`/tavern` → `/en/tavern`) |
| `/api/contact` | Отправка формы через Resend |
| `/sitemap.xml`, `/robots.txt` | SEO |

- Язык выбирается автоматически по cookie или языку браузера (`src/proxy.ts`), переключатель EN/PL в меню.
- Светлая и тёмная темы без мигания при загрузке; пасхалка при переходе из тёмной темы в светлую.
- Анимации учитывают `prefers-reduced-motion`; без JavaScript весь контент виден.

## Структура

```
src/
  app/[lang]/            страницы (layout, главная, проекты, таверна)
  app/api/contact/       API формы
  components/            Nav, Transitions, Motion, Contact, home/*, tavern/TavernGame
  content/projects.ts    ← проекты: тексты, изображения, архитекторы
  content/i18n.ts        ← все тексты сайта на EN и PL, контакты
  lib/tavern/            логика игры, рендер, музыка, достижения (отдельно от UI)
public/img/              рендеры (по имени файла: kz-1.jpg и т.д.)
```

**Добавить проект:** положить изображения в `public/img/`, добавить объект в `src/content/projects.ts`. Страница, индекс и sitemap появятся сами. На главной пять раскладок вручную подобраны под пять проектов в `components/home/Sections.tsx`.

**Поменять тексты:** всё в `src/content/i18n.ts`. Биография и описания проектов помечены на сайте как черновик: уберите строки `draft`, когда Ира их утвердит.

## Локально

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

Нужен Node.js 20.9 или новее.

## GitHub + Vercel

1. Создайте пустой репозиторий на GitHub и загрузите проект:
   ```bash
   git init && git add . && git commit -m "amazing-irchitect"
   git branch -M main
   git remote add origin https://github.com/<user>/amazing-irchitect.git
   git push -u origin main
   ```
2. На [vercel.com/new](https://vercel.com/new) импортируйте репозиторий. Framework определится как Next.js, настройки по умолчанию подходят.
3. **Environment Variables** (Settings → Environment Variables):
   - `NEXT_PUBLIC_SITE_URL`: адрес сайта, например `https://amazing-irchitect.com`
   - для отправки писем с формы (необязательно): `RESEND_API_KEY`, `CONTACT_TO`, `CONTACT_FROM`. См. `.env.example`.
   Пока ключа Resend нет, форма открывает почтовую программу посетителя с готовым письмом.
4. Свой домен: Settings → Domains.

## Музыка и права

Мелодия в Таверне («Lantern Jig») оригинальная, синтезируется в браузере через WebAudio (`src/lib/tavern/audio.ts`). Сторонних записей нет.

Все изображения — визуализации Ирины Ряснянской для указанных архитекторов.
