import { useState } from "react"; import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase"; import { useApp } from "../context";
export default function Tip() {
  const { notify } = useApp(), [f, setF] = useState({ message: "", contact: "" });
  const send = async e => { e.preventDefault(); try { await addDoc(collection(db, "tips"), { ...f, createdAt: serverTimestamp() }); setF({ message: "", contact: "" }); notify("Tip sent. Thank you."); } catch { notify("Could not send your tip."); } };
  return <div className="page"><form className="adm" onSubmit={send}><h2>Got a tip?</h2><textarea rows="6" required placeholder="What did you see or hear?" value={f.message} onChange={e => setF({ ...f, message: e.target.value })} />
    <input placeholder="Email or phone (optional)" value={f.contact} onChange={e => setF({ ...f, contact: e.target.value })} /><button className="btn2">Send tip</button></form></div>;
}
