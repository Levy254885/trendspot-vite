import { useEffect } from "react"; import { Link, useParams } from "react-router-dom";
import { doc, updateDoc, increment } from "firebase/firestore";
import { db } from "../firebase"; import { useApp } from "../context"; import { bg, ms, ago } from "../data"; import { Deck } from "../ui";
export default function Article() {
  const { id } = useParams(), { items, loading } = useApp(), a = items.find(x => x.id === id);
  useEffect(() => { // count one view per session
    if (!a) return; const k = "seen_" + id;
    try { if (sessionStorage.getItem(k)) return; sessionStorage.setItem(k, "1"); } catch { /* ignore */ }
    updateDoc(doc(db, "articles", id), { views: increment(1) }).catch(() => {});
  }, [id, !!a]);
  if (loading) return <div className="page"><p className="empty">Loading…</p></div>;
  if (!a) return <div className="page"><p className="empty">Story not found.</p></div>;
  return (<div className="page"><div className="art"><Link to="/" className="back">‹ Back to home</Link><div className="ts-eyebrow">{a.cat}</div>
    <div className="ts-visual"><div className="ts-vis-bg" style={bg(a, 1200)} /><div className="ts-vis-lines" /><div className="ts-vis-accent" /></div>
    <h1 className="ts-hl">{a.title}</h1><Deck cls="ts-deck" a={a} />
    <div className="ts-byline" style={{ marginBottom: 24 }}>By <span>{a.author}</span> &nbsp;·&nbsp; {a.min} min read &nbsp;·&nbsp; {ago(ms(a))}</div>
    {(a.body || "").split(/\n\n+/).map((p, i) => <p key={i}>{p}</p>)}</div></div>);
}
