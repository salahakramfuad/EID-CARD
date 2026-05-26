# Eid Card Generator

Modern React (Vite) app for designing and downloading Eid-ul-Adha greeting cards.

## Features

- 3 Eid-ul-Adha themes with decorative animal art: **Cow**, **Goat**, and **Camel** (shared Islamic card design; each theme features stylized silhouettes of that animal)
- Backgrounds: 4 built-in photos (`bg1`–`bg4`) or **upload your own photo** as the full card background
- Live preview while editing:
  - Custom greeting title and message body (preset messages or your own text)
  - Signature / name and optional designation
  - Text and accent colors (manual or AI-assisted)
  - Font (Google Fonts)
  - Decorative toggles: stars, moons, sparkles
- **Permanent school logo** (`public/School_logo.png`) — always shown on the card; position, size, and drag on preview (no logo upload or hide)
- Download the card as a PNG (portrait `720×1080`)
- Public **download counter** (starts at **75**, increments on each successful PNG export)

## Setup

From the project root:

```bash
pnpm install
pnpm dev
```

Open the URL shown by `pnpm dev`.

`npm install` / `npm run dev` also work (see `package-lock.json`).

### Optional: AI color proxy

The dev script also starts an Express server on port `3001`:

- `GET` / `POST` `/api/downloads` — global download count (base **75** + persisted increments in `server/data/stats.json`)
- `POST` `/api/ai-color` — optional AI palette (set `OPENAI_API_KEY` in `.env`)

Vite proxies `/api/*` to `:3001` during `pnpm dev`. For production, set `VITE_AI_COLOR_PROXY_URL` to your API origin if the frontend is hosted separately.

## Build

```bash
pnpm run build
pnpm preview
```

## PNG Export Notes

- Export is generated client-side using `html-to-image`.
- The card is rendered at a fixed portrait size (`720×1080`) to keep PNG output consistent.
- PNG export waits for `document.fonts.ready` to reduce “wrong font” captures.

## Where things live

- `src/components/CardEditor.tsx`: owns all editor state (template, text, colors, logo, downloads)
- `src/components/Preview.tsx`: renders the fixed-size card and supports dragging the logo
- `src/components/ControlsPanel.tsx`: sidebar controls (inputs, background upload, logo, decorations, dark mode)
- `src/components/TemplateSelector.tsx`: template picker grid
- `src/templates/islamicCardLayout.tsx`: shared Eid-ul-Adha card overlay
- `src/templates/islamicVariants.ts`: per-template variant config
- `src/templates/*`: template registry + thin template wrappers
