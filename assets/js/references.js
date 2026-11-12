/*
 * Builds the publication list from
 *   1. reference files in publications/ (RIS from Zotero, EndNote, Mendeley, Citavi …,
 *      or PubMed .nbib), inserted into the page by index.html as window.PGXMTB_REF_FILES
 *   2. _data/publications.yml (window.PGXMTB_PUBLICATIONS): manual entries, and
 *      corrections/extra fields for imported entries with the same DOI
 * The result replaces window.PGXMTB_PUBLICATIONS, which main.js renders.
 */
(function () {
  const files = window.PGXMTB_REF_FILES || [];
  const pdfFiles = window.PGXMTB_PDF_FILES || [];
  const yaml = window.PGXMTB_PUBLICATIONS || [];

  const PREPRINT_SERVERS = /\b(bio|med|chem)rxiv\b|\barxiv\b|research square|\bssrn\b|preprints\.org/i;
  const RIS_TYPES = {
    JOUR: 'article', JFULL: 'article', MGZN: 'article', INPR: 'article', EJOUR: 'article',
    CONF: 'conference', CPAPER: 'conference', ABST: 'conference', SLIDE: 'conference',
    UNPB: 'preprint', UNPD: 'preprint', PREPRINT: 'preprint'
  };

  const first = v => (Array.isArray(v) ? v[0] : v) || '';
  const cleanDoi = d => String(d || '').trim().replace(/^https?:\/\/(dx\.)?doi\.org\//i, '').replace(/^doi:\s*/i, '');
  const year = s => (String(s || '').match(/\d{4}/) || [''])[0];

  // "Tremmel, Roman" -> "Tremmel R"; "Fischer-Bosch, Hans Peter" -> "Fischer-Bosch HP"
  function shortAuthor(name) {
    const [last, given] = name.split(',').map(s => s.trim());
    if (!given) return name.trim();
    const initials = given.split(/[\s.-]+/).filter(Boolean).map(g => g[0].toUpperCase()).join('');
    return `${last} ${initials}`;
  }

  // Find a PDF in assets/pdf/ with the same file name as one of the linked files
  function findPdf(links) {
    for (const l of links) {
      if (/^https?:\/\//i.test(l) && /\.pdf($|\?)/i.test(l)) return l;
      const base = l.split(/[\\/]/).pop().toLowerCase();
      const hit = pdfFiles.find(f => f.name.toLowerCase() === base);
      if (hit) return hit.url;
    }
    return '';
  }

  function pages(sp, ep) { return sp ? (ep && ep !== sp ? `${sp}–${ep}` : sp) : ''; }

  function details(y, vol, issue, pg) {
    if (!vol && !pg) return '';
    return `${y ? y + ';' : ''}${vol || ''}${issue ? `(${issue})` : ''}${pg ? ':' + pg : ''}`;
  }

  // ---- RIS -------------------------------------------------------------
  function parseRIS(text) {
    const out = [];
    let rec = null;
    text.replace(/^﻿/, '').split(/\r?\n/).forEach(line => {
      const m = line.match(/^([A-Z][A-Z0-9])  -\s?(.*)$/);
      if (!m) return;
      const [, tag, value] = m;
      if (tag === 'TY') rec = { TY: [value.trim()] };
      else if (tag === 'ER') { if (rec) out.push(fromRIS(rec)); rec = null; }
      else if (rec) (rec[tag] = rec[tag] || []).push(value.trim());
    });
    return out;
  }

  function fromRIS(r) {
    const f = t => first(r[t]);
    const venueFull = f('T2') || f('JO') || f('JF') || f('BT');
    const venueAbbr = (f('J2') || f('JA')).replace(/\./g, '');
    const y = year(f('PY') || f('Y1') || f('DA'));
    let type = RIS_TYPES[f('TY').toUpperCase()] || 'other';
    if (PREPRINT_SERVERS.test(venueFull + ' ' + f('PB'))) type = 'preprint';
    const all = Object.values(r).flat().join('\n');
    const pmid = /^\d+$/.test(f('AN')) ? f('AN') : ((all.match(/PMID:?\s*(\d{5,})/i) || [])[1] || '');
    const doi = cleanDoi(f('DO')) || cleanDoi((f('UR').match(/doi\.org\/(.+)$/i) || [])[1]);
    return {
      type, year: Number(y) || '',
      authors: (r.AU || r.A1 || []).map(shortAuthor).join(', '),
      title: f('TI') || f('T1') || f('CT'),
      venue: type === 'article' ? (venueAbbr || venueFull) : (venueFull || venueAbbr),
      details: type === 'article' ? details(y, f('VL'), f('IS'), pages(f('SP'), f('EP'))) : f('M3'),
      doi, pmid,
      pdf: findPdf(r.L1 || []),
      url: f('UR')
    };
  }

  // ---- PubMed / MEDLINE (.nbib) -----------------------------------------
  function parseNBIB(text) {
    const out = [];
    let rec = null, last = null;
    text.replace(/^﻿/, '').split(/\r?\n/).forEach(line => {
      const m = line.match(/^([A-Z]{2,4})\s*- (.*)$/);
      if (m) {
        const [, tag, value] = m;
        if (tag === 'PMID') { if (rec) out.push(fromNBIB(rec)); rec = {}; }
        if (!rec) return;
        (rec[tag] = rec[tag] || []).push(value.trim());
        last = rec[tag];
      } else if (/^\s{6}\S/.test(line) && last) {
        last[last.length - 1] += ' ' + line.trim();  // continuation line
      }
    });
    if (rec) out.push(fromNBIB(rec));
    return out;
  }

  function fromNBIB(r) {
    const f = t => first(r[t]);
    const ids = [...(r.LID || []), ...(r.AID || [])];
    const doi = ((ids.find(i => /\[doi\]/.test(i)) || '').replace(/\s*\[doi\]/, ''));
    const y = year(f('DP'));
    const type = (r.PT || []).some(t => /preprint/i.test(t)) ? 'preprint' : 'article';
    return {
      type, year: Number(y) || '',
      authors: (r.AU || []).join(', '),
      title: f('TI').replace(/\.$/, ''),
      venue: f('TA') || f('JT'),
      details: details(y, f('VI'), f('IP'), f('PG').replace(/-/g, '–')),
      doi: cleanDoi(doi), pmid: f('PMID'),
      pdf: '', url: ''
    };
  }

  // ---- merge -------------------------------------------------------------
  const key = p => (p.doi ? 'doi:' + p.doi.toLowerCase() : 'title:' + String(p.title || '').toLowerCase().replace(/\W+/g, ''));
  const byKey = new Map();
  files.forEach(file => {
    const parse = /\.nbib$/i.test(file.name) || /^PMID- /m.test(file.text) ? parseNBIB : parseRIS;
    parse(file.text).forEach(p => { if (p.title && !byKey.has(key(p))) byKey.set(key(p), p); });
  });
  yaml.forEach(y => {
    const entry = Object.fromEntries(Object.entries(y).filter(([, v]) => v !== null && v !== ''));
    if (entry.doi) entry.doi = cleanDoi(entry.doi);
    const k = key(entry), existing = byKey.get(k);
    if (existing) Object.assign(existing, entry);          // correction / extra fields
    else if (entry.title) byKey.set(k, entry);             // manual entry
  });

  window.PGXMTB_PUBLICATIONS = [...byKey.values()].filter(p => !p.hide);
})();
