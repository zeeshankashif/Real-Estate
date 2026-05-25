import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import SiteNavbar from "../components/SiteNavbar";
import { api, mapProperty } from "../api";
import { useAuth } from "../context/AuthContext";
import {
  NAV_LINKS,
  STATS,
  CITIES,
  AGENTS,
  TESTIMONIALS,
  SCROLL_ZONES,
  FALLBACK_PROPERTIES,
} from "../data/siteData";

function StarRating({ rating }) {
  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} className={s <= Math.round(rating) ? "star filled" : "star"}>
          ★
        </span>
      ))}
      <span className="rating-number">{rating}</span>
    </div>
  );
}

function PropertyTag({ tag }) {
  const tagClass =
    {
      Featured: "tag-featured",
      New: "tag-new",
      Exclusive: "tag-exclusive",
      "Hot Deal": "tag-hot",
    }[tag] || "tag-featured";
  return <span className={`property-tag ${tagClass}`}>{tag}</span>;
}

function GlassModal({ open, title, onClose, children, wide }) {
  if (!open) return null;
  return (
    <div className="modal-root">
      <button type="button" className="modal-backdrop" aria-label="Close" onClick={onClose} />
      <div className={`modal-panel glass-panel ${wide ? "modal-wide" : ""}`} role="dialog" aria-modal="true">
        <div className="modal-head">
          <h2 className="modal-title">{title}</h2>
          <button type="button" className="modal-x" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}

function Hero({ onSearch }) {
  const [query, setQuery] = useState("");
  const [intent, setIntent] = useState("Buy");
  const [city, setCity] = useState("All Cities");
  const [structureType, setStructureType] = useState("All Types");

  const handleSearch = () => {
    onSearch({ query, city, structureType, intent });
    document.querySelector("#properties")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="home" className="hero">
      <div className="hero-video-bg">
        <img src="https://images.pexels.com/photos/13772063/pexels-photo-13772063.jpeg?_gl=1*18uvzqs*_ga*MTA2NTI2Mjk4My4xNzc4Nzc4ODk0*_ga_8JE65Q40S6*czE3Nzg3Nzg4OTQkbzEkZzEkdDE3Nzg3NzkyMjEkajQ3JGwwJGgw" alt="" className="hero-bg-img" />
      </div>
      <div className="hero-bg-overlay" aria-hidden="true" />
      <div className="hero-content">
        <p className="hero-eyebrow kinetic-eyebrow">Pakistan&apos;s pulse for property</p>
        <h1 className="hero-headline">
          LIVE LOUDER
          <br />
          <span className="headline-gradient">FIND YOUR NEXT MOVE</span>
        </h1>
        <p className="hero-subtext">Verified listings, instant offers, concierge chat — built for people who hate boring portals.</p>
        <div className="hero-search-box glass-panel">
          <div className="search-tabs">
            {["Buy", "Rent", "New Projects"].map((tab) => (
              <button key={tab} type="button" className={`search-tab ${intent === tab ? "active-tab" : ""}`} onClick={() => setIntent(tab)}>
                {tab}
              </button>
            ))}
          </div>
          <div className="search-fields">
            <select className="search-select" value={city} onChange={(e) => setCity(e.target.value)}>
              <option>All Cities</option>
              {CITIES.map((c) => (
                <option key={c.name}>{c.name}</option>
              ))}
            </select>
            <input
              className="search-input"
              placeholder="Search by vibe, area, or keyword…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <select className="search-select" value={structureType} onChange={(e) => setStructureType(e.target.value)}>
              <option>All Types</option>
              <option>House</option>
              <option>Apartment</option>
              <option>Plot</option>
              <option>Commercial</option>
              <option>Farmhouse</option>
              <option>Penthouse</option>
            </select>
            <button type="button" className="search-btn" onClick={handleSearch}>
              <span className="search-icon">⌕</span> Search
            </button>
          </div>
        </div>
        <div className="hero-quick-stats">
          {STATS.map((s) => (
            <div key={s.label} className="quick-stat glass-panel">
              <span className="quick-stat-num">{s.number}</span>
              <span className="quick-stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PropertyCard({ property, index, saved, onToggleSave, onOpen, user }) {
  return (
    <article className="property-card glass-panel" style={{ animationDelay: `${index * 0.06}s` }}>
      <button type="button" className="card-image-wrap" onClick={() => onOpen(property)}>
        <img src={property.img} alt="" className="card-image" loading="lazy" />
        <PropertyTag tag={property.tag} />
        <button
          type="button"
          className={`save-btn ${saved ? "saved" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleSave(property);
          }}
          aria-label="Save"
        >
          {saved ? "♥" : "♡"}
        </button>
        <div className="card-type-badge">{property.type}</div>
      </button>
      <div className="card-body">
        <div className="card-price-row">
          <span className="card-price">{property.price}</span>
          <span className="card-area">{property.area}</span>
        </div>
        <h3 className="card-title underline-hover">{property.title}</h3>
        <p className="card-location">
          <span className="location-icon">📍</span> {property.location}
        </p>
        {property.beds > 0 ? (
          <div className="card-features">
            <span className="feature-item">
              <span className="feature-icon">🛏</span> {property.beds} Beds
            </span>
            <span className="feature-divider">|</span>
            <span className="feature-item">
              <span className="feature-icon">🚿</span> {property.baths} Baths
            </span>
            <span className="feature-divider">|</span>
            <span className="feature-item">
              <span className="feature-icon">📐</span> {property.area}
            </span>
          </div>
        ) : (
          <div className="card-features">
            <span className="feature-item">
              <span className="feature-icon">📐</span> {property.area}
            </span>
            <span className="feature-divider">|</span>
            <span className="feature-item">
              <span className="feature-icon">🏗</span> Plot / Land
            </span>
          </div>
        )}
        <div className="card-footer">
          <div className="agent-mini" />
          <button type="button" className="view-details-btn" onClick={() => onOpen(property)}>
            View details →
          </button>
        </div>
        {!user && <p className="card-hint">Sign in to sync saves across devices.</p>}
      </div>
    </article>
  );
}

function PropertiesSection({ list, activeType, setActiveType, onOpen, savedSet, onToggleSave, user }) {
  const types = ["All", "House", "Apartment", "Plot", "Commercial", "Farmhouse", "Penthouse"];
  const filtered = list.filter((p) => activeType === "All" || p.type === activeType);
  return (
    <section id="properties" className="properties-section section-pad">
      <header className="section-header section-header--left">
        <p className="section-eyebrow">Browse listings</p>
        <h2 className="section-title">
          Featured <span className="accent-word">Properties</span>
        </h2>
        <p className="section-subtitle">Handpicked energy across Pakistan&apos;s top cities — tap a card to explore offers and chat.</p>
      </header>
      <div className="filter-tabs">
        {types.map((t) => (
          <button key={t} type="button" className={`filter-tab ${activeType === t ? "active-filter" : ""}`} onClick={() => setActiveType(t)}>
            {t}
          </button>
        ))}
      </div>
      <div className="properties-grid">
        {filtered.length ? (
          filtered.map((p, i) => (
            <PropertyCard
              key={p.id}
              property={p}
              index={i}
              saved={savedSet.has(p.id)}
              onToggleSave={onToggleSave}
              onOpen={onOpen}
              user={user}
            />
          ))
        ) : (
          <div className="no-results glass-panel">
            <span className="no-results-icon">🔍</span>
            <p>No properties match that combo. Try another filter.</p>
          </div>
        )}
      </div>
      <div className="load-more-wrap">
        <button type="button" className="load-more-btn" onClick={() => document.querySelector("#cities")?.scrollIntoView({ behavior: "smooth" })}>
          Next: cities tour →
        </button>
      </div>
    </section>
  );
}

function CitiesSection({ onExplore }) {
  return (
    <section id="cities" className="cities-section section-pad">
      <header className="section-header section-header--left">
        <p className="section-eyebrowcity">Explore by Location</p>
        <h2 className="section-titlet">
          Top <span className="accent-word">Cities</span>
        </h2>
        <p className="section-subtitle">Discover properties in Pakistan&apos;s most sought-after real estate markets</p>
      </header>
      <div className="cities-grid">
        {CITIES.map((city, i) => (
          <div key={city.name} className="city-card" style={{ animationDelay: `${i * 0.1}s` }}>
            <img src={city.img} alt="" className="city-img" loading="lazy" />
            <div className="city-overlay" />
            <div className="city-info">
              <h3 className="city-name">{city.name}</h3>
              <p className="city-count">{city.count} Properties</p>
              <button type="button" className="city-explore-btn" onClick={() => onExplore(city.name)}>
                Explore →
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function StatsSection() {
  const ref = useRef();
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) setVisible(true);
    }, { threshold: 0.25 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <section id="about" className="stats-section section-pad" ref={ref}>
      <div className="stats-bg-pattern" />
      <div className="stats-content">
        <header className="section-header section-header--left stats-header">
          <p className="section-eyebrow light-eyebrow">Why Zexan hits different</p>
          <h2 className="section-title light-title">
            Built for <span className="accent-word">velocity</span> & trust
          </h2>
          <p className="section-subtitle light-sub">Transparent data, concierge humans, and tooling that feels like 2030 — not 2012.</p>
        </header>
        <div className={`stats-grid ${visible ? "stats-visible" : ""}`}>
          {STATS.map((s, i) => (
            <div key={s.label} className="stat-item glass-panel" style={{ animationDelay: `${i * 0.12}s` }}>
              <div className="stat-number">{s.number}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ServicesSection() {
  const services = [
    { icon: "🏠", title: "Buy a property", desc: "Verified listings, digital offers, and guided closing." },
    { icon: "🔑", title: "Rent & lease", desc: "Flexible terms, vetted landlords, instant chat." },
    { icon: "📋", title: "List your space", desc: "Launch a cinematic listing in minutes — photos, price, story." },
    { icon: "💼", title: "Portfolio care", desc: "Management, renewals, and reporting in one joyful hub." },
    { icon: "📊", title: "Market radar", desc: "Live comps, micro-neighbourhood trends, investment nudges." },
    { icon: "⚖️", title: "Legal lift", desc: "Registry, NOC, and transfer partners on speed dial." },
  ];
  return (
    <section id="services" className="services-section section-pad">
      <header className="section-header section-header--left">
        <p className="section-eyebrowcity">What we unlock</p>
        <h2 className="section-titlet">
          Signature <span className="accent-word">Services</span>
        </h2>
        <p className="section-subtitle">Everything you need to move fast without losing the human touch.</p>
      </header>
      <div className="services-grid">
        {services.map((s, i) => (
          <div key={s.title} className="service-card glass-panel" style={{ animationDelay: `${i * 0.07}s` }}>
            <div className="service-icon-wrap">
              <span className="service-icon">{s.icon}</span>
            </div>
            <h3 className="service-title underline-hover">{s.title}</h3>
            <p className="service-desc">{s.desc}</p>
            <button type="button" className="service-learn-btn" onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })}>
              Book a human →
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

function AgentsSection({ onMessage }) {
  return (
    <section id="agents" className="agents-section section-pad">
      <header className="section-header section-header--left">
        <p className="section-eyebrow">Meet the experts</p>
        <h2 className="section-title">
          Top <span className="accent-word">Agents</span>
        </h2>
        <p className="section-subtitle">Local legends with national reach — message them through Zexan chat.</p>
      </header>
      <div className="agents-grid">
        {AGENTS.map((agent, i) => (
          <div key={agent.id} className="agent-card glass-panel" style={{ animationDelay: `${i * 0.07}s` }}>
            <div className="agent-image-wrap">
              <img src={agent.img} alt="" className="agent-img" loading="lazy" />
              <div className="agent-city-badge">{agent.city}</div>
            </div>
            <div className="agent-info">
              <h3 className="agent-name">{agent.name}</h3>
              <p className="agent-title">{agent.title}</p>
              <StarRating rating={agent.rating} />
              <div className="agent-stats">
                <span className="agent-stat">
                  <strong>{agent.deals}</strong> deals
                </span>
                <span className="agent-stat-divider">|</span>
                <span className="agent-stat">⭐ {agent.rating}</span>
              </div>
              <div className="agent-actions">
                <a href={`tel:${agent.phone}`} className="agent-call-btn">
                  📞 Call
                </a>
                <button type="button" className="agent-msg-btn" onClick={() => onMessage(agent)}>
                  💬 Message
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function TestimonialsSection() {
  const [active, setActive] = useState(0);
  return (
    <section className="testimonials-section section-pad">
      <header className="section-header section-header--left">
        <p className="section-eyebrow">Client stories</p>
        <h2 className="section-title">
          Voices that <span className="accent-word">vibe</span>
        </h2>
      </header>
      <div className="testimonials-track">
        {TESTIMONIALS.map((t, i) => (
          <div key={t.name} className={`testimonial-card glass-panel ${i === active ? "testimonial-active" : ""}`}>
            <div className="testimonial-quote-mark">"</div>
            <p className="testimonial-text">{t.text}</p>
            <div className="testimonial-author">
              <div className="testimonial-author-info">
                <strong className="testimonial-name">{t.name}</strong>
                <span className="testimonial-role">
                  {t.role} — {t.city}
                </span>
                <StarRating rating={t.rating} />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="testimonial-dots">
        {TESTIMONIALS.map((_, i) => (
          <button key={i} type="button" className={`dot ${i === active ? "dot-active" : ""}`} onClick={() => setActive(i)} aria-label={`Slide ${i + 1}`} />
        ))}
      </div>
    </section>
  );
}

function ContactSection() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "", type: "Buy" });
  const [sent, setSent] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api("/contact", { method: "POST", body: JSON.stringify(form) });
      setSent(true);
      setTimeout(() => setSent(false), 4000);
      setForm({ name: "", phone: "", email: "", message: "", type: "Buy" });
    } catch {
      setSent(true);
      setTimeout(() => setSent(false), 4000);
    }
  };
  return (
    <section id="contact" className="contact-section section-pad">
      <div className="contact-inner">
        <div className="contact-left">
          <p className="section-eyebrowcity">Get in touch</p>
          <h2 className="contact-titlet">
            Let&apos;s orchestrate your <span className="accent-word">next move</span>
          </h2>
          <p className="contact-subtitle">Drop a line — our humans + automations reply within hours, not days.</p>
          <div className="contact-info-list">
            <div className="contact-info-item glass-panel">
              <span className="contact-info-icon">📞</span>
              <div>
                <strong>Call us</strong>
                <p>+92 42 111 000 786</p>
              </div>
            </div>
            <div className="contact-info-item glass-panel">
              <span className="contact-info-icon">📧</span>
              <div>
                <strong>Email</strong>
                <p>info@zexan.pk</p>
              </div>
            </div>
            <div className="contact-info-item glass-panel">
              <span className="contact-info-icon">📍</span>
              <div>
                <strong>Studio</strong>
                <p>25-B, Gulberg III, Lahore</p>
              </div>
            </div>
          </div>
        </div>
        <div className="contact-right">
          {sent ? (
            <div className="success-message glass-panel">
              <span className="success-icon">✅</span>
              <h3>Message sent!</h3>
              <p>We&apos;ll ping you shortly — keep an eye on your inbox.</p>
            </div>
          ) : (
            <form className="contact-form glass-panel" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Full name</label>
                  <input className="form-input" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input className="form-input" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input className="form-input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">I&apos;m looking to</label>
                <select className="form-select" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                  <option>Buy</option>
                  <option>Rent</option>
                  <option>Sell</option>
                  <option>Invest</option>
                  <option>Get valuation</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Message</label>
                <textarea className="form-textarea" rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
              </div>
              <button type="submit" className="form-submit-btn">
                Send enquiry →
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner section-pad">
        <div className="footer-top">
        <div className="footer-brand">
          <div className="footer-logo">
            <span className="logo-icon">◆</span>
            <span>ZEXAN</span>
          </div>
          <p className="footer-desc">Pakistan&apos;s kinetic real estate layer — listings, offers, chat, and concierge in one flow.</p>
          <div className="footer-socials">
            <a href="https://facebook.com" className="social-btn" aria-label="Facebook">
              f
            </a>
            <a href="https://instagram.com" className="social-btn" aria-label="Instagram">
              in
            </a>
            <a href="https://twitter.com" className="social-btn" aria-label="X">
              𝕏
            </a>
            <a href="https://youtube.com" className="social-btn" aria-label="YouTube">
              ▶
            </a>
          </div>
        </div>
        <div className="footer-links-col">
          <h4 className="footer-col-title">Quick links</h4>
          {NAV_LINKS.map((l) => (
            <a key={l.label} href={l.href} className="footer-link">
              {l.label}
            </a>
          ))}
        </div>
        <div className="footer-links-col">
          <h4 className="footer-col-title">Property types</h4>
          {["Houses", "Apartments", "Plots", "Commercial", "Farmhouses", "Penthouses", "New projects"].map((t) => (
            <a key={t} href="#properties" className="footer-link">
              {t}
            </a>
          ))}
        </div>
        <div className="footer-links-col">
          <h4 className="footer-col-title">Top cities</h4>
          {CITIES.map((c) => (
            <a key={c.name} href="#cities" className="footer-link">
              {c.name}
            </a>
          ))}
        </div>
        <div className="footer-links-col">
          <h4 className="footer-col-title">Account</h4>
          <Link to="/login" className="footer-link">
            Log in
          </Link>
          <Link to="/signup" className="footer-link">
            Sign up
          </Link>
        </div>
        </div>
        <div className="footer-bottom">
          <p className="footer-copy">© 2026 Zexan Real Estate Pvt. Ltd.</p>
          <div className="footer-legal">
            <a href="#contact" className="footer-legal-link">
              Privacy
            </a>
            <a href="#contact" className="footer-legal-link">
              Terms
            </a>
            <a href="#contact" className="footer-legal-link">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function HomePage() {
  const { user, ready } = useAuth();
  const [activeSection, setActiveSection] = useState("home");
  const [properties, setProperties] = useState([]);
  const [activeType, setActiveType] = useState("All");
  const [filters, setFilters] = useState({ query: "", city: "All Cities", structureType: "All Types" });
  const [savedSet, setSavedSet] = useState(() => new Set());
  const [supportUserId, setSupportUserId] = useState(null);
  const [toast, setToast] = useState("");
  const [hotOpen, setHotOpen] = useState(false);
  const [modal, setModal] = useState({ type: null, property: null, agent: null });
  const [offerForm, setOfferForm] = useState({ amount: "", message: "" });
  const [chatText, setChatText] = useState("");
  const [listForm, setListForm] = useState({
    title: "",
    location: "",
    price: "",
    type: "House",
    beds: 3,
    baths: 2,
    area: "",
    tag: "New",
    img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
    description: "",
  });

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3200);
  }, []);

  const loadSaves = useCallback(async () => {
    if (!user) {
      setSavedSet(new Set());
      return;
    }
    try {
      const saved = await api("/saves/");
      const ids = new Set(saved.map((p) => String(p._id || p.id)));
      setSavedSet(ids);
    } catch {
      /* ignore */
    }
  }, [user]);

  const loadProps = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (filters.query?.trim()) params.set("q", filters.query.trim());
      if (filters.city && filters.city !== "All Cities") params.set("city", filters.city);
      if (filters.structureType && filters.structureType !== "All Types") params.set("type", filters.structureType);
      const data = await api(`/properties?${params.toString()}`);
      setProperties(data.map(mapProperty));
    } catch {
      setProperties(FALLBACK_PROPERTIES);
      showToast("API offline — showing demo card. Start Mongo + backend for live data.");
    }
  }, [filters, showToast]);

  useEffect(() => {
    loadProps();
  }, [loadProps]);

  useEffect(() => {
    (async () => {
      try {
        const s = await api("/public/support");
        setSupportUserId(s.userId);
      } catch {
        /* ignore */
      }
    })();
  }, []);

  useEffect(() => {
    if (user) loadSaves();
  }, [user, loadSaves]);

  useEffect(() => {
    const t = setTimeout(() => setHotOpen(true), 1400);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const sections = NAV_LINKS.map((l) => l.href.replace("#", ""));
    const observers = sections.map((id) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const obs = new IntersectionObserver(([e]) => {
        if (e.isIntersecting) setActiveSection(id);
      }, { threshold: 0.35 });
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach((o) => o?.disconnect());
  }, []);

  useEffect(() => {
    const els = SCROLL_ZONES.map((z) => document.getElementById(z.id)).filter(Boolean);
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          const id = e.target.id;
          const zone = SCROLL_ZONES.find((z) => z.id === id);
          if (zone) document.documentElement.dataset.viewport = zone.attr;
        }
      },
      { threshold: 0.45 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [ready]);

  const filteredProps = useMemo(() => properties, [properties]);

  const hotDeal = useMemo(() => filteredProps.find((p) => p.tag === "Hot Deal") || filteredProps[0], [filteredProps]);

  const onHeroSearch = (f) => {
    setFilters({ query: f.query || "", city: f.city || "All Cities", structureType: f.structureType || "All Types" });
  };

  const toggleSave = async (property) => {
    if (!user) {
      showToast("Log in to save listings to your profile.");
      return;
    }
    const id = property.id;
    try {
      if (savedSet.has(id)) {
        await api(`/saves/${id}`, { method: "DELETE" });
        setSavedSet((prev) => {
          const n = new Set(prev);
          n.delete(id);
          return n;
        });
        showToast("Removed from saved.");
      } else {
        await api(`/saves/${id}`, { method: "POST" });
        setSavedSet((prev) => new Set(prev).add(id));
        showToast("Saved to your vault ⚡");
      }
    } catch (e) {
      showToast(e.message || "Could not update save");
    }
  };

  const openDetail = (property) => setModal({ type: "detail", property, agent: null });
  const closeModal = () => {
    setModal({ type: null, property: null, agent: null });
    setOfferForm({ amount: "", message: "" });
    setChatText("");
  };

  const submitOffer = async () => {
    if (!user) return showToast("Log in to send an offer.");
    if (!modal.property) return;
    try {
      await api("/offers/", {
        method: "POST",
        body: JSON.stringify({
          propertyId: modal.property.id,
          amount: offerForm.amount || modal.property.price,
          message: offerForm.message,
        }),
      });
      showToast("Offer transmitted to the listing owner.");
      closeModal();
    } catch (e) {
      showToast(e.message || "Offer failed");
    }
  };

  const submitChat = async () => {
    if (!user) return showToast("Log in to chat.");
    const to = supportUserId;
    if (!to) return showToast("Chat routing unavailable — start the API.");
    try {
      await api("/messages/", {
        method: "POST",
        body: JSON.stringify({
          toUserId: to,
          body: chatText,
          propertyId: modal.property?.id || undefined,
        }),
      });
      showToast("Message launched 🚀");
      closeModal();
    } catch (e) {
      showToast(e.message || "Message failed");
    }
  };

  const submitListing = async (e) => {
    e.preventDefault();
    if (!user) return showToast("Log in to list a property.");
    try {
      await api("/properties/", {
        method: "POST",
        body: JSON.stringify({
          title: listForm.title,
          location: listForm.location,
          price: listForm.price,
          type: listForm.type,
          beds: Number(listForm.beds) || 0,
          baths: Number(listForm.baths) || 0,
          area: listForm.area,
          tag: listForm.tag,
          img: listForm.img,
          description: listForm.description,
          agent: user.name,
          agentImg: user.avatar || "",
        }),
      });
      showToast("Listing published to the grid.");
      closeModal();
      loadProps();
    } catch (ex) {
      showToast(ex.message || "Could not publish");
    }
  };

  const onAgentMessage = (agent) => {
    if (!user) return showToast("Log in to message agents.");
    setModal({ type: "chat", property: null, agent });
    setChatText(`Hi ${agent.name}, I'd love help with `);
  };

  const onCityExplore = (name) => {
    setFilters((f) => ({ ...f, city: name }));
    document.querySelector("#properties")?.scrollIntoView({ behavior: "smooth" });
  };

  if (!ready) {
    return (
      <div className="app app-loading">
        <div className="loading-orbit" />
      </div>
    );
  }

  return (
    <div className="app">
      <SiteNavbar activeSection={activeSection} onListProperty={() => setModal({ type: "list", property: null, agent: null })} />
      <Hero onSearch={onHeroSearch} />
      <PropertiesSection
        list={filteredProps}
        activeType={activeType}
        setActiveType={setActiveType}
        onOpen={openDetail}
        savedSet={savedSet}
        onToggleSave={toggleSave}
        user={user}
      />
      <CitiesSection onExplore={onCityExplore} />
      <AgentsSection onMessage={onAgentMessage} />
      <ServicesSection />
      <TestimonialsSection />
      <StatsSection />
      <ContactSection />
      <Footer />

      {hotOpen && hotDeal && (
        <div className="hot-deal-pop glass-panel">
          <button type="button" className="hot-deal-close" onClick={() => setHotOpen(false)} aria-label="Close">
            ×
          </button>
          <div className="hot-deal-tag">Hot deal</div>
          <p className="hot-deal-title">{hotDeal.title}</p>
          <p className="hot-deal-price">{hotDeal.price}</p>
          <div className="hot-deal-actions">
            <button
              type="button"
              className="hot-deal-btn"
              onClick={() => {
                setHotOpen(false);
                openDetail(hotDeal);
              }}
            >
              View pulse
            </button>
            <button type="button" className="hot-deal-ghost" onClick={() => setHotOpen(false)}>
              Later
            </button>
          </div>
        </div>
      )}

      {toast && <div className="toast-pop glass-panel">{toast}</div>}

      <GlassModal open={modal.type === "detail"} title={modal.property?.title || ""} onClose={closeModal} wide>
        {modal.property && (
          <div className="detail-grid">
            <img src={modal.property.img} alt="" className="detail-img" />
            <div>
              <p className="detail-price">{modal.property.price}</p>
              <p className="detail-loc">📍 {modal.property.location}</p>
              <p className="detail-desc">{modal.property.description || "Premium residence with smart layouts and gallery lighting."}</p>
              <div className="detail-actions">
                <button type="button" className="pill-btn" onClick={() => setModal({ type: "offer", property: modal.property, agent: null })}>
                  Make offer
                </button>
                <button type="button" className="pill-btn pill-ghost" onClick={() => setModal({ type: "chat", property: modal.property, agent: null })}>
                  Chat
                </button>
                <button type="button" className="pill-btn pill-ghost" onClick={() => toggleSave(modal.property)}>
                  {savedSet.has(modal.property.id) ? "Saved" : "Save"}
                </button>
                <button
                  type="button"
                  className="pill-btn pill-danger"
                  onClick={() => {
                    closeModal();
                    document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
                    showToast("Concierge notified — tell us you want this home in the form.");
                  }}
                >
                  Buy now
                </button>
              </div>
            </div>
          </div>
        )}
      </GlassModal>

      <GlassModal open={modal.type === "offer"} title="Send an offer" onClose={closeModal}>
        <p className="modal-lead">We route this securely to the listing owner.</p>
        <label className="auth-label">Your amount (PKR)</label>
        <input className="auth-input" value={offerForm.amount} onChange={(e) => setOfferForm({ ...offerForm, amount: e.target.value })} placeholder={modal.property?.price} />
        <label className="auth-label">Note</label>
        <textarea className="form-textarea" rows={3} value={offerForm.message} onChange={(e) => setOfferForm({ ...offerForm, message: e.target.value })} />
        <button type="button" className="auth-submit" onClick={submitOffer}>
          Transmit offer
        </button>
      </GlassModal>

      <GlassModal open={modal.type === "chat"} title={modal.agent ? `Message ${modal.agent.name}` : "Concierge chat"} onClose={closeModal}>
        <p className="modal-lead">Routed through Zexan — fast, logged, and kind.</p>
        <textarea className="form-textarea" rows={4} value={chatText} onChange={(e) => setChatText(e.target.value)} />
        <button type="button" className="auth-submit" onClick={submitChat}>
          Send message
        </button>
      </GlassModal>

      <GlassModal open={modal.type === "list"} title="List your property" onClose={closeModal} wide>
        <form className="list-form" onSubmit={submitListing}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Title</label>
              <input className="form-input" required value={listForm.title} onChange={(e) => setListForm({ ...listForm, title: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Location</label>
              <input className="form-input" required value={listForm.location} onChange={(e) => setListForm({ ...listForm, location: e.target.value })} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Price (text)</label>
              <input className="form-input" required value={listForm.price} onChange={(e) => setListForm({ ...listForm, price: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Type</label>
              <select className="form-select" value={listForm.type} onChange={(e) => setListForm({ ...listForm, type: e.target.value })}>
                {["House", "Apartment", "Plot", "Commercial", "Farmhouse", "Penthouse"].map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Beds</label>
              <input className="form-input" type="number" value={listForm.beds} onChange={(e) => setListForm({ ...listForm, beds: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Baths</label>
              <input className="form-input" type="number" value={listForm.baths} onChange={(e) => setListForm({ ...listForm, baths: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Area</label>
              <input className="form-input" value={listForm.area} onChange={(e) => setListForm({ ...listForm, area: e.target.value })} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Image URL</label>
            <input className="form-input" value={listForm.img} onChange={(e) => setListForm({ ...listForm, img: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Story / description</label>
            <textarea className="form-textarea" rows={3} value={listForm.description} onChange={(e) => setListForm({ ...listForm, description: e.target.value })} />
          </div>
          <button type="submit" className="form-submit-btn">
            Publish listing
          </button>
        </form>
      </GlassModal>
    </div>
  );
}
