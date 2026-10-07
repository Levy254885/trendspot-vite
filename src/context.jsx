import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { collection, query, orderBy, limit, onSnapshot, doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "./firebase";

const Ctx = createContext(null); export const useApp = () => useContext(Ctx);

export function AppProvider({ children }) {
  const [items, setItems] = useState([]), [loading, setLoading] = useState(true), [error, setError] = useState("");
  const [user, setUser] = useState(null), [isAdmin, setIsAdmin] = useState(false), [authReady, setAuthReady] = useState(false);
  const [toast, setToast] = useState("");
  useEffect(() => onSnapshot(query(collection(db, "articles"), orderBy("createdAt", "desc"), limit(120)),
    s => { setItems(s.docs.map(d => ({ id: d.id, ...d.data() }))); setLoading(false); },
    e => { setError(e.message); setLoading(false); }), []);
  useEffect(() => onAuthStateChanged(auth, async u => {
    setUser(u); setIsAdmin(false);
    if (u) { try { setIsAdmin((await getDoc(doc(db, "admins", u.uid))).exists()); } catch { /* not admin */ } }
    setAuthReady(true);
  }), []);
  const notify = useCallback(m => { setToast(m); setTimeout(() => setToast(""), 2600); }, []);
  return <Ctx.Provider value={{ items, loading, error, user, isAdmin, authReady, notify }}>{children}{toast && <div className="toast" style={{ display: "block" }} role="status">{toast}</div>}</Ctx.Provider>;
}
