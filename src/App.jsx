import { Routes, Route, NavLink, Link, useNavigate, useLocation } from "react-router-dom";
import { SECS } from "./data"; import { useApp } from "./context";
import Home from "./pages/Home"; import Section from "./pages/Section"; import Article from "./pages/Article"; import Admin from "./pages/Admin"; import Tip from "./pages/Tip";

function Layout({ children }) {
  const { items } = useApp(), nav = useNavigate(), loc = useLocation();
  const toNewsletter = () => { const go = () => document.getElementById("newsletter")?.scrollIntoView({ behavior: "smooth" });
    if (loc.pathname === "/") go(); else { nav("/"); setTimeout(go, 400); } };
  const tick = items.slice(0, 6);
  return (<>
    <div className="util-bar"><div className="util-i">
      <div className="util-left"><span className="util-date">{new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</span>
        <Link className="util-tip" to="/tip" style={{ textDecoration: "none" }}>Got a tip?</Link></div>
      <div className="util-right"><Link className="util-link" to="/section/Entertainment">Newsletters</Link><Link className="util-link" to="/section/Awards">Awards</Link>
        <Link className="util-link" to="/section/Lists">Charts</Link><button className="util-sub" onClick={toNewsletter}>Subscribe</button></div></div></div>
    <div className="masthead"><div className="mast-i"><span className="mast-tagline">The Definitive Voice of Entertainment &amp; Pop Culture</span>
      <Link to="/" className="mast-logo"><span className="mast-name">TrendSpot<span className="mast-name-suffix">.co.ke</span></span>
        <div className="mast-sub">Fashion · Celebrities · Music · Entertainment · Trending</div></Link><div className="mast-rule" /></div></div>
    <div className="sec-nav"><div className="sec-nav-i">{SECS.map(s => <NavLink key={s} end={s === "News"} to={s === "News" ? "/" : `/section/${s}`}
      className={({ isActive }) => "sn-a" + (isActive ? " act" : "")}>{s}</NavLink>)}</div></div>
    {tick.length > 0 && <div className="ticker"><div className="ticker-i"><span className="ticker-label">Breaking</span><div className="ticker-scroll"><div className="ticker-t">
      {[...tick, ...tick].map((a, i) => <span key={i}>{a.title}</span>)}</div></div></div></div>}
    {children}
    <footer><div className="foot-i"><div className="foot-logo">TrendSpot<span style={{ fontFamily: "var(--f-ui)", fontSize: 13, fontWeight: 600, color: "var(--red)", verticalAlign: "super", position: "relative", top: -4 }}>.co.ke</span></div>
      <div className="foot-tagline">The Definitive Voice of Entertainment &amp; Pop Culture</div><div className="foot-rule" />
      <div className="foot-grid">
        {[["Sections", ["Fashion", "Celebrities", "Music", "Entertainment"]], ["More", ["Awards", "TV", "Royals", "Business", "Lists"]]].map(([l, ls]) =>
          <div className="foot-col" key={l}><div className="foot-col-lbl">{l}</div><ul>{ls.map(s => <li key={s}><Link to={`/section/${s}`}>{s}</Link></li>)}</ul></div>)}
        <div className="foot-col"><div className="foot-col-lbl">Company</div><ul><li><a>About Us</a></li><li><a>Advertise</a></li><li><a onClick={toNewsletter}>Newsletter</a></li><li><Link to="/tip">Tip Line</Link></li></ul></div>
        <div className="foot-col"><div className="foot-col-lbl">Legal</div><ul><li><a>Privacy Policy</a></li><li><a>Terms of Use</a></li><li><a>Cookies</a></li></ul></div>
        <div className="foot-col"><div className="foot-col-lbl">Follow Us</div><div className="foot-socials" style={{ flexWrap: "wrap", gap: 8 }}>
          {["IG", "TT", "X", "YT", "P"].map(s => <a key={s} className="soc">{s}</a>)}</div></div></div>
      <div className="foot-bottom"><span className="foot-copy">© {new Date().getFullYear()} TrendSpot.co.ke. All rights reserved.</span>
        <span className="foot-copy">Sitemap &nbsp;·&nbsp; Advertise &nbsp;·&nbsp; <Link to="/admin" style={{ color: "inherit" }}>Admin</Link></span></div></div></footer></>);
}
export default function App() {
  return <Layout><Routes><Route path="/" element={<Home />} /><Route path="/section/:name" element={<Section />} />
    <Route path="/article/:id" element={<Article />} /><Route path="/tip" element={<Tip />} /><Route path="/admin" element={<Admin />} />
    <Route path="*" element={<div className="page"><p className="empty">Page not found.</p></div>} /></Routes></Layout>;
}
