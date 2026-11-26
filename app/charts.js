// StatAtlas charts: small hand-rolled SVG charts, no library.
// Every chart is plain SVG built from the data, so it renders offline.

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// Horizontal bar chart. rows: [{label, value, highlight}] — value already
// formatted by the caller where needed; raw is the number for scaling.
export function hbarChart(rows, opts = {}) {
  const width = opts.width || 640;
  const rowH = opts.rowHeight || 30;
  const labelW = opts.labelWidth || 132;
  const valueW = opts.valueWidth || 74;
  const max = Math.max(...rows.map((r) => r.raw), 0.0001);
  const height = rows.length * rowH + 8;
  const barMax = width - labelW - valueW - 12;
  let out = `<svg viewBox="0 0 ${width} ${height}" width="100%" role="img" aria-label="Bar chart">`;
  rows.forEach((r, i) => {
    const y = 8 + i * rowH;
    const w = Math.max(2, (r.raw / max) * barMax);
    const fill = r.highlight ? '#c2571b' : '#1f5f7a';
    out += `<g>
      <text x="${labelW - 8}" y="${y + 15}" text-anchor="end" font-size="12.5" fill="#22303a">${esc(r.label)}</text>
      <rect x="${labelW}" y="${y + 4}" width="${w}" height="16" rx="3" fill="${fill}"/>
      <text x="${labelW + w + 6}" y="${y + 15}" font-size="12.5" font-weight="600" fill="#22303a">${esc(r.value)}</text>
    </g>`;
  });
  out += '</svg>';
  return out;
}

// Vertical column chart for a single indicator across countries.
export function columnChart(rows, opts = {}) {
  const width = opts.width || 640;
  const height = opts.height || 260;
  const padL = 62;
  const padB = 34;
  const padT = 14;
  const max = Math.max(...rows.map((r) => r.raw), 0.0001);
  const innerW = width - padL - 8;
  const innerH = height - padT - padB;
  const slot = innerW / rows.length;
  const barW = Math.min(34, slot * 0.62);
  let out = `<svg viewBox="0 0 ${width} ${height}" width="100%" role="img" aria-label="Column chart">`;
  out += `<line x1="${padL}" y1="${padT + innerH}" x2="${width - 8}" y2="${padT + innerH}" stroke="#c9d4da" stroke-width="1"/>`;
  out += `<line x1="${padL}" y1="${padT}" x2="${padL}" y2="${padT + innerH}" stroke="#c9d4da" stroke-width="1"/>`;
  // gridlines at 0 / 50% / max
  [0, 0.5, 1].forEach((f) => {
    const y = padT + innerH - f * innerH;
    const v = (max * f).toLocaleString('en-US', { maximumFractionDigits: 1 });
    out += `<line x1="${padL}" y1="${y}" x2="${width - 8}" y2="${y}" stroke="#e6edf0" stroke-width="1"/>`;
    out += `<text x="${padL - 6}" y="${y + 4}" text-anchor="end" font-size="11" fill="#6b7c86">${esc(v)}</text>`;
  });
  rows.forEach((r, i) => {
    const h = Math.max(2, (r.raw / max) * innerH);
    const x = padL + i * slot + (slot - barW) / 2;
    const y = padT + innerH - h;
    const fill = r.highlight ? '#c2571b' : '#2a7d9c';
    out += `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${barW.toFixed(1)}" height="${h.toFixed(1)}" rx="2" fill="${fill}"><title>${esc(r.label)}: ${esc(r.value)}</title></rect>`;
    out += `<text x="${(x + barW / 2).toFixed(1)}" y="${height - 16}" text-anchor="middle" font-size="11" fill="#4a5a64">${esc(r.shortLabel || r.label)}</text>`;
    out += `<text x="${(x + barW / 2).toFixed(1)}" y="${(y - 5).toFixed(1)}" text-anchor="middle" font-size="11" font-weight="600" fill="#22303a">${esc(r.value)}</text>`;
  });
  out += '</svg>';
  return out;
}

// Grouped bars: one indicator, a few countries side by side, for compare view.
export function groupedBarChart(indicator, countries, opts = {}) {
  const width = opts.width || 640;
  const height = opts.height || 240;
  const padL = 56;
  const padB = 30;
  const padT = 12;
  const idx = opts.index;
  const max = Math.max(...countries.map((c) => c.values[idx]), 0.0001);
  const innerH = height - padT - padB;
  const innerW = width - padL - 12;
  const slot = innerW / countries.length;
  const barW = Math.min(46, slot * 0.55);
  const colors = ['#1f5f7a', '#c2571b', '#3f8f4f', '#7a5fb0'];
  let out = `<svg viewBox="0 0 ${width} ${height}" width="100%" role="img" aria-label="Comparison chart">`;
  [0, 0.5, 1].forEach((f) => {
    const y = padT + innerH - f * innerH;
    const v = (max * f).toLocaleString('en-US', { maximumFractionDigits: 1 });
    out += `<line x1="${padL}" y1="${y}" x2="${width - 12}" y2="${y}" stroke="#e6edf0" stroke-width="1"/>`;
    out += `<text x="${padL - 6}" y="${y + 4}" text-anchor="end" font-size="11" fill="#6b7c86">${esc(v)}</text>`;
  });
  out += `<line x1="${padL}" y1="${padT + innerH}" x2="${width - 12}" y2="${padT + innerH}" stroke="#c9d4da" stroke-width="1"/>`;
  countries.forEach((c, i) => {
    const raw = c.values[idx];
    const h = Math.max(2, (raw / max) * innerH);
    const x = padL + i * slot + (slot - barW) / 2;
    const y = padT + innerH - h;
    out += `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${barW.toFixed(1)}" height="${h.toFixed(1)}" rx="2" fill="${colors[i % colors.length]}"/>`;
    out += `<text x="${(x + barW / 2).toFixed(1)}" y="${(y - 5).toFixed(1)}" text-anchor="middle" font-size="11.5" font-weight="600" fill="#22303a">${esc(indicator.format(raw))}</text>`;
    out += `<text x="${(x + barW / 2).toFixed(1)}" y="${height - 12}" text-anchor="middle" font-size="11" fill="#4a5a64">${esc(c.name)}</text>`;
  });
  out += '</svg>';
  return out;
}
