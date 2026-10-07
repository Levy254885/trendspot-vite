import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase"; import { useApp } from "./context";

// Clickable block (keeps your original div-based styling)
export function Go({ to, className, style, children }) {
  const nav = useNavigate();
  return <div className={className} style={{ cursor: "pointer", ...style }} role="link" tabIndex={0}
    onClick={() => nav(to)} onKeyDown={e => e.key === "Enter" && nav(to)}>{children}</div>;
}
export const Bg = ({ style }) => <div style={{ position: "absolute", inset: 0, ...style }} />;
export const Deck = ({ cls, a }) => a.deck ? <div className={cls}>{a.deck}</div> : null;
export const By = ({ a, min }) => <>By {a.author}{min && <> &nbsp;·&nbsp; {a.min} min</>}</>;

export function Newsletter() {
  const { notify } = useApp(); const [email, setEmail] = useState("");
  const submit = async e => { e.preventDefault();
    try { await addDoc(collection(db, "subscribers"), { email: email.trim(), createdAt: serverTimestamp() }); setEmail(""); notify("Thanks — you're subscribed."); }
    catch { notify("Could not subscribe. Please try again."); } };
  return (<div className="nl-strip" id="newsletter"><div className="nl-left"><div className="nl-eyebrow">Daily Newsletter</div>
    <div className="nl-title">Get TrendSpot.co.ke in Your Inbox</div>
    <div className="nl-sub">Celebrity news, fashion drops, and viral moments — delivered every morning.</div></div>
    <form className="nl-form" onSubmit={submit}><input className="nl-input" type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email address" aria-label="Email" />
      <button className="nl-btn">Sign Up</button></form></div>);
}
