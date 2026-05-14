import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { NAV_LINKS } from "../data/siteData";
import { useAuth } from "../context/AuthContext";

export default function SiteNavbar({ activeSection, onListProperty }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();

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
          <span className="logo-zexan">ZEXAN</span>
        </a>

        <ul className={`navbar-links ${menuOpen ? "open" : ""}`}>
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className={`nav-link ${activeSection === link.href.replace("#", "") ? "active" : ""}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="navbar-actions">
          {user ? (
            <div className="nav-user-cluster">
              <Link to="/account" className="nav-text-btn">
                Hub
              </Link>
              <span className="nav-user-name">{user.name?.split(" ")[0]}</span>
              <button type="button" className="nav-text-btn" onClick={logout}>
                Log out
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="nav-text-btn">
                Log in
              </Link>
              <Link to="/signup" className="nav-text-btn nav-join">
                Sign Up
              </Link>
            </>
          )}
          <a
            href="#contact"
            className="nav-cta-btn"
            onClick={(e) => {
              e.preventDefault();
              onListProperty ? onListProperty() : handleNavClick("#contact");
            }}
          >
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
