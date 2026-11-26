// StatAtlas router: hash routes, search, and the compare controls.
// Routes: #/ home · #/countries · #/country/<id> · #/indicator/<id>
//         #/compare[?c=<id>] · #/about

import { COUNTRIES } from './data.js';
import { renderHome, renderCountries, renderCountry, renderIndicator, renderCompare, renderAbout, renderNotFound } from './views.js';

const app = document.getElementById('app');

function parseHash() {
  const raw = location.hash.replace(/^#\/?/, '');
  const [pathPart, queryPart] = raw.split('?');
  const parts = pathPart.split('/').filter(Boolean);
  const query = new URLSearchParams(queryPart || '');
  return { parts, query };
}

function route() {
  const { parts, query } = parseHash();
  let html;
  if (parts.length === 0) html = renderHome();
  else if (parts[0] === 'countries' && parts.length === 1) html = renderCountries();
  else if (parts[0] === 'country' && parts[1]) html = renderCountry(parts[1]);
  else if (parts[0] === 'indicator' && parts[1]) html = renderIndicator(parts[1]);
  else if (parts[0] === 'compare') {
    const pre = query.get('c') ? query.get('c').split(',').filter(Boolean) : null;
    html = renderCompare(pre);
  } else if (parts[0] === 'about' && parts.length === 1) html = renderAbout();
  else html = renderNotFound(parts[0]);

  app.innerHTML = html;
  window.scrollTo(0, 0);
  wirePage();
  markActiveNav(parts);
}

function markActiveNav(parts) {
  document.querySelectorAll('.nav a').forEach((a) => {
    const href = a.getAttribute('href');
    const on = (parts.length === 0 && href === '#/')
      || (parts[0] === 'countries' && href === '#/countries')
      || (parts[0] === 'compare' && href === '#/compare')
      || (parts[0] === 'about' && href === '#/about');
    a.classList.toggle('active', !!on);
  });
}

function wirePage() {
  // Home search: live-filter countries as the visitor types.
  const form = document.getElementById('home-search');
  const input = document.getElementById('q');
  const results = document.getElementById('search-results');
  if (form && input && results) {
    const runSearch = () => {
      const q = input.value.trim().toLowerCase();
      if (!q) {
        results.innerHTML = '';
        return;
      }
      const hits = COUNTRIES.filter((c) =>
        c.name.toLowerCase().includes(q)
        || c.capital.toLowerCase().includes(q)
        || c.region.toLowerCase().includes(q),
      ).slice(0, 6);
      if (hits.length === 0) {
        results.innerHTML = `<p class="no-result">No country matches “${escapeHtml(input.value.trim())}”. Try “Japan” or “Africa”.</p>`;
        return;
      }
      results.innerHTML = hits.map((c) =>
        `<a class="search-hit" href="#/country/${c.id}"><strong>${escapeHtml(c.name)}</strong><span>${escapeHtml(c.region)} · Capital ${escapeHtml(c.capital)}</span></a>`,
      ).join('');
    };
    input.addEventListener('input', runSearch);
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const q = input.value.trim().toLowerCase();
      const hit = COUNTRIES.find((c) => c.name.toLowerCase() === q)
        || COUNTRIES.find((c) => c.name.toLowerCase().includes(q));
      if (hit) location.hash = `#/country/${hit.id}`;
      else runSearch();
    });
  }

  // Compare page: rebuild the comparison from the three selects.
  const update = document.getElementById('compare-update');
  if (update) {
    update.addEventListener('click', () => {
      const picks = [...document.querySelectorAll('select[data-pick]')].map((s) => s.value);
      location.hash = `#/compare?c=${picks.join(',')}`;
    });
  }
}

function escapeHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

window.addEventListener('hashchange', route);
route();
