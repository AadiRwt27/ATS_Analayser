import { useEffect, useState } from "react";
import "./Navbar.css";

const NAV_LINKS = [
  { label: "Home", href: "#top" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Analyze", href: "#analyzer" },
];

function scrollToId(id) {
  const el = document.querySelector(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavClick = (href) => (event) => {
    event.preventDefault();
    setMenuOpen(false);
    scrollToId(href);
  };

  return (
    <header className={`navbar ${scrolled ? "navbar--scrolled" : ""}`} id="top">
      <div className="container navbar__inner">
        <a href="#top" className="navbar__brand" onClick={handleNavClick("#top")}>
          <span className="navbar__mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path
                d="M5 12.5L9.5 17L19 6.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          Resume ATS Analyzer
        </a>

        <nav className="navbar__links" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="navbar__link"
              onClick={handleNavClick(link.href)}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <button
          type="button"
          className="navbar__cta"
          onClick={handleNavClick("#analyzer")}
        >
          Get Started
        </button>

        <button
          type="button"
          className="navbar__toggle"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className={`navbar__toggle-bar ${menuOpen ? "is-open" : ""}`} />
          <span className={`navbar__toggle-bar ${menuOpen ? "is-open" : ""}`} />
        </button>
      </div>

      {menuOpen && (
        <nav id="mobile-menu" className="navbar__mobile" aria-label="Mobile">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="navbar__mobile-link"
              onClick={handleNavClick(link.href)}
            >
              {link.label}
            </a>
          ))}
          <button
            type="button"
            className="navbar__cta navbar__cta--mobile"
            onClick={handleNavClick("#analyzer")}
          >
            Get Started
          </button>
        </nav>
      )}
    </header>
  );
}
