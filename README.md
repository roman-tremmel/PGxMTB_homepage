# PGxMTB homepage

Static one-page website for the PGxMTB consortium (funded under EP PerMed).

- `index.html` – the page
- `imprint.html`, `privacy.html` – imprint and privacy statement (adapted from ikp.de)
- `assets/css/style.css` – styles (colours from the PGxMTB slide master, layout inspired by ikp.de)
- `assets/js/main.js` – menu highlighting and the publication list
- `assets/img/` – PGxMTB, EP PerMed and partner logos
- `assets/fonts/`, `assets/css/fonts.css` – self-hosted Source Sans 3 (SIL OFL), so the site makes no requests to Google

No build step: open `index.html` locally, or serve the folder with any static host
(e.g. GitHub Pages: Settings → Pages → deploy from branch, root folder).

## Adding publications

Edit `assets/js/publications.js` and add one entry per publication (the fields are
explained at the top of the file). The page sorts them by year and builds the
filters and counts automatically. A `pmid` adds a PubMed button, a `pdf` (URL or
file in `assets/pdf/`) adds a PDF button.

## GitHub Pages

The site is served at https://roman-tremmel.github.io/PGxMTB_homepage/
(the path is case-sensitive).
