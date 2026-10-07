import { useParams } from "react-router-dom";
import { useApp } from "../context"; import { bg, ms, ago } from "../data"; import { Go, Deck, By } from "../ui"; import { Mg } from "./Home";
export default function Section() {
  const { name } = useParams(), { items, loading } = useApp();
  const l = items.filter(a => a.sec === name);
  if (loading) return <div className="page"><p className="empty">Loading…</p></div>;
  if (!l.length) return <div className="page"><p className="empty">No {name} stories yet.</p></div>;
  const [t, ...r] = l;
  return (<div className="page"><div className="top-story">
    <Go className="ts-main" to={`/article/${t.id}`}><div className="ts-eyebrow">{name}</div>
      <div className="ts-visual"><div className="ts-vis-bg" style={bg(t, 1000)} /><div className="ts-vis-lines" /><div className="ts-vis-accent" /></div>
      <h1 className="ts-hl">{t.title}</h1><Deck cls="ts-deck" a={t} /><div className="ts-byline">By <span>{t.author}</span> &nbsp;·&nbsp; {t.min} min read &nbsp;·&nbsp; {ago(ms(t))}</div></Go>
    <div className="ts-side">{r.slice(0, 4).map(a => <Go key={a.id} className="ts-side-item" to={`/article/${a.id}`}><div className="tsi-cat">{a.cat}</div><div className="tsi-hl">{a.title}</div><Deck cls="tsi-deck" a={a} /><div className="tsi-by"><By a={a} /></div></Go>)}</div></div>
    <div className="more-grid">{r.slice(4).map(a => <Mg key={a.id} a={a} />)}</div></div>);
}
