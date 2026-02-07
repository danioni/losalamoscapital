"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Logo } from "./Logo";

const navLinks = [
  { href: "/#performance", label: "Rendimiento" },
  { href: "/#portfolio", label: "Portafolio" },
  { href: "/#decisions", label: "Decisiones" },
  { href: "/#methodology", label: "Metodología" },
  { href: "/tesis", label: "Tesis" },
  { href: "/analisis", label: "Análisis" },
  { href: "/proyecciones", label: "Proyecciones" },
];

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <header
      style={{
        borderBottom: "1px solid rgba(45, 106, 79, 0.2)",
        padding: "1rem 0",
        backdropFilter: "blur(20px)",
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: "rgba(10, 15, 13, 0.85)",
      }}
    >
      <div
        className="header-inner"
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "0 2rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Link
          href="/"
          style={{ display: "flex", alignItems: "center", gap: "0.75rem", textDecoration: "none" }}
        >
          <Logo style={{ width: "32px", height: "32px", flexShrink: 0 }} />
          <div>
            <span
              className="header-logo-text"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.25rem",
                fontWeight: 400,
                letterSpacing: "0.02em",
                color: "#e8efe6",
                lineHeight: 1.2,
                display: "block",
              }}
            >
              Los Álamos Capital
            </span>
            <span
              className="header-subtitle"
              style={{
                fontSize: "0.65rem",
                fontWeight: 500,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#40916c",
                display: "block",
              }}
            >
              Historial de Inversiones
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="nav-responsive" style={{ display: "flex" }}>
          {navLinks.map((link) => {
            const isActive =
              !link.href.startsWith("/#") &&
              pathname === link.href;

            return (
              <a
                key={link.href}
                href={link.href}
                style={{
                  color: isActive ? "#52b788" : "#8a9e93",
                  textDecoration: "none",
                  fontSize: "0.85rem",
                  fontWeight: 500,
                  marginLeft: "2rem",
                  transition: "color 0.3s",
                  letterSpacing: "0.02em",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#52b788")}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = isActive ? "#52b788" : "#8a9e93")
                }
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        {/* Mobile hamburger button */}
        <button
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
          style={{
            display: "none",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "0.5rem",
            zIndex: 110,
          }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#e8efe6"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {mobileMenuOpen ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div
          className="mobile-menu-overlay"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "#0a0f0d",
            zIndex: 105,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: "0.5rem",
            animation: "fadeIn 0.2s ease",
          }}
          onClick={() => setMobileMenuOpen(false)}
        >
          {navLinks.map((link) => {
            const isActive =
              !link.href.startsWith("/#") &&
              pathname === link.href;

            return (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  color: isActive ? "#52b788" : "#e8efe6",
                  textDecoration: "none",
                  fontSize: "1.25rem",
                  fontWeight: 500,
                  padding: "0.75rem 2rem",
                  letterSpacing: "0.02em",
                  transition: "color 0.3s",
                  fontFamily: "var(--font-display)",
                }}
              >
                {link.label}
              </a>
            );
          })}
        </div>
      )}
    </header>
  );
}
