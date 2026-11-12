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
| Publications | reference files (RIS / PubMed .nbib) in `publications/`, extras in `_data/publications.yml` |
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

The list is built from reference files – no typing needed:

1. In your reference manager (Zotero, EndNote, Mendeley, Citavi …) select the
   PGxMTB publications and export them as **RIS**. From PubMed you can use
   *Cite → Download .nbib* instead.
2. Upload the file into the folder **`publications/`** on github.com
   (*Add file → Upload files*). You can replace the existing file with a new,
   complete export, or add further files – duplicates (same DOI) are shown once.
3. About a minute later the publications appear on the site, sorted by year.

Optional extras in **`_data/publications.yml`** (matched by DOI): a PubMed ID
for a direct PubMed link (otherwise the PubMed button searches by DOI), an
"Open access" label, a different type, or `hide: true`. Entries that are in no
reference file (e.g. a poster) can be typed in there as well; the file
explains the fields.

**PDF button:** put the PDF into `assets/pdf/` with the same file name as in
your reference manager (the RIS export lists it). It is then linked
automatically. Only upload PDFs you are allowed to share (e.g. open access).
Note: files in `publications/` and `assets/pdf/` are publicly downloadable.

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
- `assets/js/references.js` – reads the RIS / .nbib files and merges `_data/publications.yml`
- `assets/js/main.js` – menu highlighting, publication list, language switch
