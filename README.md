# Eid Card Generator

Modern React (Vite) app for designing and downloading Eid greeting cards.

## Features

- 4 built-in templates: `Modern`, `Islamic`, `Minimal`, `Colorful`
- 2 additional templates: `Elegant`, `Festive`
- Live preview while editing:
  - Greeting title
  - Message body
  - Signature / name
  - Text color
  - Font (Google Fonts)
  - Decorative toggles: stars, moons, sparkles
- Permanent corner logo (default `public/logo.png`) with:
  - Top-left / top-right placement
  - Resize slider
  - Optional drag positioning on the preview
  - Ability to replace it by uploading a new logo
- Download the card as a PNG (fixed export size)

## Setup

From the project root:

```bash
pnpm install
pnpm dev
```

Open the URL shown by `pnpm dev`.

`npm install` / `npm run dev` also work (see `package-lock.json`).

### Optional: AI color proxy

The dev script also starts an Express server on port `3001` for `POST /api/ai-color`. Copy [`.env.example`](.env.example) to `.env` and set `OPENAI_API_KEY` only if you use that endpoint.

## Build

```bash
pnpm run build
pnpm preview
```

## PNG Export Notes

- Export is generated client-side using `html-to-image`.
- The card is rendered at a fixed size (`1080 x 720`) to keep PNG output consistent.
- PNG export waits for `document.fonts.ready` to reduce “wrong font” captures.

## Where things live

- `src/components/CardEditor.tsx`: owns all editor state (template, text, colors, logo, downloads)
- `src/components/Preview.tsx`: renders the fixed-size card and supports dragging the logo
- `src/components/ControlsPanel.tsx`: sidebar controls (inputs, logo upload, decorations, dark mode)
- `src/components/TemplateSelector.tsx`: template picker grid
- `src/templates/*`: template registry + 4 template renderers

