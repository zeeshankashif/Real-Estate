import React, { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api, mapProperty } from "../api";

export default function AccountPage() {
  const { user, ready, logout } = useAuth();
  const nav = useNavigate();
  const [tab, setTab] = useState("saved");
  const [saved, setSaved] = useState([]);
  const [offers, setOffers] = useState([]);
  const [inbox, setInbox] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (ready && !user) nav("/login", { replace: true, state: { from: "/account" } });
  }, [ready, user, nav]);

  const load = useCallback(async () => {
    if (!user) return;
    setErr("");
    setLoading(true);
    try {
      if (tab === "saved") {
        const list = await api("/saves/");
        setSaved(list.map(mapProperty));
      } else if (tab === "offers") {
        const list = await api("/offers/mine");
        setOffers(list);
      } else {
        const list = await api("/messages/inbox");
        setInbox(list);
      }
    } catch (e) {
      setErr(e.message || "Could not load");
      setSaved([]);
      setOffers([]);
      setInbox([]);
    } finally {
      setLoading(false);
    }
  }, [user, tab]);

  useEffect(() => {
    if (user) load();
  }, [user, load]);

  if (!ready || !user) {
    return (
      <div className="app app-loading">
        <div className="loading-orbit" />
      </div>
    );
  }

  return (
    <div className="account-page">
      <header className="account-top glass-panel">
        <Link to="/" className="logo-zexan">
          ZEXAN
        </Link>
        <nav className="account-nav">
          <Link to="/" className="nav-text-btn">
            ← Home
          </Link>
          <button type="button" className="nav-text-btn" onClick={logout}>
            Log out
          </button>
        </nav>
      </header>

      <main className="account-main glass-panel">
        <h1 className="account-title">Your hub</h1>
        <p className="account-lead">Saved homes, offers you sent, and recent messages.</p>

        <div className="account-tabs">
          {[
            { id: "saved", label: "Saved" },
            { id: "offers", label: "My offers" },
            { id: "inbox", label: "Inbox" },
          ].map((t) => (
            <button key={t.id} type="button" className={`account-tab ${tab === t.id ? "account-tab-active" : ""}`} onClick={() => setTab(t.id)}>
              {t.label}
            </button>
          ))}
        </div>

        {err && <p className="auth-error">{err}</p>}
        {loading && <p className="account-muted">Loading…</p>}

        {!loading && tab === "saved" && (
          <ul className="account-list">
            {saved.length === 0 && <li className="account-muted">No saves yet — heart a listing on the home page.</li>}
            {saved.map((p) => (
              <li key={p.id} className="account-row">
                <img src={p.img} alt="" className="account-thumb" />
                <div>
                  <strong>{p.title}</strong>
                  <div className="account-muted">{p.location}</div>
                </div>
                <span className="account-price">{p.price}</span>
              </li>
            ))}
          </ul>
        )}

        {!loading && tab === "offers" && (
          <ul className="account-list">
            {offers.length === 0 && <li className="account-muted">No offers yet — open a property and tap “Make offer”.</li>}
            {offers.map((o) => (
              <li key={o._id} className="account-row account-row-stack">
                <div>
                  <strong>{o.property?.title || "Property"}</strong>
                  <div className="account-muted">{o.property?.location}</div>
                </div>
                <div className="account-offer-meta">
                  <span className="account-price">{o.amount}</span>
                  <span className={`account-status account-status-${o.status}`}>{o.status}</span>
                </div>
              </li>
            ))}
          </ul>
        )}

        {!loading && tab === "inbox" && (
          <ul className="account-list">
            {inbox.length === 0 && <li className="account-muted">No messages yet.</li>}
            {inbox.slice(0, 40).map((m) => (
              <li key={m._id} className="account-row account-row-stack">
                <div>
                  <strong>{m.fromUser?.name || m.toUser?.name || "User"}</strong>
                  <div className="account-msg">{m.body}</div>
                  <div className="account-muted">{new Date(m.createdAt).toLocaleString()}</div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
