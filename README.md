# Memora

**Design event cards in the browser.** Pick a card type, choose from 50 templates, make it yours (text, colours, fonts, your own photo) and download it as an SVG.

Built with React 18 and Vite. No backend, no database, no image files. Every template is generated in code.

## What you get

| Card type | Templates |
| --- | --- |
| Birthday Cards | 50 |
| Wedding Cards | 50 |
| Burial Programs | 50 |
| Season's Greetings | 50 |
| Church Programs | 50 |
| Thanks & Appreciation | 50 |
| Graduation Parties | 50 |
| Induction Parties | 50 |

That is **400 templates**. Each one differs in layout, colour mood, font, background pattern and motif style.

### Features

- **Dashboard:** one sample card per type, search by card type, and a counter for saved designs.
- **Template browser:** 50 templates per type, filterable by "with photo slot" or "no photo".
- **Editor:** edit the title, subtitle, message, name and date. Click any text on the card to jump to its field.
- **Photo import:** upload your own picture into photo-slot layouts. It is resized in the browser and embedded in the SVG.
- **Full control:** switch layout, background pattern, font, title size and the three colours (background, accent, text) on any template.
- **Export:** download the finished card as an SVG.
- **My Designs:** save designs and reopen them (kept for the current session).
- **Responsive and themed:** works on phones and follows the system light or dark mode.

## Quick start

Requires Node.js 18 or newer.

```bash
npm install
npm run dev       # http://localhost:5173
```

```bash
npm run build     # production build in dist/
npm run preview   # serve the production build locally
```

## Project structure

```
memora/
├── index.html          # Entry page, loads the Google Fonts
├── vite.config.js
└── src/
    ├── main.jsx        # React entry point
    ├── App.jsx         # Dashboard, category grid, My Designs, navigation
    ├── Editor.jsx      # Edit panel, photo upload, SVG download
    ├── Card.jsx        # SVG card renderer: 10 layouts, patterns, motifs
    ├── data.js         # Categories, palettes, fonts, template generator
    └── styles.css      # App styling (light and dark)
```

## How templates work

Templates are not stored. `make(category, n)` in `src/data.js` builds template number `n` (0 to 49) from a few rules:

| Property | Rule |
| --- | --- |
| Layout | `n % 10` selects one of 10 layouts |
| Variant | `floor(n / 10)` gives 5 variants per layout |
| Colours | One of 5 moods (pastel, dark, vivid, cream, jewel) |
| Font | Rotates through 8 fonts |
| Pattern | Set by the variant (none, dots, diagonal, crosses, rings) |
| Motif style | Set by the variant (single, ringed, row of three, flanked, sparkles) |

A design is a plain object (`layout`, `t` for texts, `c` for colours, `font`, `ts`, `pat`, `v`, `img`). `Card.jsx` turns it into an SVG, so the thumbnails and the editor use the same renderer.

### The 10 layouts

Classic frame, Arch photo 📷, Full photo 📷, Circle photo 📷, Diagonal photo 📷, Polaroid 📷, Top band, Editorial, Badge, Framed photo 📷

Layouts marked 📷 have a photo slot.

## Customising

**Add a card type**
1. Add an entry to `CATS` in `src/data.js` with `id`, `name`, a base hue `h`, saturation `s`, and default text `def`.
2. Add a motif for it in the `Motif` switch in `src/Card.jsx`. Anything without a case falls back to a star.

**Add a font**
1. Add it to `FONTS` in `src/data.js`.
2. Add it to the Google Fonts link in `index.html` and to `FONT_CSS` in `src/Editor.jsx`, so downloaded SVGs can load it too.

**Add a layout**
1. Add its name to `LAYOUTS` and its photo flag to `HAS_PHOTO` in `src/Card.jsx`.
2. Add a row to `SPEC` (text position and limits) and `MS` (motif positions).
3. Draw its shapes in the `Card` component.
4. If the layout count is no longer 10, update the `n % 10` and `floor(n / 10)` rules in `make()` and the `n % 10` filter in `src/App.jsx`.

**Change the number of templates:** edit `length: 50` and the "50 templates" labels in `src/App.jsx`. Fifty is the natural size for the current layout and variant mix.

## Good to know

- **Saved designs are session-only.** They live in React state and disappear on refresh. Saving to `localStorage` or a backend is the natural next step.
- **Downloaded SVGs load fonts from Google Fonts**, so they need an internet connection to show the right typefaces. Uploaded photos are embedded inside the file.
- **Photos are cropped to fit the slot** (centred). There is no zoom or reposition control yet.

## Ideas for next steps

- Zoom and drag-to-reposition for photos
- PNG and PDF export
- Save to `localStorage` or a backend account
- Richer per-category artwork (florals, ornate borders, illustrations)
- Aso-Ebi and Payments pages from the original dashboard design

## Tech

React 18 · Vite 5 · plain CSS · inline SVG
