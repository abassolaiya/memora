# Memora

Event card designer: 8 card types x 50 SVG templates, editable in the browser.

    npm install
    npm run dev      # http://localhost:5173
    npm run build    # production build in dist/

Structure: `src/data.js` (categories, palettes, template generator), `src/Card.jsx` (SVG card renderer + motifs),
`src/Editor.jsx` (edit panel + SVG download), `src/App.jsx` (dashboard, category and My Designs views).
