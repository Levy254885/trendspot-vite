import { Link } from "react-router-dom";
import { useApp } from "../context"; import { layout, bg, ms, ago, fmt } from "../data"; import { Go, Bg, Deck, By, Newsletter } from "../ui";

const Ec = ({ a, first }) => <Go className="ec-item" to={`/article/${a.id}`}>
  {first && <div className="ec-img"><Bg style={bg(a, 600)} /><div className="ec-img-accent" /></div>}
  <div className="ec-item-cat">{a.cat}</div><div className="ec-item-hl">{a.title}</div>{first && <Deck cls="ec-item-deck" a={a} />}<div className="ec-item-by"><By a={a} min /></div></Go>;
const Mg = ({ a }) => <Go className="mg-item" to={`/article/${a.id}`}><div className="mg-img"><Bg style={bg(a, 500)} /></div>
  <div className="mg-cat">{a.cat}</div><div className="mg-hl">{a.title}</div><div className="mg-by"><By a={a} min /></div></Go>;
export { Mg };

export default function Home() {
  const { items, loading, error } = useApp();
  if (loading) return <div className="page"><p className="empty">Loading stories…</p></div>;
  if (error) return <div className="page"><p className="empty">Could not load stories: {error}</p></div>;
  if (!items.length) return <div className="page"><p className="empty">No stories yet. <Link to="/admin" style={{ color: "var(--red)" }}>Open the admin</Link> to publish the first one.</p></div>;
  const x = layout(items), most = [...items].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 5), names = ["Fashion", "Music", "Celebrities"];
  return (<>
    <div className="page">
      <div className="top-story">
        <Go className="ts-main" to={`/article/${x.top.id}`}><div className="ts-eyebrow">Top Story · Cover</div>
          <div className="ts-visual"><div className="ts-vis-bg" style={bg(x.top, 1000)} /><div className="ts-vis-lines" /><div className="ts-vis-accent" /></div>
          <h1 className="ts-hl">{x.top.title}</h1><Deck cls="ts-deck" a={x.top} />
          <div className="ts-byline">By <span>{x.top.author}</span> &nbsp;·&nbsp; {x.top.min} min read &nbsp;·&nbsp; {ago(ms(x.top))}</div></Go>
        <div className="ts-side">{x.side.map(a => <Go key={a.id} className="ts-side-item" to={`/article/${a.id}`}><div className="tsi-cat">{a.cat}</div>
          <div className="tsi-hl">{a.title}</div><Deck cls="tsi-deck" a={a} /><div className="tsi-by"><By a={a} /></div></Go>)}</div></div>
      <div className="ed-grid">{x.cols.map((c, i) => <div key={i} style={{ display: "contents" }}>{i > 0 && <div className="ed-divider" />}
        <div className="ed-col"><Link className={"ec-label" + (i ? "" : " red")} to={`/section/${names[i]}`} style={{ textDecoration: "none" }}>{names[i]}</Link>
          {c.map((a, j) => <Ec key={a.id} a={a} first={!j} />)}</div></div>)}</div>
      <div className="news-rail"><div className="nr-main"><span className="nr-label">Latest News</span><div className="nr-list">
        {x.latest.map(a => <Go key={a.id} className="nr-row" to={`/article/${a.id}`}><div className="nr-row-body"><div className="nr-row-cat">{a.cat}</div><div className="nr-row-hl">{a.title}</div>
          <div className="nr-row-by"><By a={a} /> &nbsp;·&nbsp; <span className="nr-row-time">{new Date(ms(a)).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</span></div></div>
          <div className="nr-thumb"><Bg style={bg(a, 300)} /></div></Go>)}</div></div>
        <div className="nr-side"><span className="nrs-label">Most Read</span><div className="nrs-list">
          {most.map((a, i) => <Go key={a.id} className="nrs-item" to={`/article/${a.id}`}><div className="nrs-num">0{i + 1}</div><div className="nrs-hl">{a.title}</div>
            <div className="nrs-meta">{a.sec} · {fmt(a.views)} views</div></Go>)}</div></div></div>
    </div>
    {x.band.length > 0 && <div className="special-band"><div className="spec-i"><div className="spec-label">Awards Season &amp; Features</div><div className="spec-grid">
      {x.band.map(a => <Go key={a.id} className="spec-card" to={`/article/${a.id}`}><div className="spec-card-img"><Bg style={bg(a, 500)} /><div className="spec-card-bot" /></div>
        <div className="spec-card-cat">{a.cat}</div><div className="spec-card-hl">{a.title}</div><div className="spec-card-by"><By a={a} /></div></Go>)}</div></div></div>}
    <div className="page"><Newsletter /><div className="more-grid">{x.more.map(a => <Mg key={a.id} a={a} />)}</div></div></>);
}
