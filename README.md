# PGxMTB homepage

Website of the PGxMTB consortium (funded under EP PerMed), built with
[Jekyll](https://jekyllrb.com), which GitHub Pages runs automatically.

**Live site:** https://roman-tremmel.github.io/PGxMTB_homepage/
(the path is case-sensitive). After every change pushed to the branch,
GitHub rebuilds the site within about a minute.

## Editing content

Edit the files directly on github.com (pencil icon) or locally.

| What | File |
|---|---|
| Turn sections on/off, change their order | `_config.yml` (list `homepage`) |
| Texts of a section | `_sections/<section>.md` |
| Publications | `_data/publications.yml` |
| Imprint / privacy statement | `imprint.md`, `privacy.md` |
| Logos and images | `assets/img/` |
| PDFs of publications | `assets/pdf/` |

### Turning sections on and off

In `_config.yml`:

```yaml
homepage:
  - { id: news, enabled: false }   # hidden – also removed from the menu
```

The order of the list is the order on the page. Sections with a `nav:` label in
their file appear in the menu; `nav_highlight: true` shows the entry as a
coloured button (used for "For patients").

### Section files

Each file in `_sections/` starts with a block between `---` lines (front
matter) that holds titles, lists and short texts. Some sections (e.g.
`about.md`) also have normal Markdown text below that block.

- Indentation matters: use spaces, not tabs, and keep the indentation of the
  surrounding lines.
- Text that contains a colon followed by a space (`: `) must be put in quotes.
- `>-` starts a longer text that may continue over several indented lines.
- Markdown works in texts: `**bold**`, `[link text](https://…)`.

### For patients (English and German)

`_sections/patients.md` contains both languages (`en:` and `de:`). Please
change both together. Link German-speaking patients directly to
https://roman-tremmel.github.io/PGxMTB_homepage/#patienten – this opens the
section in German.

### Publications

Add an entry to `_data/publications.yml`; the fields are explained at the top
of the file. `pmid` adds a PubMed button, `pdf` a PDF button.

## Preview on your own computer (optional)

Requires Ruby. Once: `bundle install`. Then:

```
bundle exec jekyll serve
```

and open http://localhost:4000/PGxMTB_homepage/

## Structure (for maintainers)

- `index.html` – assembles the homepage from the `homepage` list
- `_layouts/` – page frame (`default.html`) and legal pages (`page.html`)
- `_includes/sections/` – HTML template of each section; `menu.html` – main menu
- `assets/css/style.css` – styles (colours from the PGxMTB slide master, layout inspired by ikp.de)
- `assets/css/fonts.css`, `assets/fonts/` – self-hosted Source Sans 3 (SIL OFL), so the site makes no requests to Google
- `assets/js/main.js` – menu highlighting, publication list, language switch
