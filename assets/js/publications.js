/*
 * PGxMTB publications
 *
 * To add a publication, copy one entry and fill in the fields. Order does not
 * matter: the list is sorted by year (newest first) on the page.
 *
 *   type     "article" | "preprint" | "conference" | "other"
 *   year     publication year (number)
 *   authors  author list as it should be printed
 *   title    full title
 *   venue    journal, preprint server or conference
 *   details  optional: volume(issue):pages, poster/talk, etc.
 *   doi      optional: DOI without "https://doi.org/"
 *   url      optional: link used when there is no DOI (e.g. PDF of a poster)
 *   openAccess  optional: true if freely available
 *   wp       optional: related work packages, e.g. ["WP1", "WP3"]
 *   example  only for the placeholder entries below – delete these entries
 *            once the first real publication is added
 */
window.PGXMTB_PUBLICATIONS = [
  {
    example: true,
    type: "article",
    year: 2027,
    authors: "Author A, Author B, Author C, PGxMTB consortium",
    title: "Example entry: germline and somatic pharmacogenomic profiles of patients discussed in a molecular tumour board",
    venue: "Journal name",
    details: "12(3):100–110",
    doi: "",
    openAccess: true,
    wp: ["WP1"]
  },
  {
    example: true,
    type: "preprint",
    year: 2027,
    authors: "Author D, Author E, PGxMTB consortium",
    title: "Example entry: functional characterisation of rare variants in pharmacogenes",
    venue: "bioRxiv",
    doi: "",
    openAccess: true,
    wp: ["WP2"]
  },
  {
    example: true,
    type: "conference",
    year: 2026,
    authors: "Author F, Author G",
    title: "Example entry: implementing pharmacogenomics in molecular tumour boards – the PGxMTB project",
    venue: "Conference name, City",
    details: "Poster",
    wp: ["WP5"]
  }
];
