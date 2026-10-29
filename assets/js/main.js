document.getElementById('year').textContent = new Date().getFullYear();

// Highlight the menu entry of the section in view
(function () {
  const links = [...document.querySelectorAll('.mainnav a')];
  const sections = links.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      links.forEach(a => a.classList.toggle('is-current', a.getAttribute('href') === '#' + e.target.id));
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  sections.forEach(s => observer.observe(s));
})();

// Publications (data in assets/js/publications.js)
(function () {
  const TYPES = { article: 'Journal article', preprint: 'Preprint', conference: 'Conference', other: 'Other' };
  const pubs = (window.PGXMTB_PUBLICATIONS || []).slice().sort((a, b) => b.year - a.year);
  const list = document.getElementById('pub-list');
  const search = document.getElementById('pub-search');
  const chips = document.querySelectorAll('.pub-filters .chip');
  let type = 'all';

  const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const link = p => p.doi ? 'https://doi.org/' + p.doi : (p.url || '');

  chips.forEach(chip => {
    const t = chip.dataset.type;
    const n = t === 'all' ? pubs.length : pubs.filter(p => p.type === t).length;
    chip.querySelector('span').textContent = n;
    chip.hidden = t !== 'all' && n === 0;
    chip.addEventListener('click', () => {
      type = t;
      chips.forEach(c => c.classList.toggle('is-active', c === chip));
      render();
    });
  });
  search.addEventListener('input', render);

  function item(p) {
    const href = link(p);
    const title = href ? `<a href="${esc(href)}" target="_blank" rel="noopener">${esc(p.title)}</a>` : esc(p.title);
    const buttons = [
      p.pmid ? `<a class="pub-btn" href="https://pubmed.ncbi.nlm.nih.gov/${esc(p.pmid)}/" target="_blank" rel="noopener">PubMed</a>` : '',
      p.pdf ? `<a class="pub-btn" href="${esc(p.pdf)}" target="_blank" rel="noopener">PDF</a>` : ''
    ].join('');
    return `<article class="pub${p.example ? ' is-example' : ''}">
      <div class="pub-meta">
        <span class="pub-type pub-type-${esc(p.type)}">${TYPES[p.type] || TYPES.other}</span>
        ${p.openAccess ? '<span class="pub-oa">Open access</span>' : ''}
        ${p.example ? '<span class="pub-example">Example entry</span>' : ''}
      </div>
      <h3>${title}</h3>
      <p class="pub-authors">${esc(p.authors)}</p>
      <p class="pub-venue"><em>${esc(p.venue)}</em>${p.details ? ' · ' + esc(p.details) : ''}</p>
      <div class="pub-foot">
        ${buttons}
        ${p.doi ? `<a class="pub-doi" href="https://doi.org/${esc(p.doi)}" target="_blank" rel="noopener">doi:${esc(p.doi)}</a>` : ''}
      </div>
    </article>`;
  }

  function render() {
    const q = search.value.trim().toLowerCase();
    const shown = pubs.filter(p => (type === 'all' || p.type === type) &&
      (!q || [p.title, p.authors, p.venue].join(' ').toLowerCase().includes(q)));
    if (!pubs.length) {
      list.innerHTML = '<p class="pub-empty">The first PGxMTB publications are in preparation and will be listed here.</p>';
      return;
    }
    if (!shown.length) {
      list.innerHTML = '<p class="pub-empty">No publications match your search.</p>';
      return;
    }
    const years = [...new Set(shown.map(p => p.year))];
    list.innerHTML = years.map(y => `<div class="pub-year">
        <h3 class="pub-year-label">${y}</h3>
        <div class="pub-items">${shown.filter(p => p.year === y).map(item).join('')}</div>
      </div>`).join('');
  }
  render();
})();
