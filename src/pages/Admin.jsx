import { useState } from "react";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { addDoc, updateDoc, deleteDoc, doc, collection, serverTimestamp, Timestamp, writeBatch } from "firebase/firestore";
import { auth, db } from "../firebase"; import { uploadImage } from "../cloudinary"; import { useApp } from "../context";
import { SECS } from "../data"; import { SEED } from "../seed";

const EMPTY = { title: "", deck: "", sec: "Fashion", cat: "", author: "", min: 4, image: "", body: "", c: false, f: false };

export default function Admin() {
  const { user, isAdmin, authReady, items, notify } = useApp();
  const [cred, setCred] = useState({ email: "", password: "" }), [err, setErr] = useState("");
  const [f, setF] = useState(EMPTY), [editId, setEditId] = useState(null), [busy, setBusy] = useState(false);
  const set = k => e => setF({ ...f, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value });

  if (!authReady) return <div className="page"><p className="empty">Loading…</p></div>;
  if (!user) return <div className="page"><form className="adm" onSubmit={e => { e.preventDefault(); setErr(""); signInWithEmailAndPassword(auth, cred.email, cred.password).catch(() => setErr("Wrong email or password.")); }}>
    <h2>Admin sign in</h2><input type="email" required placeholder="Email" onChange={e => setCred({ ...cred, email: e.target.value })} />
    <input type="password" required placeholder="Password" onChange={e => setCred({ ...cred, password: e.target.value })} /><button className="btn2">Sign in</button>
    <span style={{ color: "var(--red)", fontSize: 13 }}>{err}</span></form></div>;
  if (!isAdmin) return <div className="page"><div className="adm"><h2>Not an admin</h2>
    <p style={{ fontSize: 14 }}>You are signed in, but this account can't publish. In the Firebase console, create a Firestore document at <b>admins/{user.uid}</b> (any field), then refresh.</p>
    <button className="btn2 o" onClick={() => signOut(auth)}>Sign out</button></div></div>;

  const pick = async e => { const file = e.target.files[0]; if (!file) return; setBusy(true);
    try { setF(p => ({ ...p })); const url = await uploadImage(file); setF(p => ({ ...p, image: url })); notify("Image uploaded."); } catch (x) { notify(x.message); } setBusy(false); };
  const save = async e => { e.preventDefault(); setBusy(true);
    const data = { ...f, cat: f.cat || f.sec, author: f.author || "TrendSpot Staff", min: +f.min || 4 };
    try { if (editId) await updateDoc(doc(db, "articles", editId), data);
      else await addDoc(collection(db, "articles"), { ...data, views: 0, createdAt: serverTimestamp() });
      notify(editId ? "Story updated." : "Story published."); setF(EMPTY); setEditId(null);
    } catch (x) { notify(x.message); } setBusy(false); };
  const edit = a => { setEditId(a.id); setF({ ...EMPTY, ...a }); window.scrollTo(0, 0); };
  const del = async a => { if (window.confirm(`Delete "${a.title}"?`)) await deleteDoc(doc(db, "articles", a.id)); };
  const seed = async () => { const b = writeBatch(db), now = Date.now();
    SEED.forEach((s, i) => b.set(doc(collection(db, "articles")), { sec: s[0], cat: s[1], title: s[2], deck: s[3], author: s[4], min: s[5], c: s[6] === "c", f: s[6] === "f",
      views: typeof s[6] === "number" ? s[6] * 1000 : 0, body: "Full story text goes here.", image: "", createdAt: Timestamp.fromMillis(now - i * 18 * 6e4) }));
    await b.commit(); notify("Sample stories loaded."); };

  return (<div className="page"><div className="adm"><h2>{editId ? "Edit story" : "Publish a story"}</h2>
    <form className="adm" onSubmit={save} style={{ padding: 0 }}>
      <input placeholder="Headline" required value={f.title} onChange={set("title")} /><input placeholder="Deck (short summary)" value={f.deck} onChange={set("deck")} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}><select value={f.sec} onChange={set("sec")}>{SECS.slice(1).map(s => <option key={s}>{s}</option>)}</select>
        <input placeholder="Label e.g. Runway" value={f.cat} onChange={set("cat")} /></div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 90px", gap: 10 }}><input placeholder="Author" value={f.author} onChange={set("author")} />
        <input type="number" min="1" value={f.min} onChange={set("min")} aria-label="Minutes to read" /></div>
      <input type="file" accept="image/*" onChange={pick} />{f.image && <input value={f.image} onChange={set("image")} aria-label="Image URL" />}
      <textarea rows="8" required placeholder="Story body (blank line = new paragraph)" value={f.body} onChange={set("body")} />
      <label><input type="checkbox" checked={!!f.c} onChange={set("c")} /> Make cover story</label>
      <label><input type="checkbox" checked={!!f.f} onChange={set("f")} /> Show in Awards &amp; Features band</label>
      <div style={{ display: "flex", gap: 10 }}><button className="btn2" disabled={busy}>{busy ? "Working…" : editId ? "Save changes" : "Publish"}</button>
        {editId && <button type="button" className="btn2 o" onClick={() => { setEditId(null); setF(EMPTY); }}>Cancel</button>}</div></form>
    <h2 style={{ fontSize: 20, marginTop: 16 }}>Manage stories ({items.length})</h2>
    {items.map(a => <div className="row" key={a.id}><span>{a.title}</span><span style={{ display: "flex", gap: 8 }}>
      <button className="btn2 o" onClick={() => edit(a)}>Edit</button><button className="btn2 o" onClick={() => del(a)}>Delete</button></span></div>)}
    <div style={{ display: "flex", gap: 10, marginTop: 12 }}>{!items.length && <button className="btn2" onClick={seed}>Load sample stories</button>}
      <button className="btn2 o" onClick={() => signOut(auth)}>Sign out</button></div></div></div>);
}
