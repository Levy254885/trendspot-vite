import { thumb } from "./cloudinary";
export const SECS = ["News","Fashion","Celebrities","Music","Entertainment","Awards","Royals","Business","TV","Lists","Video"];
const PAL = [["#0d0508","#1a0a10"],["#120610","#2a1028"],["#071020","#0e2040"],["#0a1a08","#1a3a10"],["#180510","#2d1040"],["#100008","#2c0018"],["#071218","#0e2a38"],["#0f0a00","#2a1e00"],["#160020","#2e0060"],["#200000","#600010"]];
export const ms = a => a.createdAt?.toMillis?.() ?? Date.now();
export const bg = (a, w = 800) => {
  if (a.image) return { background: `url('${thumb(a.image, w)}') center/cover` };
  const h = [...a.id].reduce((x, c) => x + c.charCodeAt(0), 0), p = PAL[h % PAL.length];
  return { background: `linear-gradient(135deg,${p[0]},${p[1]})` };
};
export const ago = t => { const m = Math.max(1, Math.round((Date.now() - t) / 6e4)); return m < 60 ? `${m} min ago` : m < 1440 ? `${Math.round(m / 60)} hours ago` : `${Math.round(m / 1440)} days ago`; };
export const fmt = n => n >= 1000 ? `${Math.round(n / 1000)}K` : `${n || 0}`;
// Decide which story goes in which slot on the homepage (no story appears twice)
export function layout(L) {
  const u = new Set(), tk = (f, n) => { const r = L.filter(a => !u.has(a.id) && f(a)).slice(0, n); r.forEach(a => u.add(a.id)); return r; };
  const nf = a => !a.f, cols = ["Fashion", "Music", "Celebrities"];
  const top = tk(a => nf(a) && a.c, 1)[0] || tk(nf, 1)[0];
  return { top, side: tk(nf, 4), cols: cols.map(s => tk(a => nf(a) && a.sec === s, 3)), band: tk(a => a.f, 4), latest: tk(nf, 4), more: tk(nf, 4) };
}
