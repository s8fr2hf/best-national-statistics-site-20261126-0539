// StatAtlas views: render each page of the site into <main id="app">.
// Hash routes: #/ home, #/country/<id>, #/indicator/<id>, #/compare,
// #/countries (all countries), #/about.

import { INDICATORS, COUNTRIES, indicatorById, countryById, valueOf, rankOf, averageOf, topCountries } from './data.js';
import { hbarChart, columnChart, groupedBarChart } from './charts.js';

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function fmtNum(v) {
  return v.toLocaleString('en-US');
}

function indicatorCard(ind, rank) {
  const top = topCountries(ind, 1)[0];
  return `<a class="card ind-card" href="#/indicator/${ind.id}">
    <span class="card-kicker">Indicator · ${ind.year}</span>
    <h3>${esc(ind.name)}</h3>
    <p class="card-big">${esc(ind.format(valueOf(top, ind)))} <span class="unit">${esc(ind.unit)}</span></p>
    <p class="card-sub">Highest: ${esc(top.name)}${rank ? ` · #${rank} of ${COUNTRIES.length}` : ''}</p>
    <span class="card-link">Explore indicator →</span>
  </a>`;
}

function countryRow(c) {
  const pop = indicatorById('population');
  const gdp = indicatorById('gdppc');
  return `<a class="rowlink" href="#/country/${c.id}">
    <span class="row-name">${esc(c.name)}</span>
    <span class="row-meta">${esc(c.region)} · Capital ${esc(c.capital)}</span>
    <span class="row-stat">${fmtNum(valueOf(c, pop))}m people</span>
    <span class="row-stat">$${fmtNum(valueOf(c, gdp))} GDP / capita</span>
    <span class="row-arrow">→</span>
  </a>`;
}

export function renderHome() {
  const pop = indicatorById('population');
  const gdp = indicatorById('gdp');
  const life = indicatorById('life');
  const biggest = topCountries(pop, 5);
  const richest = topCountries(gdp, 5);
  const longest = topCountries(life, 5);
  const totalPop = COUNTRIES.reduce((s, c) => s + valueOf(c, pop), 0);
  const totalGdp = COUNTRIES.reduce((s, c) => s + valueOf(c, gdp), 0);

  return `
  <section class="hero">
    <p class="hero-kicker">18 countries · 8 indicators · World Bank, ILO &amp; Global Carbon Budget</p>
    <h1>National statistics,<br>plainly told.</h1>
    <p class="hero-lede">Population, economies, health, work and climate — real published figures
    for the world's largest countries, with every number traced to its source.</p>
    <div class="hero-stats">
      <div class="hero-stat"><strong>${fmtNum(totalPop)}m</strong><span>people covered</span></div>
      <div class="hero-stat"><strong>$${fmtNum(totalGdp)}bn</strong><span>combined GDP, 2023</span></div>
      <div class="hero-stat"><strong>${COUNTRIES.length}</strong><span>countries</span></div>
      <div class="hero-stat"><strong>${INDICATORS.length}</strong><span>indicators</span></div>
    </div>
    <form class="search" id="home-search" role="search">
      <label for="q">Find a country</label>
      <input id="q" name="q" type="search" placeholder="Type a country name, e.g. Japan…" autocomplete="off">
      <button type="submit">Search</button>
    </form>
    <div id="search-results" class="search-results" aria-live="polite"></div>
  </section>

  <section class="section">
    <div class="section-head"><h2>Browse by indicator</h2><a href="#/compare">Compare countries →</a></div>
    <div class="grid cards">${INDICATORS.map((ind) => indicatorCard(ind)).join('')}</div>
  </section>

  <section class="section">
    <div class="section-head"><h2>Biggest populations, 2023</h2><a href="#/indicator/population">Full ranking →</a></div>
    <div class="chart-box">${hbarChart(biggest.map((c) => ({ label: c.name, raw: valueOf(c, pop), value: fmtNum(valueOf(c, pop)) + 'm' })))}</div>
    <p class="source-note">Source: ${esc(pop.source)}, ${pop.year}. India passed China as the world's most populous country in 2023.</p>
  </section>

  <section class="section two-col">
    <div>
      <div class="section-head"><h2>Largest economies, 2023</h2></div>
      <div class="chart-box">${hbarChart(richest.map((c) => ({ label: c.name, raw: valueOf(c, gdp), value: '$' + fmtNum(valueOf(c, gdp)) + 'bn' })))}</div>
      <p class="source-note">Source: ${esc(gdp.source)}, ${gdp.year}. GDP at current market prices.</p>
    </div>
    <div>
      <div class="section-head"><h2>Longest lives, 2023</h2></div>
      <div class="chart-box">${hbarChart(longest.map((c) => ({ label: c.name, raw: valueOf(c, life), value: valueOf(c, life).toFixed(1) + ' yrs' })))}</div>
      <p class="source-note">Source: ${esc(life.source)}, ${life.year}. Life expectancy at birth.</p>
    </div>
  </section>

  <section class="section">
    <div class="section-head"><h2>All countries</h2><a href="#/countries">Browse the full list →</a></div>
    <div class="country-list">${COUNTRIES.slice(0, 8).map(countryRow).join('')}</div>
  </section>

  <section class="section about-strip">
    <h2>Why trust these numbers?</h2>
    <p>Every figure on this site is a published statistic from the World Bank's World Development
    Indicators, ILO modelled estimates, or the Global Carbon Budget — the same sources national
    statistics offices and researchers use. Each page names its source and year, and nothing here
    is estimated by us. <a href="#/about">Read how the figures were chosen →</a></p>
  </section>`;
}

export function renderCountries() {
  const byRegion = {};
  COUNTRIES.forEach((c) => {
    (byRegion[c.region] = byRegion[c.region] || []).push(c);
  });
  const sections = Object.keys(byRegion).sort().map((region) => `
    <h3 class="region-head">${esc(region)}</h3>
    <div class="country-list">${byRegion[region].map(countryRow).join('')}</div>`).join('');
  return `
  <section class="section">
    <p class="crumb"><a href="#/">Home</a> / Countries</p>
    <h1>All ${COUNTRIES.length} countries</h1>
    <p class="lede">Every country in this atlas, grouped by region. Pick one to see all eight
    indicators, its rank on each, and how it compares with the group average.</p>
    ${sections}
  </section>`;
}

export function renderCountry(id) {
  const c = countryById(id);
  if (!c) return renderNotFound('country');
  const cards = INDICATORS.map((ind) => {
    const v = valueOf(c, ind);
    const avg = averageOf(ind);
    const rank = rankOf(c, ind);
    const pct = Math.round((v / avg - 1) * 100);
    const vs = pct === 0 ? 'at the group average' : (pct > 0 ? `${pct}% above` : `${-pct}% below`) + ' the group average';
    return `<div class="stat-card">
      <span class="card-kicker">${esc(ind.name)} · ${ind.year}</span>
      <p class="card-big">${esc(ind.format(v))} <span class="unit">${esc(ind.unit)}</span></p>
      <p class="card-sub">Rank #${rank} of ${COUNTRIES.length} · ${vs}</p>
      <p class="card-src">Source: ${esc(ind.source)}</p>
      <a class="card-link" href="#/indicator/${ind.id}">See all countries →</a>
    </div>`;
  }).join('');

  const gdp = indicatorById('gdp');
  const peers = [...COUNTRIES].sort((a, b) => valueOf(b, gdp) - valueOf(a, gdp)).slice(0, 8);
  return `
  <section class="section">
    <p class="crumb"><a href="#/">Home</a> / <a href="#/countries">Countries</a> / ${esc(c.name)}</p>
    <h1>${esc(c.name)}</h1>
    <p class="lede">Capital ${esc(c.capital)} · ${esc(c.region)} · All figures are the latest published
    values, mostly 2023.</p>
    <div class="grid cards">${cards}</div>
    <div class="section-head" style="margin-top:2.2rem"><h2>GDP in context</h2></div>
    <div class="chart-box">${hbarChart(peers.map((p) => ({
      label: p.name, raw: valueOf(p, gdp), value: '$' + fmtNum(valueOf(p, gdp)) + 'bn',
      highlight: p.id === c.id,
    })))}</div>
    <p class="source-note">Source: ${esc(gdp.source)}, ${gdp.year}. ${esc(c.name)} is highlighted; the chart shows the eight largest economies in this atlas.</p>
    <p class="compare-cta"><a class="btn" href="#/compare?c=${c.id}">Compare ${esc(c.name)} with others →</a></p>
  </section>`;
}

export function renderIndicator(id) {
  const ind = indicatorById(id);
  if (!ind) return renderNotFound('indicator');
  const idx = INDICATORS.indexOf(ind);
  const sorted = [...COUNTRIES].sort((a, b) => {
    const d = a.values[idx] - b.values[idx];
    return ind.higherIs === 'bigger' ? -d : d;
  });
  const avg = averageOf(ind);
  const best = sorted[0];
  const worst = sorted[sorted.length - 1];
  const chartRows = sorted.slice(0, 10).map((c) => ({
    label: c.name, shortLabel: c.name.length > 10 ? c.name.slice(0, 9) + '…' : c.name,
    raw: valueOf(c, ind), value: ind.format(valueOf(c, ind)),
  }));
  const rows = sorted.map((c, i) => {
    const v = valueOf(c, ind);
    const rank = i + 1;
    const vsAvg = ((v - avg) / avg * 100);
    const vsText = `${vsAvg >= 0 ? '+' : ''}${vsAvg.toFixed(0)}% vs avg`;
    return `<tr>
      <td>${rank}</td>
      <td><a href="#/country/${c.id}">${esc(c.name)}</a></td>
      <td class="num"><strong>${esc(ind.format(v))}</strong> ${esc(ind.unit)}</td>
      <td class="num">${vsText}</td>
    </tr>`;
  }).join('');
  return `
  <section class="section">
    <p class="crumb"><a href="#/">Home</a> / Indicators / ${esc(ind.name)}</p>
    <h1>${esc(ind.name)}</h1>
    <p class="lede">${esc(ind.note)}</p>
    <div class="fact-strip">
      <div><strong>${esc(ind.format(valueOf(best, ind)))} ${esc(ind.unit)}</strong><span>Highest · ${esc(best.name)}</span></div>
      <div><strong>${esc(ind.format(valueOf(worst, ind)))} ${esc(ind.unit)}</strong><span>Lowest · ${esc(worst.name)}</span></div>
      <div><strong>${esc(ind.format(Math.round(avg * 10) / 10))} ${esc(ind.unit)}</strong><span>Average of these ${COUNTRIES.length} countries</span></div>
      <div><strong>${ind.year}</strong><span>Reference year</span></div>
    </div>
    <div class="section-head" style="margin-top:2rem"><h2>Top 10 countries</h2></div>
    <div class="chart-box">${columnChart(chartRows)}</div>
    <p class="source-note">Source: ${esc(ind.source)}, ${ind.year}. ${ind.higherIs === 'bigger' ? 'Higher is more.' : 'Lower is better here.'}</p>
    <div class="section-head" style="margin-top:2rem"><h2>Full ranking</h2></div>
    <table class="rank-table">
      <thead><tr><th>#</th><th>Country</th><th>Value</th><th>vs average</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <p class="source-note">Source: ${esc(ind.source)}, ${ind.year}. Figures rounded as published; see <a href="#/about">About the data</a> for method notes.</p>
  </section>`;
}

export function renderCompare(preselected) {
  const options = COUNTRIES.map((c) => `<option value="${c.id}">${esc(c.name)}</option>`).join('');
  const picks = (preselected && preselected.length ? preselected : ['usa', 'chn', 'ind']).filter(Boolean).slice(0, 4);
  while (picks.length < 3) picks.push(COUNTRIES[picks.length].id);
  const chosen = picks.map((id) => countryById(id)).filter(Boolean);
  const selects = [0, 1, 2].map((i) => `
    <label>Country ${i + 1}
      <select data-pick="${i}">${COUNTRIES.map((c) => `<option value="${c.id}"${c.id === chosen[i].id ? ' selected' : ''}>${esc(c.name)}</option>`).join('')}</select>
    </label>`).join('');
  const tableRows = INDICATORS.map((ind) => {
    const idx = INDICATORS.indexOf(ind);
    const cells = chosen.map((c) => {
      const v = c.values[idx];
      const best = ind.higherIs === 'bigger'
        ? Math.max(...chosen.map((x) => x.values[idx]))
        : Math.min(...chosen.map((x) => x.values[idx]));
      return `<td class="num${v === best ? ' best' : ''}">${esc(ind.format(v))}</td>`;
    }).join('');
    return `<tr><th scope="row">${esc(ind.name)} <span class="unit">(${esc(ind.unit)}, ${ind.year})</span></th>${cells}</tr>`;
  }).join('');
  const headCells = chosen.map((c) => `<th><a href="#/country/${c.id}">${esc(c.name)}</a></th>`).join('');
  const charts = INDICATORS.slice(0, 4).map((ind) => `
    <div class="compare-chart">
      <h3>${esc(ind.name)} <span class="unit">${esc(ind.unit)}</span></h3>
      ${groupedBarChart(ind, chosen, { index: INDICATORS.indexOf(ind) })}
    </div>`).join('');
  return `
  <section class="section">
    <p class="crumb"><a href="#/">Home</a> / Compare</p>
    <h1>Compare countries</h1>
    <p class="lede">Pick three countries and see every indicator side by side. The best value in
    each row is highlighted.</p>
    <div class="compare-controls">${selects}
      <button class="btn" id="compare-update" type="button">Update comparison</button>
    </div>
    <table class="rank-table compare-table">
      <thead><tr><th>Indicator</th>${headCells}</tr></thead>
      <tbody>${tableRows}</tbody>
    </table>
    <div class="section-head" style="margin-top:2rem"><h2>Charts</h2></div>
    <div class="compare-charts">${charts}</div>
    <p class="source-note">Sources: World Bank World Development Indicators (2023), ILO modelled estimates (2023),
    Global Carbon Budget (2022). See <a href="#/about">About the data</a>.</p>
  </section>`;
}

export function renderAbout() {
  return `
  <section class="section narrow">
    <p class="crumb"><a href="#/">Home</a> / About</p>
    <h1>About the data</h1>
    <p class="lede">StatAtlas shows published national statistics — nothing estimated by us,
    nothing guessed.</p>
    <h2>Sources</h2>
    <ul class="about-list">
      <li><strong>World Bank, World Development Indicators (2023)</strong> — population, GDP,
      GDP per capita, life expectancy, unemployment context, inflation and Internet use.
      The World Bank publishes these from national statistics offices and standardises them
      so countries can be compared.</li>
      <li><strong>ILO modelled estimates (2023)</strong> — unemployment rates, as published
      through the World Bank. The ILO models fill gaps where a country's own survey is
      missing, using a consistent method across countries.</li>
      <li><strong>Global Carbon Budget (2022)</strong> — CO2 emissions per capita, as
      republished by Our World in Data. Covers fossil-fuel and industry emissions.</li>
    </ul>
    <h2>Method notes</h2>
    <ul class="about-list">
      <li>Figures are rounded to sensible precision: populations to the nearest million,
      GDP to the nearest billion dollars, rates to one decimal place.</li>
      <li>Rankings compare only the ${COUNTRIES.length} countries in this atlas, not the whole world.</li>
      <li>China's unemployment figure is the ILO modelled estimate; its urban surveyed rate
      for 2023 was about 5.2%.</li>
      <li>Nigeria's unemployment figure follows the ILO modelled series; its national
      survey changed method in 2023 and is not directly comparable.</li>
      <li>All figures are the latest published values available when this atlas was built
      (November 2026). Newer releases may revise them slightly.</li>
    </ul>
    <h2>What this site is</h2>
    <p>StatAtlas is an original site built for the make.fun bounty “best national
    statistics site”. Its design, text and charts are its own; its numbers belong to
    the public sources above, cited on every page.</p>
    <p><a class="btn" href="#/">Back to the atlas →</a></p>
  </section>`;
}

export function renderNotFound(what) {
  return `
  <section class="section narrow">
    <h1>Not found</h1>
    <p class="lede">We don't have that ${esc(what || 'page')} in this atlas yet.</p>
    <p><a class="btn" href="#/">Back home →</a></p>
  </section>`;
}
