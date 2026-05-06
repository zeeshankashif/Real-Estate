import React, { useState, useEffect, useRef } from "react";
import "./App.css";

// ─── DATA ───────────────────────────────────────────────────────────────────

const FEATURED_PROPERTIES = [
  {
    id: 1,
    title: "Platinum Sky Residences",
    location: "DHA Phase 6, Lahore",
    price: "PKR 4,85,00,000",
    priceShort: "4.85 Cr",
    type: "House",
    beds: 5,
    baths: 4,
    area: "1 Kanal",
    tag: "Featured",
    img: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80",
    agent: "Ali Hassan",
    agentImg: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: 2,
    title: "Gulberg Grand Tower",
    location: "Gulberg III, Lahore",
    price: "PKR 2,20,00,000",
    priceShort: "2.20 Cr",
    type: "Apartment",
    beds: 3,
    baths: 2,
    area: "2,400 sqft",
    tag: "New",
    img: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80",
    agent: "Sara Malik",
    agentImg: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    id: 3,
    title: "Bahria Luxury Farmhouse",
    location: "Bahria Town, Islamabad",
    price: "PKR 9,50,00,000",
    priceShort: "9.50 Cr",
    type: "Farmhouse",
    beds: 7,
    baths: 6,
    area: "4 Kanal",
    tag: "Exclusive",
    img: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
    agent: "Kamran Shah",
    agentImg: "https://randomuser.me/api/portraits/men/55.jpg",
  },
  {
    id: 4,
    title: "Clifton Sea-View Penthouse",
    location: "Clifton Block 5, Karachi",
    price: "PKR 6,75,00,000",
    priceShort: "6.75 Cr",
    type: "Penthouse",
    beds: 4,
    baths: 3,
    area: "3,800 sqft",
    tag: "Hot Deal",
    img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
    agent: "Nadia Rauf",
    agentImg: "https://randomuser.me/api/portraits/women/68.jpg",
  },
  {
    id: 5,
    title: "Model Town Classic Villa",
    location: "Model Town, Lahore",
    price: "PKR 3,10,00,000",
    priceShort: "3.10 Cr",
    type: "House",
    beds: 4,
    baths: 3,
    area: "10 Marla",
    tag: "Featured",
    img: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80",
    agent: "Usman Tariq",
    agentImg: "https://randomuser.me/api/portraits/men/22.jpg",
  },
  {
    id: 6,
    title: "F-7 Executive Apartments",
    location: "F-7 Markaz, Islamabad",
    price: "PKR 1,80,00,000",
    priceShort: "1.80 Cr",
    type: "Apartment",
    beds: 2,
    baths: 2,
    area: "1,600 sqft",
    tag: "New",
    img: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80",
    agent: "Fatima Zahra",
    agentImg: "https://randomuser.me/api/portraits/women/12.jpg",
  },
];

const ALL_PROPERTIES = [
  ...FEATURED_PROPERTIES,
  {
    id: 7,
    title: "Defence Luxury Bungalow",
    location: "DHA Phase 2, Karachi",
    price: "PKR 5,60,00,000",
    priceShort: "5.60 Cr",
    type: "House",
    beds: 6,
    baths: 5,
    area: "500 sqyd",
    tag: "Hot Deal",
    img: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80",
    agent: "Bilal Chaudhry",
    agentImg: "https://randomuser.me/api/portraits/men/41.jpg",
  },
  {
    id: 8,
    title: "Johar Town Premium Plot",
    location: "Johar Town, Lahore",
    price: "PKR 1,25,00,000",
    priceShort: "1.25 Cr",
    type: "Plot",
    beds: 0,
    baths: 0,
    area: "1 Kanal",
    tag: "Featured",
    img: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80",
    agent: "Hina Baig",
    agentImg: "https://randomuser.me/api/portraits/women/33.jpg",
  },
];

const AGENTS = [
  {
    id: 1,
    name: "Ali Hassan",
    title: "Senior Property Consultant",
    phone: "+92 300 1234567",
    deals: 148,
    rating: 4.9,
    img: "https://images.unsplash.com/photo-1600603406200-5b2a104684ac?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fG1hbGUlMjBwcm90cmFpdHxlbnwwfHwwfHx8MA%3D%3D",
    city: "Lahore",
  },
  {
    id: 2,
    name: "Sara Malik",
    title: "Luxury Real Estate Specialist",
    phone: "+92 321 9876543",
    deals: 97,
    rating: 4.8,
    img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZmVtYWxlJTIwcHJvdHJhaXR8ZW58MHx8MHx8fDA%3D",
    city: "Lahore",
  },
  {
    id: 3,
    name: "Kamran Shah",
    title: "Investment Property Expert",
    phone: "+92 333 5556677",
    deals: 212,
    rating: 5.0,
    img: "https://images.unsplash.com/photo-1587397845856-e6cf49176c70?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8bWFsZSUyMHByb3RyYWl0fGVufDB8fDB8fHww",
    city: "Islamabad",
  },
  {
    id: 4,
    name: "Nadia Rauf",
    title: "Commercial Real Estate Agent",
    phone: "+92 311 2223344",
    deals: 76,
    rating: 4.7,
    img: "https://plus.unsplash.com/premium_photo-1689551671541-31a345ce6ae0?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZmVtYWxlJTIwcHJvdHJhaXR8ZW58MHx8MHx8fDA%3D",
    city: "Karachi",
  },
];

const STATS = [
  { number: "12,500+", label: "Properties Listed" },
  { number: "8,200+", label: "Happy Clients" },
  { number: "PKR 85B+", label: "Transactions Done" },
  { number: "24", label: "Cities Covered" },
];

const CITIES = [
  { name: "Lahore", count: "3,400+", img: "https://images.unsplash.com/photo-1722238847665-6ee4d376a697?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fG1pbmFyJTIwZSUyMHBha2lzdGFufGVufDB8fDB8fHww" },
  { name: "Karachi", count: "2,800+", img: "https://images.unsplash.com/photo-1606511490662-b2c5be7d95a1?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8a2FyYWNoaXxlbnwwfHwwfHx8MA%3D%3D" },
  { name: "Islamabad", count: "1,900+", img: "https://plus.unsplash.com/premium_photo-1697729758639-d692c36557b2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8bWluYXIlMjBlJTIwcGFraXN0YW58ZW58MHx8MHx8fDA%3D" },
  { name: "Rawalpindi", count: "1,200+", img: "https://plus.unsplash.com/premium_photo-1716721465414-c05196df7198?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cmF3YWxwaW5kaXxlbnwwfHwwfHx8MA%3D%3D" },
  { name: "Faisalabad", count: "890+", img: "https://images.unsplash.com/photo-1674837669081-8d606d4e1ea4?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8ZmFpc2FsYWJhZHxlbnwwfHwwfHx8MA%3D%3D" },
  { name: "Multan", count: "670+", img: "https://images.unsplash.com/photo-1600434890250-44df6e4c0d05?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bXVsdGFufGVufDB8fDB8fHww" },
];

const TESTIMONIALS = [
  {
    name: "Zainab Qadir",
    role: "First-time Homebuyer",
    text: "Zexan helped me find my dream home in DHA within just 3 weeks. The entire process was smooth, transparent, and the agent was incredibly professional. I couldn't be happier!",
    rating: 5,
    img: "https://randomuser.me/api/portraits/women/23.jpg",
    city: "Lahore",
  },
  {
    name: "Tariq Mahmood",
    role: "Property Investor",
    text: "I've invested in 4 properties through Zexan. Their market insights and due diligence process saved me from two bad deals. Truly the best real estate platform in Pakistan.",
    rating: 5,
    img: "https://randomuser.me/api/portraits/men/67.jpg",
    city: "Karachi",
  },
  {
    name: "Ayesha Siddiqui",
    role: "Commercial Tenant",
    text: "Finding office space in Islamabad was a nightmare until I found Vistara. They matched us with the perfect commercial space within budget. Highly recommend!",
    rating: 5,
    img: "https://randomuser.me/api/portraits/women/54.jpg",
    city: "Islamabad",
  },
];

const NAV_LINKS = [
  { label: "HOME", href: "#home" },
  { label: "PROPERTIES", href: "#properties" },
  { label: "CITIES", href: "#cities" },
  { label: "AGENTS", href: "#agents" },
  { label: "SERVICES", href: "#services" },
  { label: "ABOUT", href: "#about" },
  { label: "CONTACT", href: "#contact" },

];

// ─── HELPERS ────────────────────────────────────────────────────────────────

function StarRating({ rating }) {
  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} className={s <= Math.round(rating) ? "star filled" : "star"}>★</span>
      ))}
      <span className="rating-number">{rating}</span>
    </div>
  );
}

function PropertyTag({ tag }) {
  const tagClass = {
    Featured: "tag-featured",
    New: "tag-new",
    Exclusive: "tag-exclusive",
    "Hot Deal": "tag-hot",
  }[tag] || "tag-featured";
  return <span className={`property-tag ${tagClass}`}>{tag}</span>;
}

// ─── SECTIONS ───────────────────────────────────────────────────────────────

function Navbar({ activeSection }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavClick = (href) => {
    setMenuOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className={`navbar ${scrolled ? "navbar-scrolled" : ""}`}>
      <div className="navbar-inner">
        <a href="#home" className="navbar-logo" onClick={() => handleNavClick("#home")}>
          {/* <span className="logo-icon">Z</span> */}
          
          <span className="logo-zexan">ZEXAN</span>
           

          {/* <span className="logo-sub">REAL ESTATE</span> */}
        </a>

        <ul className={`navbar-links ${menuOpen ? "open" : ""}`}>
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className={`nav-link ${activeSection === link.href.replace("#", "") ? "active" : ""}`}
                onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="navbar-actions">
          <a href="#contact" className="nav-cta-btn" onClick={(e) => { e.preventDefault(); handleNavClick("#contact"); }}>
            List Property
          </a>
          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            <span className={menuOpen ? "bar bar1 open" : "bar bar1"}></span>
            <span className={menuOpen ? "bar bar2 open" : "bar bar2"}></span>
            <span className={menuOpen ? "bar bar3 open" : "bar bar3"}></span>
          </button>
        </div>
      </div>
    </nav>
  );
}

function Hero({ onSearch }) {
  const [query, setQuery] = useState("");
  const [propType, setPropType] = useState("All");
  const [city, setCity] = useState("All Cities");

  const handleSearch = () => {
    onSearch({ query, propType, city });
    document.querySelector("#properties")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="home" className="hero">
      <div className="hero-bg-overlay"></div>
      <div className="hero-video-bg">
        <img
          src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1800&q=80"
          alt="bg"
          className="hero-bg-img"
        />
      </div>

      <div className="hero-content">
        <p className="hero-eyebrow">Pakistan's #1 Real Estate Platform</p>
        <h1 className="hero-headline">
          Find Your <span className="headline-gold">Perfect</span><br />
          Property Today
        </h1>
        <p className="hero-subtext">
          Over 12,500 verified listings across 24 cities — houses, apartments, plots & commercial spaces.
        </p>

        <div className="hero-search-box">
          <div className="search-tabs">
            {["Buy", "Rent", "New Projects"].map((tab) => (
              <button
                key={tab}
                className={`search-tab ${propType === tab ? "active-tab" : ""}`}
                onClick={() => setPropType(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="search-fields">
            <select className="search-select" value={city} onChange={(e) => setCity(e.target.value)}>
              <option>All Cities</option>
              {CITIES.map((c) => <option key={c.name}>{c.name}</option>)}
            </select>
            <input
              className="search-input"
              placeholder="Search by area, project, or keyword…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <select className="search-select" onChange={(e) => setPropType(e.target.value)}>
              <option>All Types</option>
              <option>House</option>
              <option>Apartment</option>
              <option>Plot</option>
              <option>Commercial</option>
              <option>Farmhouse</option>
              <option>Penthouse</option>
            </select>
            <button className="search-btn" onClick={handleSearch}>
              <span className="search-icon">⌕</span> Search
            </button>
          </div>
        </div>

        <div className="hero-quick-stats">
          {STATS.map((s) => (
            <div key={s.label} className="quick-stat">
              <span className="quick-stat-num">{s.number}</span>
              <span className="quick-stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}



function PropertyCard({ property, index }) {
  const [saved, setSaved] = useState(false);
  return (
    <div className="property-card" style={{ animationDelay: `${index * 0.08}s` }}>
      <div className="card-image-wrap">
        <img src={property.img} alt={property.title} className="card-image" loading="lazy" />
        <PropertyTag tag={property.tag} />
        <button className="save-btn" onClick={() => setSaved(!saved)} aria-label="Save">
          {saved ? "♥" : "♡"}
        </button>
        <div className="card-type-badge">{property.type}</div>
      </div>

      <div className="card-body">
        <div className="card-price-row">
          <span className="card-price">{property.price}</span>
          <span className="card-area">{property.area}</span>
        </div>
        <h3 className="card-title">{property.title}</h3>
        <p className="card-location">
          <span className="location-icon">📍</span> {property.location}
        </p>

        {property.beds > 0 && (
          <div className="card-features">
            <span className="feature-item"><span className="feature-icon">🛏</span> {property.beds} Beds</span>
            <span className="feature-divider">|</span>
            <span className="feature-item"><span className="feature-icon">🚿</span> {property.baths} Baths</span>
            <span className="feature-divider">|</span>
            <span className="feature-item"><span className="feature-icon">📐</span> {property.area}</span>
          </div>
        )}
        {property.beds === 0 && (
          <div className="card-features">
            <span className="feature-item"><span className="feature-icon">📐</span> {property.area}</span>
            <span className="feature-divider">|</span>
            <span className="feature-item"><span className="feature-icon">🏗</span> Plot / Land</span>
          </div>
        )}

        <div className="card-footer">
          <div className="agent-mini">
            {/* <img src={property.agentImg} alt={property.agent} className="agent-mini-img" /> */}
            {/* <span className="agent-mini-name">{property.agent}</span> */}
          </div>
          <button className="view-details-btn">View Details →</button>
        </div>
      </div>
    </div>
  );
}

function PropertiesSection({ filter }) {
  const [activeType, setActiveType] = useState("All");
  const types = ["All", "House", "Apartment", "Plot", "Commercial", "Farmhouse", "Penthouse"];

  const filtered = ALL_PROPERTIES.filter((p) => {
    const typeMatch = activeType === "All" || p.type === activeType;
    const filterMatch = !filter || filter === "All" || p.type === filter ||
      p.location.toLowerCase().includes((filter || "").toLowerCase()) ||
      p.title.toLowerCase().includes((filter || "").toLowerCase());
    return typeMatch && filterMatch;
  });

  return (
    <section id="properties" className="properties-section">
      <div className="section-header">
        <p className="section-eyebrow">Browse Listings</p>
        <h2 className="section-title">Featured <span className="gold-word">Properties</span></h2>
        <p className="section-subtitle">Handpicked premium listings across Pakistan's top cities</p>
      </div>

      <div className="filter-tabs">
        {types.map((t) => (
          <button
            key={t}
            className={`filter-tab ${activeType === t ? "active-filter" : ""}`}
            onClick={() => setActiveType(t)}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="properties-grid">
        {filtered.length > 0 ? (
          filtered.map((p, i) => <PropertyCard key={p.id} property={p} index={i} />)
        ) : (
          <div className="no-results">
            <span className="no-results-icon">🔍</span>
            <p>No properties found. Try adjusting your filters.</p>
          </div>
        )}
      </div>

      <div className="load-more-wrap">
        <button className="load-more-btn">View All Properties</button>
      </div>
    </section>
  );
}

function CitiesSection() {
  return (
    <section id="cities" className="cities-section">
      <div className="section-header">
        <p className="section-eyebrow">Explore by Location</p>
        <h2 className="section-title">Top <span className="gold-word">Cities</span></h2>
        <p className="section-subtitle">Discover properties in Pakistan's most sought-after real estate markets</p>
      </div>
      <div className="cities-grid">
        {CITIES.map((city, i) => (
          <div key={city.name} className="city-card" style={{ animationDelay: `${i * 0.1}s` }}>
            <img src={city.img} alt={city.name} className="city-img" loading="lazy" />
            <div className="city-overlay"></div>
            <div className="city-info">
              <h3 className="city-name">{city.name}</h3>
              <p className="city-count">{city.count} Properties</p>
              <button className="city-explore-btn">Explore →</button>
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
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="about" className="stats-section" ref={ref}>
      <div className="stats-bg-pattern"></div>
      <div className="stats-content">
        <div className="section-header stats-header">
          <p className="section-eyebrow light-eyebrow">Why Choose Zexan</p>
          <h2 className="section-title light-title">Pakistan's Most <span className="gold-word">Trusted</span> Platform</h2>
          <p className="section-subtitle light-sub">A decade of excellence, thousands of successful transactions, and clients who trust us completely.</p>
        </div>
        <div className={`stats-grid ${visible ? "stats-visible" : ""}`}>
          {STATS.map((s, i) => (
            <div key={s.label} className="stat-item" style={{ animationDelay: `${i * 0.15}s` }}>
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
    { icon: "🏠", title: "Buy a Property", desc: "Browse verified listings with full legal documentation, market valuations, and transparent pricing across Pakistan." },
    { icon: "🔑", title: "Rent & Lease", desc: "Find rental properties that match your lifestyle and budget, with flexible lease terms and vetted landlords." },
    { icon: "📋", title: "List Your Property", desc: "Sell or rent your property faster with our premium listing packages and access to thousands of active buyers." },
    { icon: "💼", title: "Property Management", desc: "End-to-end management solutions for landlords — tenant screening, rent collection, and maintenance coordination." },
    { icon: "📊", title: "Market Analysis", desc: "Data-driven insights on property values, market trends, and investment hotspots across Pakistan's top cities." },
    { icon: "⚖️", title: "Legal Assistance", desc: "Expert legal guidance for property transfers, registry, NOC, and documentation to ensure safe transactions." },
  ];

  return (
    <section id="services" className="services-section">
      <div className="section-header">
        <p className="section-eyebrow">What We Offer</p>
        <h2 className="section-title">Our <span className="gold-word">Services</span></h2>
        <p className="section-subtitle">Comprehensive real estate solutions for buyers, sellers, and investors</p>
      </div>
      <div className="services-grid">
        {services.map((s, i) => (
          <div key={s.title} className="service-card" style={{ animationDelay: `${i * 0.1}s` }}>
            <div className="service-icon-wrap">
              <span className="service-icon">{s.icon}</span>
            </div>
            <h3 className="service-title">{s.title}</h3>
            <p className="service-desc">{s.desc}</p>
            <button className="service-learn-btn">Learn More →</button>
          </div>
        ))}
      </div>
    </section>
  );
}

function AgentsSection() {
  return (
    <section id="agents" className="agents-section">
      <div className="section-header">
        <p className="section-eyebrow">Meet the Experts</p>
        <h2 className="section-title">Our Top <span className="gold-word">Agents</span></h2>
        <p className="section-subtitle">Award-winning property consultants with years of local market expertise</p>
      </div>
      <div className="agents-grid">
        {AGENTS.map((agent, i) => (
          <div key={agent.id} className="agent-card" style={{ animationDelay: `${i * 0.1}s` }}>
            <div className="agent-image-wrap">
              <img src={agent.img} alt={agent.name} className="agent-img" loading="lazy" />
              <div className="agent-city-badge">{agent.city}</div>
            </div>
            <div className="agent-info">
              <h3 className="agent-name">{agent.name}</h3>
              <p className="agent-title">{agent.title}</p>
              <StarRating rating={agent.rating} />
              <div className="agent-stats">
                <span className="agent-stat"><strong>{agent.deals}</strong> Deals</span>
                <span className="agent-stat-divider">|</span>
                <span className="agent-stat">⭐ {agent.rating} Rating</span>
              </div>
              <div className="agent-actions">
                <a href={`tel:${agent.phone}`} className="agent-call-btn">📞 Call</a>
                <button className="agent-msg-btn">💬 Message</button>
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
    <section className="testimonials-section">
      <div className="section-header">
        <p className="section-eyebrow">Client Stories</p>
        <h2 className="section-title">What Our <span className="gold-word">Clients</span> Say</h2>
      </div>

      <div className="testimonials-track">
        {TESTIMONIALS.map((t, i) => (
          <div key={t.name} className={`testimonial-card ${i === active ? "testimonial-active" : ""}`}>
            <div className="testimonial-quote-mark">"</div>
            <p className="testimonial-text">{t.text}</p>
            <div className="testimonial-author">
              <img src={t.img} alt={t.name} className="testimonial-img" />
              <div className="testimonial-author-info">
                <strong className="testimonial-name">{t.name}</strong>
                <span className="testimonial-role">{t.role} — {t.city}</span>
                <StarRating rating={t.rating} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="testimonial-dots">
        {TESTIMONIALS.map((_, i) => (
          <button key={i} className={`dot ${i === active ? "dot-active" : ""}`} onClick={() => setActive(i)} />
        ))}
      </div>
    </section>
  );
}

function ContactSection() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "", type: "Buy" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 4000);
    setForm({ name: "", phone: "", email: "", message: "", type: "Buy" });
  };

  return (
    <section id="contact" className="contact-section">
      <div className="contact-inner">
        <div className="contact-left">
          <p className="section-eyebrow">Get in Touch</p>
          <h2 className="contact-title">Let's Find Your <span className="gold-word">Perfect Property</span></h2>
          <p className="contact-subtitle">
            Fill out the form and one of our expert consultants will get back to you within 24 hours.
          </p>
          <div className="contact-info-list">
            <div className="contact-info-item">
              <span className="contact-info-icon">📞</span>
              <div>
                <strong>Call Us</strong>
                <p>+92 42 111 000 786</p>
              </div>
            </div>
            <div className="contact-info-item">
              <span className="contact-info-icon">📧</span>
              <div>
                <strong>Email Us</strong>
                <p>info@zexan.pk</p>
              </div>
            </div>
            <div className="contact-info-item">
              <span className="contact-info-icon">📍</span>
              <div>
                <strong>Visit Us</strong>
                <p>25-B, Gulberg III, Lahore, Pakistan</p>
              </div>
            </div>
            <div className="contact-info-item">
              <span className="contact-info-icon">🕐</span>
              <div>
                <strong>Office Hours</strong>
                <p>Mon–Sat: 9:00 AM – 7:00 PM</p>
              </div>
            </div>
          </div>
        </div>

        <div className="contact-right">
          {sent ? (
            <div className="success-message">
              <span className="success-icon">✅</span>
              <h3>Message Sent!</h3>
              <p>Our team will contact you within 24 hours.</p>
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input className="form-input" placeholder="Your full name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input className="form-input" placeholder="+92 300 0000000" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input className="form-input" type="email" placeholder="your@email.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">I'm Looking To</label>
                <select className="form-select" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                  <option>Buy</option>
                  <option>Rent</option>
                  <option>Sell</option>
                  <option>Invest</option>
                  <option>Get Valuation</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Message</label>
                <textarea className="form-textarea" rows={4} placeholder="Tell us about your property requirements…" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
              </div>
              <button type="submit" className="form-submit-btn">Send Enquiry →</button>
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
      <div className="footer-top">
        <div className="footer-brand">
          <div className="footer-logo">
            <span className="logo-icon">◆</span>
            <span>ZEXAN</span>
          </div>
          <p className="footer-desc">
            Pakistan's most trusted real estate platform. We connect buyers, sellers, and investors with the right properties across the country.
          </p>
          <div className="footer-socials">
            <a href="#" className="social-btn" aria-label="Facebook">f</a>
            <a href="#" className="social-btn" aria-label="Instagram">in</a>
            <a href="#" className="social-btn" aria-label="Twitter">𝕏</a>
            <a href="#" className="social-btn" aria-label="YouTube">▶</a>
          </div>
        </div>

        <div className="footer-links-col">
          <h4 className="footer-col-title">Quick Links</h4>
          {NAV_LINKS.map((l) => <a key={l.label} href={l.href} className="footer-link">{l.label}</a>)}
        </div>

        <div className="footer-links-col">
          <h4 className="footer-col-title">Property Types</h4>
          {["Houses", "Apartments", "Plots", "Commercial", "Farmhouses", "Penthouses", "New Projects"].map((t) => (
            <a key={t} href="#properties" className="footer-link">{t}</a>
          ))}
        </div>

        <div className="footer-links-col">
          <h4 className="footer-col-title">Top Cities</h4>
          {CITIES.map((c) => <a key={c.name} href="#cities" className="footer-link">{c.name}</a>)}
        </div>

        <div className="footer-links-col">
          <h4 className="footer-col-title">Our Services</h4>
          {["Buy Property", "Rent Property", "List Property", "Property Management", "Market Analysis", "Legal Assistance"].map((s) => (
            <a key={s} href="#services" className="footer-link">{s}</a>
          ))}
        </div>
      </div>

      <div className="footer-bottom">
        <p className="footer-copy">© 2025 Zexan Real Estate Pvt. Ltd. All rights reserved.</p>
        <div className="footer-legal">
          <a href="#" className="footer-legal-link">Privacy Policy</a>
          <a href="#" className="footer-legal-link">Terms of Service</a>
          <a href="#" className="footer-legal-link">Cookie Policy</a>
        </div>
      </div>
    </footer>
  );
}



// ─── APP ────────────────────────────────────────────────────────────────────

export default function App() {
  const [searchFilter, setSearchFilter] = useState(null);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const sections = NAV_LINKS.map((l) => l.href.replace("#", ""));
    const observers = sections.map((id) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setActiveSection(id); }, { threshold: 0.4 });
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach((o) => o?.disconnect());
  }, []);

  return (
    <div className="app">
      <Navbar activeSection={activeSection} />
      <Hero onSearch={(f) => setSearchFilter(f.query || f.city)} />
      <PropertiesSection filter={searchFilter} />
      <CitiesSection />
      <AgentsSection />
      <ServicesSection />
      <TestimonialsSection />
      <StatsSection />
      <ContactSection />
      <Footer />
    </div>
  );
} 